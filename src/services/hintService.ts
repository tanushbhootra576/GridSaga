
'use server';

const HINT_LIMIT = 25;

// This is a placeholder for a real database implementation (e.g., Firestore).
// For now, it simulates a global count that resets periodically.
const COUNT_KEY = 'globalHintCount';
const TIMESTAMP_KEY = 'globalHintTimestamp';

let hintData: { count: number; timestamp: number } = {
  count: 0,
  timestamp: Date.now(),
};

async function getHintData() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // This check simulates a daily reset. In a real app, this would be
  // handled by a cron job or a database rule.
  if (now - hintData.timestamp > oneDay) {
    hintData = {
      count: 0,
      timestamp: now,
    };
  }
  return hintData;
}

export async function getHintCount(): Promise<number> {
  const data = await getHintData();
  return data.count;
}

export async function incrementHintCount(): Promise<void> {
  const data = await getHintData();
  if (data.count < HINT_LIMIT) {
    data.count += 1;
  }
}
