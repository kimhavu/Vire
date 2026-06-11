/* Vire-app — tilamalli + localStorage + päivä/viikko-apurit.
   Kaikki alkaa nollasta. v0.1.1: asetukset, kieli, teema, fiilis, pilvisynkkaus. */

const STORE_KEY = "vire.app.v1";
const APP_VERSION = "0.1.1";

/* ---------- päivä & viikko ---------- */
function dateKey(d = new Date()) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseKey(key) { const [y, m, d] = key.split("-").map(Number); return new Date(y, m - 1, d); }
function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dayNum + 3);
  const firstThu = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThu.getUTCDay() + 6) % 7;
  firstThu.setUTCDate(firstThu.getUTCDate() - firstDayNum + 3);
  return 1 + Math.round((t - firstThu) / (7 * 24 * 3600 * 1000));
}
function weekDays(ref = new Date()) {
  const dow = (ref.getDay() + 6) % 7;
  const monday = new Date(ref); monday.setDate(ref.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
}
function shortDate(d, lang) {
  if (lang === "en") return `${d.getMonth() + 1}/${d.getDate()}`;
  return `${d.getDate()}.${d.getMonth() + 1}.`;
}

/* ---------- oletustila (tyhjä) ---------- */
function freshState() {
  return {
    onboarded: false,
    version: APP_VERSION,
    profile: { name: "", since: dateKey(), photo: "", email: "", age: "", height: "", weight: "" },
    goals: { steps: 8000, energy: 2000, activeMin: 30, water: 8 },
    settings: {
      lang: "fi",
      theme: "light",
      hideRings: false,
      notif: { workout: true, meal: true, weekly: true, mood: false },
      syncUrl: "",
    },
    programs: { workouts: null, nutrition: null, syncedAt: null },
    days: {}, // 'YYYY-MM-DD' -> { steps, water, meals:[], workouts:[], mood }
  };
}
function freshDay() { return { steps: 0, water: 0, meals: [], workouts: [], mood: null }; }

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return freshState();
    const saved = JSON.parse(raw);
    const base = freshState();
    return {
      ...base, ...saved,
      profile: { ...base.profile, ...(saved.profile || {}) },
      goals: { ...base.goals, ...(saved.goals || {}) },
      settings: { ...base.settings, ...(saved.settings || {}), notif: { ...base.settings.notif, ...((saved.settings || {}).notif || {}) } },
      programs: { ...base.programs, ...(saved.programs || {}) },
      version: APP_VERSION,
    };
  } catch (e) { return freshState(); }
}
function saveState(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {} }

/* ---------- React-hook ---------- */
function useVireStore() {
  const [state, setState] = React.useState(loadState);
  React.useEffect(() => { saveState(state); }, [state]);

  /* teema + kieli dokumenttiin */
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.settings.theme === "dark" ? "dark" : "light");
    document.documentElement.setAttribute("lang", state.settings.lang);
  }, [state.settings.theme, state.settings.lang]);

  const patchDayFn = (s, key, fn) => {
    const cur = s.days[key] || freshDay();
    return { ...s, days: { ...s.days, [key]: fn(cur) } };
  };

  const api = React.useMemo(() => ({
    state,
    version: APP_VERSION,
    completeOnboarding(profile, goals) {
      setState((s) => ({ ...s, onboarded: true, profile: { ...s.profile, ...profile, since: dateKey() }, goals: { ...s.goals, ...goals } }));
    },
    updateProfile(patch) { setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })); },
    updateGoals(patch) { setState((s) => ({ ...s, goals: { ...s.goals, ...patch } })); },
    updateSettings(patch) { setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })); },
    updateNotif(patch) { setState((s) => ({ ...s, settings: { ...s.settings, notif: { ...s.settings.notif, ...patch } } })); },
    setPrograms(programs) { setState((s) => ({ ...s, programs: { ...programs, syncedAt: Date.now() } })); },
    day(key = dateKey()) { return state.days[key] || freshDay(); },
    addSteps(key, n) { setState((s) => patchDayFn(s, key, (c) => ({ ...c, steps: Math.max(0, c.steps + n) }))); },
    setSteps(key, n) { setState((s) => patchDayFn(s, key, (c) => ({ ...c, steps: Math.max(0, n) }))); },
    setWater(key, n) { setState((s) => patchDayFn(s, key, (c) => ({ ...c, water: Math.max(0, n) }))); },
    setMood(key, mood) { setState((s) => patchDayFn(s, key, (c) => ({ ...c, mood }))); },
    addMeal(key, meal) { setState((s) => patchDayFn(s, key, (c) => ({ ...c, meals: [...c.meals, { id: Date.now() + Math.random(), ...meal }] }))); },
    removeMeal(key, id) { setState((s) => patchDayFn(s, key, (c) => ({ ...c, meals: c.meals.filter((m) => m.id !== id) }))); },
    addWorkout(key, w) { setState((s) => patchDayFn(s, key, (c) => ({ ...c, workouts: [...c.workouts, { id: Date.now() + Math.random(), ...w }] }))); },
    removeWorkout(key, id) { setState((s) => patchDayFn(s, key, (c) => ({ ...c, workouts: c.workouts.filter((w) => w.id !== id) }))); },
    resetAll() { const fresh = freshState(); saveState(fresh); setState(fresh); },
  }), [state]);

  return api;
}

/* päivän johdetut summat */
function dayTotals(day) {
  const energy = day.meals.reduce((a, m) => a + (Number(m.kcal) || 0), 0);
  const activeMin = day.workouts.reduce((a, w) => a + (Number(w.mins) || 0), 0);
  return { energy, activeMin, steps: day.steps || 0, water: day.water || 0 };
}

/* ---------- pilvisynkronointi (CSV tai JSON URL) ----------
   Yrittää hakea ohjelmat annetusta osoitteesta. Palauttaa { ok, programs?, error? }.
   Tukee: JSON ({workouts, nutrition}) tai yksinkertainen CSV (otsikkorivi + rivit). */
async function fetchPrograms(url) {
  if (!url) return { ok: false, error: "no-url" };
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { ok: false, error: "http-" + res.status };
    const text = await res.text();
    let programs;
    if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
      const data = JSON.parse(text);
      programs = { workouts: data.workouts || data, nutrition: data.nutrition || null };
    } else {
      // CSV → riveiksi
      const rows = text.trim().split(/\r?\n/).map((r) => r.split(","));
      const head = rows.shift() || [];
      const items = rows.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] || "").trim()])));
      programs = { workouts: items, nutrition: null };
    }
    return { ok: true, programs };
  } catch (e) {
    return { ok: false, error: String(e && e.message || e) };
  }
}

Object.assign(window, {
  useVireStore, dayTotals, dateKey, parseKey, isoWeek, weekDays, shortDate, freshDay, fetchPrograms, APP_VERSION,
});
