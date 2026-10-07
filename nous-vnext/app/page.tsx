"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FolderTree } from './folder-tree';
import { ThemeSettings } from './theme-settings';
import { InfoTip } from './info-tip';
import { deckId, groupDecks } from './domain/decks';
import { SidebarIcon } from './sidebar-icon';
import { SelectionGallery } from './selection-gallery';
import { countLibraryFilters, filterLibraryCards, type LibraryFilter } from './domain/library-filters';
import { legacyFolderId, FolderRepository, resolveFolderStyle } from './domain/folder-repository';
import { FolderIcon } from './folder-icons';
import { QuestionIcon } from './question-icon';
import { importPackage, previewImport } from "./domain/import-pipeline";
import { buildImportPrompt } from "./domain/import-prompt";
import { ContentRepository } from './domain/content-repository';
import { NotesRepository } from './domain/notes-repository';
import { createLocalBackup } from './domain/local-backup';
import { countDailyReviews } from './domain/daily-summary';
import { cardStatus } from './domain/card-status';
import { buildReviewEvent, type ReviewEvent } from "./domain/review-event";
import { effectiveRating } from "./domain/study-engine";
import type { LearningState } from "./domain/scheduler";
import { ReviewJournal } from './domain/review-journal';
import { commitJournalReview } from './domain/journal-review-service';
import { enqueueReviewEvent, flushReviewOutbox } from "./domain/sync-outbox";
import { gradeResponse } from "./domain/answer-grading";
import { advanceRepairPool, enqueueRepair, readyRepairIds, type RepairEntry } from "./domain/repair-pool";
import { blankCount, hasCompleteBlankResponse } from "./domain/fill-blank";
import { buildDailyQuestionQueue } from "./domain/queue";
import { appendReadyRepairs } from './domain/session-repair';
import { SourceRepository } from "./domain/source-repository";
import { readSourceFile } from './domain/source-file';
import type { SourceDocument, SourceRef, QuestionType } from "./domain/content";

type ReviewState = "new" | "due" | "learning" | "mastered";
type Rating = "remember" | "fuzzy" | "forget";

function domainQuestionType(type: Question["type"]): QuestionType {
  if (type === "单选题") return "single_choice";
  if (type === "多选题") return "multiple_choice";
  if (type === "填空题") return "fill_blank";
  if (type === "判断题") return "true_false";
  if (type === "解释题") return "explanation";
  if (type === "分析题") return "analysis";
  return "short_answer";
}

type Question = {
  id: string;
  type: "单选题" | "多选题" | "填空题" | "简答题" | "判断题" | "解释题" | "分析题";
  prompt: string;
  choices?: string[];
  answer: string;
  answerValue?: string | string[];
  hint: string;
  explanation?: string;
  note: string;
  sourceRefs?: SourceRef[];
};

type KnowledgeCard = {
  deletedAt?: string;
  contentVersion?: string;
  id: string;
  title: string;
  summary: string;
  concepts: string[];
  folder: string;
  tags: string[];
  state: ReviewState;
  reviewCount: number;
  nextReview: string;
  questions: Question[];
};


