import { StudyResult } from '../services/geminiService';

const HISTORY_KEY = 'study_assistant_history';

export const saveToHistory = (result: StudyResult) => {
  const history = getHistory();
  const updatedHistory = [result, ...history];
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const getHistory = (): StudyResult[] => {
  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const getResultById = (id: string): StudyResult | undefined => {
  const history = getHistory();
  return history.find(item => item.id === id);
};
