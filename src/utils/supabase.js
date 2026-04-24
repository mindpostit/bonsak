const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function saveResult(data) {
  if (!SB_URL || !SB_KEY) return;
  try {
    await fetch(SB_URL + "/rest/v1/results", {
      method: "POST",
      headers: {
        "apikey": SB_KEY,
        "Authorization": "Bearer " + SB_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({ ...data, ts: new Date().toISOString() }),
    });
  } catch (e) {
    console.error("Supabase 저장 오류:", e);
  }
}

export async function fetchStats() {
  if (!SB_URL || !SB_KEY) return [];
  try {
    const res = await fetch(SB_URL + "/rest/v1/results?select=result,gender", {
      headers: {
        "apikey": SB_KEY,
        "Authorization": "Bearer " + SB_KEY,
      },
    });
    return await res.json();
  } catch (e) {
    console.error("Supabase 조회 오류:", e);
    return [];
  }
}