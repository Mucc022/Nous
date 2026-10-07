import type { QuestionType } from './content';

const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
const booleanValue = (value: string): boolean | null => {
  const normalized = normalize(value);
  if (['true', 't', 'yes', 'y', '真', '正确', '对'].includes(normalized)) return true;
  if (['false', 'f', 'no', 'n', '假', '错误', '错'].includes(normalized)) return false;
  return null;
};
const asArray = (value: string | string[]) => (Array.isArray(value) ? value : value.split(/[;；]/)).map(normalize);

export function gradeResponse(type: QuestionType, response: string | string[], expected: string | string[]): boolean | null {
  if (type === 'short_answer' || type === 'explanation' || type === 'analysis') return null;
  if (type === 'multiple_choice' || type === 'fill_blank') {
    const actual = asArray(response); const target = asArray(expected);
    if (!actual.length || !target.length || actual.some(item => !item) || target.some(item => !item)) return false;
    if (type === 'multiple_choice') { actual.sort(); target.sort(); }
    return actual.length === target.length && actual.every((item, index) => item === target[index]);
  }
  if ((Array.isArray(response) && response.length !== 1) || (Array.isArray(expected) && expected.length !== 1)) return false;
  const actual = normalize(Array.isArray(response) ? response[0] : response);
  const target = normalize(Array.isArray(expected) ? expected[0] : expected);
  if (!actual || !target) return false;
  if (type === 'true_false') {
    const actualBoolean = booleanValue(actual), targetBoolean = booleanValue(target);
    return actualBoolean !== null && targetBoolean !== null && actualBoolean === targetBoolean;
  }
  return actual === target;
}
