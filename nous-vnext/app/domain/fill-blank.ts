export function blankCount(prompt: string): number {
  return (prompt.match(/_{2,}|\{\{[^}]+\}\}/g) ?? []).length;
}
export function splitBlankAnswers(answer: string): string[] {
  return answer.split(/[;；]/).map(value => value.trim()).filter(Boolean);
}

export function hasCompleteBlankResponse(prompt: string, answers: readonly string[]): boolean {
  const count = blankCount(prompt);
  return count > 0 && answers.length === count && Array.from(answers).every(answer => typeof answer === 'string' && answer.trim().length > 0);
}
