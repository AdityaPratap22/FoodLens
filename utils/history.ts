export interface HistoryEntry {
  food: string;
  mode: "barcode" | "image" | "manual";
  score: number;
  color: "green" | "yellow" | "red";
  calories?: number;
  timestamp?: string;
  [key: string]: any;
}

const HISTORY_KEY = "foodlens_history";

export function saveToHistory(entry: HistoryEntry) {
  if (!entry || typeof entry !== "object") return;

  try {
    const prev: HistoryEntry[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

    prev.unshift({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
    });

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(prev.slice(0, 50))
    );
  } catch (e) {
    console.warn("History save failed:", e);
  }
}

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}