export default function Home() {
  const [initialCardData] = useState(() => {
    if (typeof window === 'undefined') return { cards: [] as KnowledgeCard[], error: '' };
    try {
      const raw = window.localStorage.getItem('nous.cards.v1');
      if (raw === null) return { cards: [] as KnowledgeCard[], error: '' };
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.some(card => !card || typeof card.id !== 'string' || typeof card.title !== 'string' || typeof card.summary !== 'string' || typeof card.folder !== 'string' || !Array.isArray(card.tags) || !Array.isArray(card.concepts) || !Array.isArray(card.questions))) throw new Error('卡片存储结构损坏');
      return { cards: parsed as KnowledgeCard[], error: '' };
    } catch (error) { return { cards: [] as KnowledgeCard[], error: error instanceof Error ? error.message : '卡片无法读取' }; }
  });
  const [cards, setCards] = useState<KnowledgeCard[]>(initialCardData.cards);
  const [trashOpen, setTrashOpen] = useState(false);
  const [folderRevision, setFolderRevision] = useState(0);
  const folders = useMemo(() => { void folderRevision; try { return typeof window === 'undefined' ? [] : new FolderRepository(window.localStorage).list(cards.map(card=>card.folder)); } catch { return []; } },[cards,folderRevision]);
  const activeCards = useMemo(() => { const deletedNames = new Set(folders.filter(folder=>folder.deletedAt).map(folder=>folder.legacyName)); return cards.filter(card=>!card.deletedAt && !deletedNames.has(card.folder)); },[cards,folders]);
  const trashedCards = cards.filter(card => card.deletedAt);
  function changeTrash(ids: string[], action: 'trash' | 'restore' | 'purge') {
    if (action === 'purge' && !window.confirm('彻底删除这些卡片？无法恢复。原始资料和历史学习记录仍保留。')) return;
    const next = action === 'purge' ? cards.filter(card => !ids.includes(card.id) || !card.deletedAt) : cards.map(card => ids.includes(card.id) ? { ...card, deletedAt: action === 'trash' ? new Date().toISOString() : undefined } : card);
    try { window.localStorage.setItem('nous.cards.v1', JSON.stringify(next)); setCards(next); setSelectedCardId(null); if (action === 'trash') setSelectedDeck(null); showToast(action === 'trash' ? '已移到废纸篓，可恢复' : action === 'restore' ? '已恢复到卡片库' : '已彻底删除卡片'); }
    catch { showToast('保存失败，操作未完成'); }
  }
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const studyDialog = useRef<HTMLDialogElement>(null);
  const studyOpen = selectedCardId !== null && selectedQuestionId !== null;
  useEffect(() => {
    const dialog = studyDialog.current;
    if (!studyOpen || !dialog) return;
    if (!dialog.open) dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; if (dialog.open) dialog.close(); };
  }, [studyOpen]);
  const [leftOpen, setLeftOpen] = useState(true);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { if (window.innerWidth <= 720) setLeftOpen(false); });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const [rightOpen, setRightOpen] = useState(true);
  const [importOpen, setImportOpen] = useState(false);
  const importDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = importDialog.current;
    if (!dialog) return;
    if (!importOpen) { if (dialog.open) dialog.close(); return; }
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; if (dialog.open) dialog.close(); };
  }, [importOpen]);
  const [search, setSearch] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const resultFileInput = useRef<HTMLInputElement>(null);
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter | null>(null);
  const [folderTitle, setFolderTitle] = useState('全部卡片');
  const [size, setSize] = useState<"compact" | "comfortable" | "large">("comfortable");
  const [answerVisible, setAnswerVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState<string | string[] | null>(null);
  const attemptStartedAt = useRef<number | null>(null);
  const submittedElapsedMs = useRef<number | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [revealedByUser, setRevealedByUser] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [answer, setAnswer] = useState("");
  const [noteDraft, setNoteDraft] = useState('');
  const [noteReadError, setNoteReadError] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [blankAnswers, setBlankAnswers] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [initialRepairData] = useState(() => {
    if (typeof window === "undefined") return { entries: [] as RepairEntry[], error: '' };
    try {
      const parsed = JSON.parse(window.localStorage.getItem("nous.repair.v1") ?? "[]");
      if (!Array.isArray(parsed)) throw new Error('回炉池结构损坏');
      const entries: RepairEntry[] = parsed.map(entry => typeof entry === 'string' ? { questionId: entry, remainingReviews: 0 } : entry);
      if (entries.some(entry => !entry || typeof entry.questionId !== 'string' || !entry.questionId || !Number.isSafeInteger(entry.remainingReviews) || entry.remainingReviews < 0)) throw new Error('回炉记录无效');
      return { entries, error: '' };
    } catch (error) { return { entries: [] as RepairEntry[], error: error instanceof Error ? error.message : '回炉池无法读取' }; }
  });
  const [repairPool, setRepairPool] = useState<RepairEntry[]>(initialRepairData.entries);
  const [initialReviewData] = useState(() => {
    if (typeof window === 'undefined') return { states: [] as LearningState[], events: [] as ReviewEvent[], error: '' };
    try { return { ...new ReviewJournal('local-user', window.localStorage).read(), error: '' }; }
    catch (error) { return { states: [] as LearningState[], events: [] as ReviewEvent[], error: error instanceof Error ? error.message : '学习记录无法读取' }; }
  });
  const [reviewEvents, setReviewEvents] = useState<ReviewEvent[]>(initialReviewData.events);
  const [learningStates, setLearningStates] = useState<LearningState[]>(initialReviewData.states);
  const [sessionQueue, setSessionQueue] = useState<ReturnType<typeof buildDailyQuestionQueue>>([]);
  const [queueNow, setQueueNow] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setQueueNow(Date.now());
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener('focus', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  const [importJson, setImportJson] = useState("");
  const [previewedJson, setPreviewedJson] = useState<string | null>(null);
  const importInFlight = useRef(false);
  const [importBusy, setImportBusy] = useState(false);
  const [importFeedback, setImportFeedback] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle');
  const [copiedSourceId, setCopiedSourceId] = useState('');
  const [activeSourceId, setActiveSourceId] = useState('');
  const [sourceBusy, setSourceBusy] = useState(false);
  const [fileDragging, setFileDragging] = useState(false);
  const fileInFlight = useRef(false);
  const sourceInFlight = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [sources, setSources] = useState<SourceDocument[]>(() => {
    if (typeof window === "undefined") return [];
    try { return new SourceRepository(window.localStorage).list(); } catch { return []; }
  });
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceText, setSourceText] = useState("");

  useEffect(() => { if (!initialCardData.error) window.localStorage.setItem("nous.cards.v1", JSON.stringify(cards)); }, [cards, initialCardData.error]);
  useEffect(() => { if (!initialRepairData.error) window.localStorage.setItem("nous.repair.v1", JSON.stringify(repairPool)); }, [repairPool, initialRepairData.error]);
  useEffect(() => { if (typeof window !== "undefined") void flushReviewOutbox(window.localStorage); }, []);
  const selectedCard = cards.find((card) => card.id === selectedCardId) ?? null;
  const selectedQuestion = selectedCard?.questions.find((question) => question.id === selectedQuestionId) ?? null;
  const dueCount = buildDailyQuestionQueue(activeCards.map(card => ({ cardId: card.id, questionIds: card.questions.map(question => question.id) })), learningStates, repairPool, new Date(queueNow)).length;
  const libraryCards = useMemo(() => activeCards.map(card => ({ ...card, questionIds: card.questions.map(question => question.id) })),[activeCards]);
  const libraryCounts = useMemo(() => countLibraryFilters(libraryCards, learningStates, new Date(queueNow)), [libraryCards, learningStates, queueNow]);
  const libraryItems: { id: LibraryFilter; label: string; icon: 'spark' | 'clock' | 'progress' | 'check' | 'tag' | 'folder' }[] = [
    { id: 'new', label: '待学习', icon: 'spark' },
    { id: 'due', label: '待复习', icon: 'clock' },
    { id: 'learning', label: '学习中', icon: 'progress' },
    { id: 'review', label: '复习中', icon: 'check' },
    { id: 'untagged', label: '无标签', icon: 'tag' },
    { id: 'uncategorized', label: '未分类', icon: 'folder' },
  ];

  const visibleCards = useMemo(() => {
    const query = search.trim().toLowerCase();
    const deckCards = selectedDeck ? libraryCards.filter(card => deckId(card) === selectedDeck) : libraryCards;
    const scoped = libraryFilter ? filterLibraryCards(deckCards, libraryFilter, learningStates, new Date(queueNow)) : folderFilter === null ? deckCards : deckCards.filter(card => legacyFolderId(card.folder) === folderFilter);
    if (!query) return scoped;
    return scoped.filter((card) =>
      [card.title, card.summary, card.folder, ...card.tags, ...card.concepts, ...card.questions.map((q) => q.prompt)]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [libraryCards, search, folderFilter, libraryFilter, learningStates, queueNow, selectedDeck]);
  const showDecks = selectedDeck === null && folderFilter === null && libraryFilter === null;
  const visibleDecks = groupDecks(visibleCards);

  function openCard(card: KnowledgeCard, questionId?: string) {
    const question = card.questions.find(item => item.id === questionId) ?? card.questions[0];
    try { setNoteDraft(question ? new NotesRepository('local-user', window.localStorage).get(question.id, question.note) : ''); setNoteReadError(false); }
    catch { setNoteReadError(true); setNoteDraft(question?.note ?? ''); showToast('笔记读取失败，请勿覆盖原数据'); }
    // eslint-disable-next-line react-hooks/purity -- Event-handler-only monotonic timing; never invoked during render.
    attemptStartedAt.current = performance.now();
    submittedElapsedMs.current = null;
    setSubmittedAnswer(null);
    setHintUsed(false);
    setSelectedCardId(card.id);
    setSelectedQuestionId(questionId ?? card.questions[0]?.id ?? null);
    setAnswerVisible(false);
    setSubmitted(false);
    setRevealedByUser(false);
    setHintVisible(false);
    setAnswer("");
    setSelectedChoices([]);
    setBlankAnswers([]);
  }

  function startToday() {
    if (initialRepairData.error) { showToast('回炉记录读取失败，请先恢复数据'); return; }
    if (initialReviewData.error) { showToast('学习记录读取失败，请先恢复数据，不要清除浏览器存储'); return; }
    const queue = buildDailyQuestionQueue(activeCards.map(card => ({ cardId: card.id, questionIds: card.questions.map(question => question.id) })), learningStates, repairPool, new Date());
    const first = queue[0];
    if (!first) { showToast("今天没有待学习题目"); return; }
    setSessionQueue(queue);
    const card = cards.find(item => item.id === first.cardId);
    if (card) openCard(card, first.questionId);
  }

  function continueSession(currentQuestionId: string, nextRepairs: RepairEntry[]) {
    if (!sessionQueue.length) return;
    const index = sessionQueue.findIndex(item => item.questionId === currentQuestionId);
    if (index < 0) return;
    const remaining = appendReadyRepairs(sessionQueue.slice(index + 1), activeCards.map(card => ({ cardId: card.id, questionIds: card.questions.map(question => question.id) })), nextRepairs);
    setSessionQueue(remaining);
    const next = remaining[0];
    if (!next) { closeCard(); showToast(nextRepairs.length ? "本轮题目已结束，仍有回炉题等待间隔" : "今日复习队列已完成"); return; }
    const card = cards.find(item => item.id === next.cardId);
    if (card) openCard(card, next.questionId);
  }

  function closeCard() {
    setSessionQueue([]);
    setSelectedCardId(null);
    setSelectedQuestionId(null);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function downloadBackup() {
    try {
      const json = createLocalBackup(window.localStorage);
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `nous-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('已请求下载本地备份，请确认浏览器下载结果；备份含原文和个人笔记');
    } catch (error) { showToast(`备份失败：${error instanceof Error ? error.message : '无法读取本地数据'}`); }
  }

  function rateQuestion(rating: Rating) {
    if (initialRepairData.error) { showToast('回炉记录读取失败，请先恢复数据'); return; }
    if (!selectedCard || !selectedQuestion || !submitted || submittedAnswer === null) return;
    const questionType = domainQuestionType(selectedQuestion.type);
    const correctness = gradeResponse(questionType, submittedAnswer, selectedQuestion.answerValue ?? selectedQuestion.answer);
    const correctForRating = correctness === null ? rating !== "forget" : correctness;
    const event = buildReviewEvent({
      userId: "local-user",
      questionId: selectedQuestion.id,
      attemptedAt: new Date().toISOString(),
      correctness: correctness === null ? "self_assessed" : correctness ? "correct" : "wrong",
      hintLevelUsed: hintUsed ? 1 : 0,
      revealedAnswer: revealedByUser,
      userRating: rating,
      effectiveRating: effectiveRating({ questionType, submitted, correct: correctForRating, hintLevelUsed: hintUsed ? 1 : 0, revealedAnswer: revealedByUser, userRating: rating }),
      responseTimeMs: submittedElapsedMs.current,
      response: Array.isArray(submittedAnswer) ? [...submittedAnswer] : submittedAnswer,
      contentVersion: selectedCard.contentVersion ?? "legacy-unversioned",
    });
    const storage = typeof window === "undefined" ? null : window.localStorage;
    const currentLearning = learningStates.find(state => state.questionId === selectedQuestion.id) ?? { userId: "local-user", questionId: selectedQuestion.id, phase: "new" as const, dueAt: null, reviewLevel: 0, lapses: 0, successfulReviews: 0 };
    const isReadyRepair = repairPool.some(entry => entry.questionId === selectedQuestion.id && entry.remainingReviews === 0);
    if (isReadyRepair && currentLearning.dueAt && event.effectiveRating !== 'forgot' && !event.revealedAnswer) {
      event.sessionRepaired = true;
    }
    let nextLearning: LearningState;
    try {
      if (!storage) throw new Error('浏览器存储不可用');
      nextLearning = commitJournalReview({ userId: 'local-user', storage, event });
    } catch (error) {
      showToast(`保存失败，已保留当前回答：${error instanceof Error ? error.message : '请检查浏览器存储'}`);
      return;
    }
    let syncQueueFailed = false;
    if (storage) {
      try {
        enqueueReviewEvent(storage, event);
        void flushReviewOutbox(storage).catch(() => showToast('学习记录已本地保存，但同步队列需要检查'));
      } catch { syncQueueFailed = true; }
    }
    const updatedCards = cards.map((card) => {
      if (card.id !== selectedCard.id) return card;
      const nextState: ReviewState = event.sessionRepaired ? "learning" : event.effectiveRating === "remember" ? "mastered" : event.effectiveRating === "fuzzy" ? "learning" : "due";
      return { ...card, state: nextState, reviewCount: card.reviewCount + 1, nextReview: nextLearning.dueAt ?? "尚未开始" };
    });
    setCards(updatedCards);
    setReviewEvents((events) => [...events, event]);
    setLearningStates((states) => [...states.filter(state => state.questionId !== selectedQuestion.id), nextLearning]);
    const advanced = advanceRepairPool(repairPool, selectedQuestion.id);
    const nextRepairs = event.effectiveRating === "forgot" ? enqueueRepair(advanced, selectedQuestion.id) : advanced;
    setRepairPool(nextRepairs);
    showToast(event.sessionRepaired ? "本轮已修复，原定复习时间不变" : event.effectiveRating === "remember" ? "已记住，复习节奏已推进" : event.effectiveRating === "fuzzy" ? "已标记模糊，将更快复习" : "已按遗忘处理，并加入本轮错题回炉");
    setSubmittedAnswer(null);
    setHintUsed(false);
    // eslint-disable-next-line react-hooks/purity -- Event-handler-only monotonic timing; never invoked during render.
    attemptStartedAt.current = performance.now();
    submittedElapsedMs.current = null;
    setAnswerVisible(false);
    setSubmitted(false);
    setRevealedByUser(false);
    setHintVisible(false);
    setAnswer("");
    setSelectedChoices([]);
    setBlankAnswers([]);
    continueSession(selectedQuestion.id, nextRepairs);
    if (syncQueueFailed) showToast('学习记录已本地保存，但尚未加入同步队列，请勿清除浏览器数据');
  }

  function skipQuestion() {
    if (initialRepairData.error) { showToast('回炉记录读取失败，请先恢复数据'); return; }
    if (!selectedQuestion) return;
    const event = buildReviewEvent({
      userId: 'local-user', questionId: selectedQuestion.id, attemptedAt: new Date().toISOString(),
      correctness: 'skipped', hintLevelUsed: hintUsed ? 1 : 0, revealedAnswer: revealedByUser,
      userRating: 'skip', effectiveRating: 'forgot', contentVersion: selectedCard?.contentVersion ?? 'legacy-unversioned',
      // eslint-disable-next-line react-hooks/purity -- Event-handler-only monotonic timing; never invoked during render.
      responseTimeMs: attemptStartedAt.current === null ? null : Math.max(0, Math.round(performance.now() - attemptStartedAt.current)),
      response: submittedAnswer ?? answer,
    });
    try {
      const next = commitJournalReview({ userId: 'local-user', storage: window.localStorage, event });
      setLearningStates(states => [...states.filter(state => state.questionId !== selectedQuestion.id), next]);
      setReviewEvents(events => [...events, event]);
    } catch (error) {
      showToast(`跳过记录保存失败：${error instanceof Error ? error.message : '请检查存储'}`); return;
    }
    try {
      enqueueReviewEvent(window.localStorage, event);
      void flushReviewOutbox(window.localStorage).catch(() => showToast('跳过已本地保存，同步尚未完成'));
    } catch { showToast('跳过已本地保存，同步尚未完成'); }
    const nextRepairs = enqueueRepair(advanceRepairPool(repairPool, selectedQuestion.id), selectedQuestion.id);
    setRepairPool(nextRepairs);
    showToast("已跳过，会在本轮最后重新出现");
    continueSession(selectedQuestion.id, nextRepairs);
  }

  function submitAnswer() {
    if (!selectedQuestion || !answer.trim()) { showToast("请先写下你的回答，再提交"); return; }
    if (selectedQuestion.type === '填空题' && blankCount(selectedQuestion.prompt) > 0 && !hasCompleteBlankResponse(selectedQuestion.prompt, blankAnswers)) {
      showToast('请填写每个空位，再提交'); return;
    }
    if (submitted) return;
    // eslint-disable-next-line react-hooks/purity -- Event-handler-only monotonic timing; never invoked during render.
    submittedElapsedMs.current = attemptStartedAt.current === null ? null : Math.max(0, Math.round(performance.now() - attemptStartedAt.current));
    setSubmittedAnswer(selectedQuestion.type === '多选题' && selectedQuestion.choices ? [...selectedChoices] : selectedQuestion.type === '填空题' && blankCount(selectedQuestion.prompt) > 0 ? [...blankAnswers] : answer);
    setSubmitted(true);
    setAnswerVisible(true);
    setRevealedByUser(false);
    showToast("回答已提交，现在查看反馈并自评");
  }

  function toggleChoice(choice: string) {
    if (!selectedQuestion || submitted) return;
    if (selectedQuestion.type !== "多选题") { setAnswer(choice); return; }
    const next = selectedChoices.includes(choice) ? selectedChoices.filter(item => item !== choice) : [...selectedChoices, choice];
    setSelectedChoices(next);
    setAnswer(next.join("；"));
  }

  function updateBlankAnswer(index: number, value: string) {
    if (submitted) return;
    const next = [...blankAnswers];
    next[index] = value;
    setBlankAnswers(next);
    setAnswer(next.join("；"));
  }

  function revealAnswer() {
    if (!submitted) { showToast("请先提交你的回答"); return; }
    setAnswerVisible(true);
    setRevealedByUser(true);
  }

  function updateNote(value: string) {
    if (!selectedCard || !selectedQuestion || noteReadError) return;
    try { new NotesRepository('local-user', window.localStorage).save(selectedQuestion.id, value); setNoteDraft(value); }
    catch { showToast('笔记保存失败，请检查浏览器存储'); }
  }

  async function copyPrompt() {
    if (copyState === 'copying') return;
    setCopyState('copying');
    try {
      const savedSources = new SourceRepository(window.localStorage).list();
      const selected = savedSources.find(source => source.sourceId === activeSourceId);
      if (!selected) throw new Error('请先选择本次要学习的资料');
      const prompt = buildImportPrompt([selected]);
      setGeneratedPrompt(prompt);
      if (!navigator.clipboard) throw new Error("此浏览器暂不支持剪贴板，请在 HTTPS 页面重试");
      await navigator.clipboard.writeText(prompt);
      setCopiedSourceId(selected.sourceId); setCopyState('copied');
      showToast(`已复制「${selected.title}」的出题提示词和原文`);
    } catch (error) {
      setCopyState('failed');
      setImportFeedback(error instanceof Error ? error.message : "复制失败，请重试");
    }
  }

  async function acceptImport() {
    if (importInFlight.current) return;
    if (initialCardData.error) { setImportFeedback('请先恢复卡片存储，原数据未覆盖'); return; }
    if (previewedJson !== importJson) { setImportFeedback('请先预览当前题库'); return; }
    importInFlight.current = true;
    setImportBusy(true);
    try {
      const originals = new SourceRepository(window.localStorage).list();
      const imported = importPackage(importJson, originals);
      const packageId = await new ContentRepository(window.localStorage).save(imported);
      const nextCards = imported.cards.map((card): KnowledgeCard => ({
        id: `${packageId}:card:${card.cardId}`, contentVersion: imported.contentVersion, title: card.title, summary: card.summary ?? "", concepts: card.tags ?? [], folder: imported.title, tags: card.tags ?? [], state: "new", reviewCount: 0, nextReview: "尚未开始",
        questions: card.questions.map((question) => ({ id: `${packageId}:question:${question.questionId}`, type: question.type === "single_choice" ? "单选题" : question.type === "multiple_choice" ? "多选题" : question.type === "fill_blank" ? "填空题" : question.type === "true_false" ? "判断题" : question.type === "explanation" ? "解释题" : question.type === "analysis" ? "分析题" : "简答题", prompt: question.prompt, choices: question.type === "true_false" ? ["正确", "错误"] : question.choices, answerValue: question.answer, answer: Array.isArray(question.answer) ? question.answer.join("；") : question.answer, hint: question.hint ?? "", explanation: question.explanation, note: "", sourceRefs: question.sourceRefs }))
      }));
      const mergedCards = [...cards, ...nextCards.filter(next => !cards.some(card => card.id === next.id))];
      window.localStorage.setItem('nous.cards.v1', JSON.stringify(mergedCards));
      setCards(mergedCards);
      setSelectedDeck(packageId); setFolderFilter(null); setLibraryFilter(null); setSearch(''); setFolderTitle(imported.title); setImportOpen(false);
      setImportFeedback(`已导入卡组「${imported.title}」`); showToast(`✓ 卡组「${imported.title}」已保存，包含 ${nextCards.length} 张卡片`);
      setPreviewedJson(null);
    } catch (error) { setImportFeedback(error instanceof Error ? error.message : "导入失败"); }
    finally { importInFlight.current = false; setImportBusy(false); }
  }

  function previewOnly() {
    try {
      const originals = new SourceRepository(window.localStorage).list();
      const result = previewImport(importJson, originals);
      if (result.package && activeSourceId && (result.package.sources.length !== 1 || result.package.sources[0].sourceId !== activeSourceId)) {
        setPreviewedJson(null);
        setImportFeedback('AI 返回的题库没有使用你本次选择的资料。请重新复制这份资料的出题提示词，发给 AI 生成后再粘贴。');
        return;
      }
      setPreviewedJson(result.package ? importJson : null);
      setImportFeedback(result.package
        ? `预览：${result.cards} 张卡片，${result.questions} 道题，${result.sources} 份来源。引用片段 ${result.coverage?.referencedChunks ?? 0}/${result.coverage?.totalChunks ?? 0}（不代表语义覆盖或答案正确）。确认后才导入。`
        : result.errors.map(issue => `${issue.path}: ${issue.message}`).join('\n'));
    } catch (error) { setPreviewedJson(null); setImportFeedback(error instanceof Error ? error.message : '预览失败'); }
  }

  async function saveSource(title = sourceTitle, text = sourceText) {
    if (typeof window === "undefined") return;
    if (sourceInFlight.current) return;
    sourceInFlight.current = true;
    setSourceBusy(true); setActiveSourceId(''); setGeneratedPrompt(''); setPreviewedJson(null);
    try {
      const repository = new SourceRepository(window.localStorage);
      const saved = await repository.addText(title, text);
      setSources(repository.list()); setSourceTitle(""); setSourceText("");
      setActiveSourceId(saved.sourceId);
      setImportFeedback(`「${saved.title}」已保存。下一步：复制出题提示词。`);
    } catch (error) { setImportFeedback(error instanceof Error ? error.message : "原文保存失败"); }
    finally { sourceInFlight.current = false; setSourceBusy(false); }
  }

  async function loadSourceFile(file: File) {
    if (fileInFlight.current || sourceInFlight.current) { setImportFeedback('资料正在保存，请稍等再添加。'); return; }
    fileInFlight.current = true; setSourceBusy(true);
    setActiveSourceId(''); setGeneratedPrompt(''); setPreviewedJson(null);
    setImportFeedback(`正在读取「${file.name}」…`);
    try {
      const loaded = await readSourceFile(file);
      await saveSource(loaded.title, loaded.text);
    } catch (error) { setImportFeedback(error instanceof Error ? error.message : '文件读取失败'); }
    finally { fileInFlight.current = false; setSourceBusy(false); }
  }

  return (
    <main className="workspace">
      {initialRepairData.error && <p role="alert">回炉记录读取失败：{initialRepairData.error}。原数据未覆盖，请勿清除浏览器存储。</p>}
      {initialCardData.error && <p role="alert">卡片读取失败：{initialCardData.error}。原数据已保留，请勿清除浏览器存储。</p>}
      {initialReviewData.error && <p role="alert">学习记录读取失败：{initialReviewData.error}。原数据未删除，请勿清除浏览器存储；恢复后刷新页面。</p>}
      <header className="topbar">
        <button className="mobile-menu" aria-label={leftOpen ? '收起导航' : '展开导航'} aria-expanded={leftOpen} onClick={() => setLeftOpen(value => !value)}>☰</button>
        <div className="brand"><span className="brand-mark">N</span><span>Nous</span><small>知识内化工作台</small></div>
        <label className="global-search"><span>搜索</span><input ref={searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="卡片、题目、标签、笔记" /></label>
      </header>

      <div className={`app-grid ${leftOpen ? "left-visible" : "left-hidden"} ${rightOpen ? "right-visible" : "right-hidden"}`}>
        <aside className="sidebar left-sidebar">
          <div className="sidebar-heading"><span>我的空间</span><button className="icon-button" title="收起导航" onClick={() => setLeftOpen(false)}>‹</button></div>
          <FolderTree cards={cards} onChange={() => setFolderRevision(value=>value+1)} selected={folderFilter} onSelect={(id, title) => { setSelectedDeck(null); setLibraryFilter(null); setFolderFilter(id); setFolderTitle(title); if (window.innerWidth <= 720) setLeftOpen(false); }}>
            <div className="library-filter-list">
              {libraryItems.map(item => <button key={item.id} className={`library-filter-item ${libraryFilter === item.id ? 'selected' : ''}`} aria-current={libraryFilter === item.id ? 'page' : undefined} onClick={() => { setSelectedDeck(null); setLibraryFilter(item.id); setFolderFilter(null); setFolderTitle(item.label); if (window.innerWidth <= 720) setLeftOpen(false); }}><SidebarIcon name={item.icon}/><span>{item.label}</span><span className="library-count">{libraryCounts[item.id]}</span></button>)}
            </div>
          </FolderTree>
          <div className="sidebar-bottom">
            <button className="nav-link sidebar-action" onClick={startToday}><SidebarIcon name="sun"/><span>今日复习</span><span className="library-count">{dueCount}</span></button>
            <button className="nav-link sidebar-action overview-action" onClick={() => setRightOpen(true)}><SidebarIcon name="chart"/><span>学习概览</span></button>
            <button className="create-button sidebar-import" onClick={() => setImportOpen(true)}>＋ 导入资料</button>
            <ThemeSettings onBackup={downloadBackup} onImport={() => setImportOpen(true)} />
            <button className="nav-link sidebar-action" onClick={() => setTrashOpen(true)}><SidebarIcon name="trash"/><span>废纸篓</span><span className="library-count">{trashedCards.length}</span></button>
          </div>
        </aside>

        <section className="content-area">
          {selectedDeck && <button className="quiet-button" onClick={() => changeTrash(activeCards.filter(card => deckId(card) === selectedDeck).map(card => card.id), 'trash')}>将此卡组移到废纸篓</button>}
          <div className="page-heading">
            {!leftOpen && <button className="icon-button" title="展开知识库" onClick={() => setLeftOpen(true)}>›</button>}
            <div>{selectedDeck && <button className="quiet-button" onClick={() => { setSelectedDeck(null); setFolderTitle('全部卡组'); }}>‹ 返回卡组</button>}<p className="eyebrow">{showDecks ? '全部卡组' : folderTitle}</p><h1>{showDecks ? '你的卡组' : selectedDeck ? folderTitle : '你的知识卡片'}</h1></div>
            <div className="view-controls" aria-label="卡片大小">
              <button className={size === "compact" ? "active" : ""} onClick={() => setSize("compact")}>小</button>
              <button className={size === "comfortable" ? "active" : ""} onClick={() => setSize("comfortable")}>中</button>
              <button className={size === "large" ? "active" : ""} onClick={() => setSize("large")}>大</button>
            </div>
          </div>

          <section className="today-strip">
            <div><span className="soft-dot"></span><strong>当前有 {dueCount} 道题待学习</strong><p>包含新题、已到期题和满足间隔的回炉题。</p></div>
            <button className="primary-button" onClick={startToday}>开始今日复习</button>
          </section>

          <SelectionGallery key={`${selectedDeck}-${folderFilter}-${libraryFilter}-${search}`} className={`card-gallery ${size}`} items={showDecks ? visibleDecks.map(deck => deck.cards.map(card => card.id)) : visibleCards.map(card => [card.id])} onTrash={ids => changeTrash(ids, 'trash')}>
            {showDecks ? visibleDecks.map(deck => <button className="knowledge-card deck-card" key={deck.id} onClick={() => { setSelectedDeck(deck.id); setFolderTitle(deck.title); setSearch(''); }}><span className="deck-symbol"><FolderIcon name={resolveFolderStyle(legacyFolderId(deck.cards[0].folder),folders).icon} color={resolveFolderStyle(legacyFolderId(deck.cards[0].folder),folders).color}/>卡组</span><h2>{deck.title}</h2><p>{deck.cards.slice(0, 3).map(card => card.title).join('、')}{deck.cards.length > 3 ? '…' : ''}</p><footer><span>{deck.cards.length} 张卡片 · {deck.questionCount} 道题</span><span>打开卡组 ›</span></footer></button>) : visibleCards.map((card) => <div className="knowledge-card" key={card.id} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openCard(card); }} onClick={() => openCard(card)}>
              <div className="card-topline"><FolderIcon name={resolveFolderStyle(legacyFolderId(card.folder),folders).icon} color={resolveFolderStyle(legacyFolderId(card.folder),folders).color}/><span className={`state-pill ${cardStatus(card.questions.map(question => question.id), learningStates, new Date(queueNow))}`}>{({new: "待学习", due: "待复习", learning: "学习中", review: "复习中"})[cardStatus(card.questions.map(question => question.id), learningStates, new Date(queueNow))]}</span><button className="star-button" aria-label="收藏此卡片" onClick={(event) => { event.stopPropagation(); showToast("已加入重点卡片"); }}>☆</button></div>
              <h2>{card.title}</h2>
              <button className="quiet-button" onKeyDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); changeTrash([card.id], 'trash'); }}>移到废纸篓</button>
              <p>{card.summary}</p>
              <div className="concepts">{card.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div>
              <footer><span>{card.questions.length} 个子题</span><span>第 {card.reviewCount || 0} 次复习</span></footer>
            </div>)}
          </SelectionGallery>
          {!visibleCards.length && <div className="empty-state">{!activeCards.length ? '知识库还是空的。可以导入资料，或从废纸篓恢复卡片。' : search.trim() ? '没有找到相关卡片。试试更短的关键词。' : libraryFilter ? `“${folderTitle}”里还没有卡片，可以查看其他分类。` : '这个文件夹还没有卡片，可以查看其他文件夹。'}</div>}
          {trashOpen && <div className="trash-panel" role="region" aria-label="废纸篓"><h2>废纸篓</h2><button className="quiet-button" onClick={() => setTrashOpen(false)}>关闭废纸篓</button><p>移入这里的卡片不会参与复习。彻底删除不可恢复；原始资料和学习历史独立保留。</p>{groupDecks(trashedCards).map(deck => <section key={deck.id}><h3>{deck.title} · {deck.cards.length} 张</h3><button onClick={() => changeTrash(deck.cards.map(card => card.id), 'restore')}>恢复卡组</button><button onClick={() => changeTrash(deck.cards.map(card => card.id), 'purge')}>彻底删除</button></section>)}{folders.filter(folder=>folder.deletedAt && !folders.some(parent=>parent.id===folder.parentId && parent.deletedAt)).map(folder=><section key={folder.id}><h3>文件夹：{folder.name}</h3><button onClick={()=>{try {new FolderRepository(window.localStorage).setTrash(folder.id,false,cards.map(card=>card.folder));setFolderRevision(value=>value+1);showToast('文件夹已恢复');}catch{showToast('恢复失败');}}}>恢复文件夹与内容</button></section>)}{!trashedCards.length && !folders.some(folder=>folder.deletedAt) && <p>废纸篓是空的</p>}</div>}
        </section>

        <aside className="sidebar right-sidebar">
          <div className="sidebar-heading"><span>学习概览</span><button className="icon-button" title="收起学习概览" onClick={() => setRightOpen(false)}>›</button></div>
          <div className="metric"><span>今日学习记录</span><strong>{countDailyReviews(reviewEvents, new Date())}</strong><small>按本地日期统计，包含跳过与回炉</small></div>
          <div className="metric-row"><div className="metric small"><span>待复习</span><strong>{dueCount}</strong></div><div className="metric small"><span>错题回炉</span><strong>{readyRepairIds(repairPool).length}</strong></div></div>
          <section className="review-plan"><div className="section-label">复习节奏</div><p>每道题独立安排复习。展开题目中的学习记录，可查看实际评分和下次复习时间。</p></section>
          <section className="guide-list"><div className="section-label">开始使用</div><button onClick={() => setImportOpen(true)}>1. 保存资料并生成题库 <span>›</span></button><button onClick={() => setImportOpen(true)}>2. 预览并导入题库 <span>›</span></button><button onClick={startToday}>3. 开始今天的复习 <span>›</span></button></section>
          {!rightOpen && <button className="floating-expand" onClick={() => setRightOpen(true)}>‹ 概览</button>}
        </aside>
      </div>

      {/* Native dialog backdrop dismissal supplements the close button and native Escape handling. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog ref={importDialog} className={`import-modal ${fileDragging ? 'file-dragging' : ''}`} aria-label="AI 导入工作流" onCancel={() => { setImportOpen(false); setFileDragging(false); }} onDragOver={event => {
        if (!Array.from(event.dataTransfer.types).includes('Files')) return;
        event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; setFileDragging(true);
      }} onDragLeave={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFileDragging(false);
      }} onDrop={event => {
        if (!Array.from(event.dataTransfer.types).includes('Files')) return;
        event.preventDefault(); setFileDragging(false);
        const files = Array.from(event.dataTransfer.files);
        if (files.length !== 1) { setImportFeedback('请一次拖入一份资料，保存后再添加下一份。'); return; }
        void loadSourceFile(files[0]);
      }} onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setImportOpen(false);
      }}>
      <section className="import-drawer open">
        {fileDragging && <div className="file-drop-hint" aria-live="polite">松手即可保存这份资料<span>支持 .srt、.txt、.md</span></div>}
        <div className="drawer-heading"><div><p className="eyebrow">从桌面文件开始</p><h2>把课堂资料变成学习卡片</h2></div><button className="icon-button" aria-label="关闭导入" onClick={() => setImportOpen(false)}>×</button></div>
        <section className="import-stage"><h3><b>1</b> 添加资料 <InfoTip label="支持哪些资料？">支持 UTF-8 的 .srt 字幕、.txt 和 .md，单份最多 2 MB。录音请先转成字幕。资料保存在当前浏览器。</InfoTip></h3><p>拖入文件，或点击下面的按钮。添加后自动保存。</p>
          <button className="primary-button full file-pick-button" disabled={sourceBusy} onClick={() => fileInput.current?.click()}>{sourceBusy ? '正在保存资料…' : '选择电脑里的资料'}</button>
          <input ref={fileInput} hidden aria-label="选择电脑里的资料文件" type="file" accept=".txt,.md,.srt" disabled={sourceBusy} onChange={async event => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (!file) return;
            await loadSourceFile(file);
          }} />
          {(sourceBusy || !activeSourceId) && importFeedback && <p className="import-feedback file-feedback" role="status">{importFeedback}</p>}
          {sources.length > 0 && <label className="saved-source-picker">或使用已保存的资料<select aria-label="本次学习资料" value={activeSourceId} disabled={sourceBusy} onChange={event => { setActiveSourceId(event.target.value); setGeneratedPrompt(''); setPreviewedJson(null); setImportFeedback(''); }}><option value="">请选择一份资料</option>{sources.map(source => <option key={source.sourceId} value={source.sourceId}>{source.title}</option>)}</select></label>}
          <details className="paste-source-option"><summary>没有文件？直接粘贴文字</summary><div className="source-entry"><input aria-label="资料标题" value={sourceTitle} onChange={event => setSourceTitle(event.target.value)} placeholder="给资料起个名字"/><textarea aria-label="资料原文" value={sourceText} onChange={event => setSourceText(event.target.value)} placeholder="把课堂文字粘贴到这里"/><button className="quiet-button" onClick={() => void saveSource()} disabled={!sourceText.trim() || sourceBusy}>保存这份文字</button></div></details>
          {activeSourceId && <div className="selected-source-status" role="status">✓ 已保存：<strong>{sources.find(source => source.sourceId === activeSourceId)?.title}</strong></div>}
        </section>
        <section className="import-stage"><h3><b>2</b> 让 AI 出题 <InfoTip label="出题提示词包含什么？">提示词已包含你选中的原文与题库格式，无需另附文件。发送前请确认课堂资料适合分享给所选 AI 服务。</InfoTip></h3><p>复制后，粘贴到 Chatsol 或你常用的 AI 对话里发送。</p><button className={`primary-button full ${copyState === 'copied' && copiedSourceId === activeSourceId ? 'action-success' : ''}`} aria-busy={copyState === 'copying'} onClick={copyPrompt} disabled={!activeSourceId || sourceBusy || copyState === 'copying'}>{copyState === 'copying' ? '正在复制…' : copyState === 'copied' && copiedSourceId === activeSourceId ? '✓ 已复制 · 再复制一次' : '复制出题提示词'}</button>
          {copyState === 'copied' && copiedSourceId === activeSourceId && <p className="action-feedback" role="status">已复制，现在去 AI 对话中粘贴并发送。</p>}
          {copyState === 'failed' && <p className="action-feedback" role="alert">未能复制，请展开下方内容手动复制。</p>}
          {generatedPrompt && <details open={copyState === 'failed'}><summary>查看提示词 / 手动复制</summary><textarea aria-label="生成的 Nous 提示词" readOnly value={generatedPrompt} onFocus={event => event.currentTarget.select()}/></details>}
        </section>
        <section className="import-stage"><h3><b>3</b> 导入 AI 的结果 <InfoTip label="如何导入 AI 回复？">复制 AI 返回的完整 JSON 题库，预览后检查卡片和题目数量，通过验证后点击确认导入。报错时把提示交给 AI 修改。</InfoTip></h3><p>粘贴完整题库，预览后确认导入。</p>
        <button className="quiet-button result-file-button" onClick={() => resultFileInput.current?.click()}>选择 AI 生成的 JSON 文件</button>
        <input ref={resultFileInput} hidden type="file" accept=".json,application/json" aria-label="选择题库 JSON 文件" onChange={async event => {
          const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (!file) return;
          setPreviewedJson(null); setImportJson('');
          try {
            if (!/\.json$/i.test(file.name)) throw new Error('请选择 .json 题库文件');
            if (file.size > 10 * 1024 * 1024) throw new Error('题库文件不能超过 10 MB');
            const text = new TextDecoder('utf-8', {fatal:true}).decode(await file.arrayBuffer()).replace(/^\uFEFF/,'');
            JSON.parse(text); setImportJson(text); setImportFeedback(`已读取「${file.name}」，请点击预览题库。`);
          } catch (error) { setImportFeedback(error instanceof Error ? error.message : '题库文件读取失败'); }
        }}/>
        <textarea aria-label="AI 生成的题库" value={importJson} onChange={(event) => setImportJson(event.target.value)} placeholder="在这里粘贴 AI 回复的完整 JSON 题库"></textarea>
        {importFeedback && <p className="import-feedback" role="status">{importFeedback}</p>}
        <button className="primary-button full" disabled={!importJson.trim()} onClick={previewOnly}>预览题库</button>
        {previewedJson === importJson && <button className="primary-button full" disabled={importBusy} onClick={acceptImport}>{importBusy ? '正在保存…' : '确认导入'}</button>}
        </section>
      </section>
      </dialog>

      {selectedCard && selectedQuestion && <dialog ref={studyDialog} className="modal-backdrop" aria-label="学习题目" onCancel={event => {event.preventDefault();closeCard();}}>
        <section className="card-detail">
          <header className="detail-header"><div><p className="eyebrow">{selectedCard.folder}</p><h2>{selectedCard.title}</h2></div><div className="detail-tools"><button className="star-button" title="收藏">☆</button><button className="icon-button" onClick={closeCard} title="关闭">×</button></div></header>
          <div className="detail-layout">
            <aside className="question-nav"><p>子题列表</p>{selectedCard.questions.map((question, index) => <button key={question.id} className={question.id === selectedQuestion.id ? "selected" : ""} onClick={() => openCard(selectedCard, question.id)}><span>{String(index + 1).padStart(2, "0")}</span><QuestionIcon type={question.type}/>{question.type}</button>)}<details><summary>来源依据</summary>{selectedQuestion.sourceRefs?.length ? selectedQuestion.sourceRefs.map((ref, index) => { const source = sources.find(item => item.sourceId === ref.sourceId); const chunk = source?.chunks.find(item => item.chunkId === ref.chunkId); return <div key={index}><p>{source?.title ?? ref.sourceId} · {ref.chunkId}</p><blockquote>{ref.quote}</blockquote><p style={{ whiteSpace: "pre-wrap" }}>{chunk?.text ?? "原文暂不可用，请检查来源存储"}</p></div>; }) : <p>此题没有保存来源引用，不能视为来源已绑定。</p>}</details></aside>
            <div className="study-surface">
              <div className="question-meta"><span className="state-pill learning"><QuestionIcon type={selectedQuestion.type}/>{selectedQuestion.type}</span><span>第 {selectedCard.reviewCount + 1} 次复习</span></div>
              <h3>{selectedQuestion.prompt}</h3>
              <details>
                <summary>学习记录与下次复习</summary>
                <p>下次复习：{learningStates.find(state => state.questionId === selectedQuestion.id)?.dueAt ?? '尚未安排'}</p>
                {reviewEvents.filter(event => event.questionId === selectedQuestion.id).length === 0 && <p>暂无学习记录</p>}
                {reviewEvents.filter(event => event.questionId === selectedQuestion.id).slice().reverse().map(event => <div key={event.eventId}>
                  <p>{event.attemptedAt} · 自评 {event.userRating} → 实际 {event.effectiveRating}</p>
                  <p>结果：{event.correctness}；提示等级：{event.hintLevelUsed}；主动查看答案：{event.revealedAnswer ? '是' : '否'}；本轮修复：{event.sessionRepaired ? '是' : '否'}</p>
                  <p>调度器：{event.schedulerVersion}；内容版本：{event.contentVersion}；作答耗时：{event.responseTimeMs === null ? '未记录' : `${event.responseTimeMs} 毫秒`}</p>
                </div>)}
              </details>
              {selectedQuestion.choices && <div className="choice-list">{selectedQuestion.choices.map((choice) => <button key={choice} disabled={submitted} className={(selectedQuestion.type === "多选题" ? selectedChoices.includes(choice) : answer === choice) ? "chosen" : ""} onClick={() => toggleChoice(choice)}><span>{String.fromCharCode(65 + selectedQuestion.choices!.indexOf(choice))}</span>{choice}</button>)}</div>}
              {!selectedQuestion.choices && selectedQuestion.type === "填空题" && blankCount(selectedQuestion.prompt) > 0 ? <div className="blank-list">{Array.from({ length: blankCount(selectedQuestion.prompt) }, (_, index) => <input key={index} className="blank-input" disabled={submitted} value={blankAnswers[index] ?? ""} onChange={(event) => updateBlankAnswer(index, event.target.value)} placeholder={`第 ${index + 1} 空`} />)}</div> : !selectedQuestion.choices && <textarea className="answer-box" disabled={submitted} value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="先用自己的话回答，再查看答案"></textarea>}
              <div className="subtle-actions"><button onClick={() => { setHintVisible((visible) => !visible); setHintUsed(true); if (!hintVisible) showToast("本题将按“模糊”记录"); }}>提示</button><button onClick={skipQuestion}>跳过</button></div>
              {hintVisible && <p className="hint">提示：{selectedQuestion.hint}</p>}
              {!submitted && <button className="reveal-button" onClick={submitAnswer}>提交回答</button>}
              {submitted && !revealedByUser && <button className="reveal-button" onClick={revealAnswer}>查看参考答案</button>}
              {answerVisible && <div className="answer-reveal"><span>参考答案</span><p>{selectedQuestion.answer}</p>{selectedQuestion.explanation && <section><h4>解析</h4><p>{selectedQuestion.explanation}</p></section>}<div className="reinforce"><strong>摘要与核心概念</strong><p>{selectedCard.summary}</p><div className="concepts">{selectedCard.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div></div><label className="note-field"><span>{noteReadError ? "笔记读取失败，编辑已锁定" : "我的笔记"}</span><textarea disabled={noteReadError} value={noteDraft} onChange={(event) => updateNote(event.target.value)} placeholder="看完答案后，写下你自己的理解或易错点"></textarea></label></div>}
            </div>
          </div>
          <footer className="review-bar"><button className="review-info">第 {selectedCard.reviewCount + 1} 轮 · 下次按结果安排 <span>⌃</span></button><div className="rating-actions"><button className="remember" disabled={!submitted} onClick={() => rateQuestion("remember")}>记住</button><button className="fuzzy" disabled={!submitted} onClick={() => rateQuestion("fuzzy")}>模糊</button><button className="forget" disabled={!submitted} onClick={() => rateQuestion("forget")}>忘记</button></div></footer>
        </section>
      </dialog>}
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
