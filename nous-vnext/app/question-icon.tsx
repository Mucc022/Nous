import { CircleDot, ListChecks, TextCursorInput, ToggleLeft, MessageSquare, BookOpenCheck, ScanSearch } from 'lucide-react';
export function QuestionIcon({type}: {type:string}) {
  const Icon = ({'单选题':CircleDot,'多选题':ListChecks,'填空题':TextCursorInput,'判断题':ToggleLeft,'简答题':MessageSquare,'解释题':BookOpenCheck,'分析题':ScanSearch})[type] ?? MessageSquare;
  return <Icon className="question-type-icon" size={16} strokeWidth={1.8} aria-hidden="true"/>;
}
