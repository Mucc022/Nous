import type { NousPackage, Question, SourceDocument } from "./content";
import { PACKAGE_FORMAT } from "./content";
import { blankCount } from './fill-blank';
import { gradeResponse } from './answer-grading';
import Ajv2020 from "ajv/dist/2020.js";
import schema from "../../schema/nous-package-v0.1.schema.json";

export type ValidationIssue = { path: string; message: string; severity: "error" | "warning" };
export type ValidationResult = { valid: boolean; errors: ValidationIssue[]; warnings: ValidationIssue[] };

const questionTypes = new Set([
  "single_choice", "multiple_choice", "true_false", "fill_blank",
  "short_answer", "explanation", "analysis",
]);

const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const schemaValidator = new Ajv2020({ allErrors: true, strict: false }).compile(schema);

function validateSourceRef(ref: unknown, path: string, sources: Map<string, SourceDocument>, errors: ValidationIssue[]) {
  if (!ref || typeof ref !== "object") { errors.push({ path, message: "sourceRef must be an object", severity: "error" }); return; }
  const value = ref as Record<string, unknown>;
  if (!text(value.sourceId) || !text(value.chunkId) || !text(value.quote)) { errors.push({ path, message: "sourceRef requires sourceId, chunkId, and quote", severity: "error" }); return; }
  const source = sources.get(value.sourceId);
  const chunk = source?.chunks.find((item) => item.chunkId === value.chunkId);
  if (!source) errors.push({ path: `${path}.sourceId`, message: "source does not exist", severity: "error" });
  else if (!chunk) errors.push({ path: `${path}.chunkId`, message: "chunk does not exist", severity: "error" });
  else if (!chunk.text.includes(value.quote)) errors.push({ path: `${path}.quote`, message: "quote is not found in chunk", severity: "error" });
}

function validateQuestion(question: unknown, path: string, sources: Map<string, SourceDocument>, errors: ValidationIssue[]) {
  if (!question || typeof question !== "object") { errors.push({ path, message: "question must be an object", severity: "error" }); return; }
  const value = question as Partial<Question>;
  if (value.type === 'single_choice' || value.type === 'multiple_choice') {
    const choices = value.choices;
    const answers = Array.isArray(value.answer) ? value.answer : [value.answer];
    if (!Array.isArray(choices) || choices.length < 2 || !choices.every(text) || new Set(choices).size !== choices.length || !answers.length || new Set(answers).size !== answers.length || !answers.every(answer => typeof answer === 'string' && choices.includes(answer))) {
      errors.push({ path: `${path}.choices`, message: 'choice questions require distinct options and matching correct answers', severity: 'error' });
    }
  }
  if (!text(value.questionId) || !text(value.prompt)) errors.push({ path, message: "questionId and prompt are required", severity: "error" });
  if (!text(value.type) || !questionTypes.has(value.type)) errors.push({ path: `${path}.type`, message: "unknown question type", severity: "error" });
  if (!(text(value.answer) || (Array.isArray(value.answer) && value.answer.length > 0 && value.answer.every(text)))) errors.push({ path: `${path}.answer`, message: "answer is required", severity: "error" });
  if (!Array.isArray(value.sourceRefs) || value.sourceRefs.length === 0) errors.push({ path: `${path}.sourceRefs`, message: "at least one sourceRef is required", severity: "error" });
  else value.sourceRefs.forEach((ref, index) => validateSourceRef(ref, `${path}.sourceRefs[${index}]`, sources, errors));
  if (value.type === "single_choice" && Array.isArray(value.answer)) errors.push({ path: `${path}.answer`, message: "single_choice requires one correct answer", severity: "error" });
  if (value.type === "multiple_choice" && !Array.isArray(value.answer)) errors.push({ path: `${path}.answer`, message: "multiple_choice requires an answer array", severity: "error" });
  if (value.type === 'fill_blank' && typeof value.prompt === 'string') {
    const blanks = blankCount(value.prompt);
    const answers = Array.isArray(value.answer) ? value.answer : typeof value.answer === 'string' ? value.answer.split(/[;；]/) : [];
    if (blanks === 0 || answers.length !== blanks || !answers.every(text)) errors.push({ path: `${path}.answer`, message: 'fill_blank requires one nonempty answer per blank', severity: 'error' });
  }
  if (value.type === 'true_false' && (typeof value.answer !== 'string' || gradeResponse('true_false', value.answer, value.answer) !== true)) {
    errors.push({ path: `${path}.answer`, message: 'true_false requires a recognized boolean answer', severity: 'error' });
  }
}

export function validateNousPackage(input: unknown): ValidationResult {
  const errors: ValidationIssue[] = [], warnings: ValidationIssue[] = [];
  if (!schemaValidator(input)) {
    for (const issue of schemaValidator.errors ?? []) errors.push({ path: issue.instancePath || "$", message: `Schema: ${issue.message ?? "invalid value"}`, severity: "error" });
    return { valid: false, errors, warnings };
  }
  if (!input || typeof input !== "object") return { valid: false, errors: [{ path: "$", message: "package must be an object", severity: "error" }], warnings };
  const value = input as Partial<NousPackage>;
  const rejectDuplicates = (ids: string[], path: string) => {
    const seen = new Set<string>();
    ids.forEach((id, index) => {
      if (seen.has(id)) errors.push({ path: `${path}[${index}]`, message: `duplicate identifier: ${id}`, severity: 'error' });
      seen.add(id);
    });
  };
  rejectDuplicates((value.cards ?? []).map(card => card.cardId), '$.cards');
  rejectDuplicates((value.cards ?? []).flatMap(card => card.questions.map(question => question.questionId)), '$.questions');
  rejectDuplicates((value.sources ?? []).map(source => source.sourceId), '$.sources');
  (value.sources ?? []).forEach((source, index) => rejectDuplicates(source.chunks.map(chunk => chunk.chunkId), `$.sources[${index}].chunks`));
  if (value.format !== PACKAGE_FORMAT) errors.push({ path: "$.format", message: `format must be ${PACKAGE_FORMAT}`, severity: "error" });
  if (!text(value.contentVersion) || !text(value.title)) errors.push({ path: "$", message: "contentVersion and title are required", severity: "error" });
  if (!Array.isArray(value.sources) || value.sources.length === 0) errors.push({ path: "$.sources", message: "at least one source is required", severity: "error" });
  if (!Array.isArray(value.cards) || value.cards.length === 0) errors.push({ path: "$.cards", message: "at least one card is required", severity: "error" });
  const sources = new Map((value.sources ?? []).filter((source): source is SourceDocument => Boolean(source && typeof source === "object" && text(source.sourceId))).map((source) => [source.sourceId, source]));
  (value.cards ?? []).forEach((card, index) => {
    const path = `$.cards[${index}]`;
    if (!card || typeof card !== "object" || !text(card.cardId) || !text(card.title) || !Array.isArray(card.questions) || card.questions.length === 0) errors.push({ path, message: "cardId, title, and at least one question are required", severity: "error" });
    else card.questions.forEach((question, questionIndex) => validateQuestion(question, `${path}.questions[${questionIndex}]`, sources, errors));
  });
  return { valid: errors.length === 0, errors, warnings };
}

export function parseAndValidateNousPackage(json: string): NousPackage {
  let parsed: unknown;
  try { parsed = JSON.parse(json); } catch { throw new Error("Import must be valid JSON"); }
  const result = validateNousPackage(parsed);
  if (!result.valid) throw new Error(result.errors.map((issue) => `${issue.path}: ${issue.message}`).join("; "));
  return parsed as NousPackage;
}
