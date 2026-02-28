const KEY = "jobnyaha_train";

export type TrainStorage = {
  words?: {
    pronoun: string;
    catchphrases: string[];
    endings: string[];
  };
  personality?: Record<string, number>;
  episode?: {
    text: string;
  };
};

export function loadTrainData(): TrainStorage {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveTrainData(patch: Partial<TrainStorage>): void {
  const existing = loadTrainData();
  localStorage.setItem(KEY, JSON.stringify({ ...existing, ...patch }));
}
