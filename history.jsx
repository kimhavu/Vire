/* Vire-app — historia: Treenihistoria & Ravintohistoria (vko / 6kk / vuosi)
   + fiilishistoria. Palkkikuvaajat ilman ulkoista kirjastoa. */

function BarChart({ data, color, soft, height = 200, unit, lang }) {
  const max = Math.max(1, ...data.map((d) => d.value)) * 1.15;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: data.length > 8 ? 4 : 10, height, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", minWidth: 0 }}>
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div title={`${d.value}`} style={{
              width: data.length > 8 ? "78%" : "62%", maxWidth: 40, height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 8 : 3,
              borderRadius: 7, background: d.value > 0 ? (d.highlight ? color : soft) : "var(--ink-100)",
            }}></div>
          </div>
          <span style={{ fontSize: data.length > 8 ? 9.5 : 11.5, fontWeight: d.highlight ? 700 : 600, color: d.highlight ? "var(--text-primary)" : "var(--text-muted)", whiteSpace: "nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function aggregate(store, range, metricFn, lang) {
  const today = new Date();
  if (range === "week") {
    return window.weekDays(today).map((d, i) => ({
      label: window.DOW_SHORT[lang][i],
      value: metricFn(store.day(window.dateKey(d))),
      highlight: window.dateKey(d) === window.dateKey(),
    }));
  }
  const months = range === "6mo" ? 6 : 12;
  const buckets = [];
  for (let k = months - 1; k >= 0; k--) {
    const d = new Date(today.getFullYear(), today.getMonth() - k, 1);
    const lbl = months === 12 ? window.MONTHS_SHORT[lang][d.getMonth()].charAt(0).toUpperCase() : window.MONTHS_SHORT[lang][d.getMonth()];
    buckets.push({ y: d.getFullYear(), m: d.getMonth(), label: lbl, value: 0, highlight: k === 0 });
  }
  Object.entries(store.state.days).forEach(([key, day]) => {
    const dt = window.parseKey(key);
    const b = buckets.find((x) => x.y === dt.getFullYear() && x.m === dt.getMonth());
    if (b) b.value += metricFn(day);
  });
  return buckets;
}

function HistoryView({ store, t, lang, kind, onBack }) {
  const { Card, SegmentedControl, Badge } = window.VS;
  const { PageHeader, SectionLabel } = window;
  const [range, setRange] = React.useState("week");

  const isTrain = kind === "train";
  const metricFn = isTrain
    ? (d) => d.workouts.reduce((a, w) => a + (Number(w.mins) || 0), 0)
    : (d) => d.meals.reduce((a, m) => a + (Number(m.kcal) || 0), 0);
  const countFn = isTrain ? (d) => d.workouts.length : (d) => d.meals.length;

  const data = aggregate(store, range, metricFn, lang);
  const total = data.reduce((a, d) => a + d.value, 0);
  const nonZero = data.filter((d) => d.value > 0).length;
  const avg = nonZero ? Math.round(total / nonZero) : 0;
  const totalCount = Object.values(store.state.days).reduce((a, d) => a + countFn(d), 0);

  const color = isTrain ? "var(--sage-500)" : "var(--apricot-500)";
  const soft = isTrain ? "var(--sage-300)" : "var(--apricot-300)";
  const unit = isTrain ? t("u_min") : "kcal";

  return (
    <div>
      <PageHeader title={isTrain ? t("trainhist_t") : t("foodhist_t")} onBack={onBack} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <SegmentedControl block
          options={[{ value: "week", label: t("range_week") }, { value: "6mo", label: t("range_6mo") }, { value: "year", label: t("range_year") }]}
          value={range} onChange={setRange} />

        {/* yhteenveto */}
        <div style={{ display: "flex", gap: 10 }}>
          <Card padding="md" style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>{isTrain ? t("activemin_label") : t("energy_label")} ({t("total_label")})</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{window.numFmt(lang, total)}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{unit}</div>
          </Card>
          <Card padding="md" style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>{isTrain ? t("workouts_label") : t("st_meals")}</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{totalCount}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{t("total_label")}</div>
          </Card>
        </div>

        {/* kuvaaja */}
        <Card padding="lg">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{isTrain ? t("activemin_label") : t("energy_label")}</div>
            {total > 0 ? <Badge tone={isTrain ? "movement" : "nutrition"} dot>{t("avg_label")} {window.numFmt(lang, avg)} {unit}</Badge> : null}
          </div>
          {total === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>{t("no_history")}</div>
          ) : (
            <BarChart data={data} color={color} soft={soft} unit={unit} lang={lang} height={210} />
          )}
        </Card>

        {/* fiilishistoria */}
        <MoodHistory store={store} t={t} lang={lang} />
      </div>
    </div>
  );
}

function MoodHistory({ store, t, lang }) {
  const { Card } = window.VS;
  const { L, SectionLabel } = window;
  const MOODS = window.MOODS;
  // viimeiset 14 päivää
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() - (13 - i)); return d; });
  const any = days.some((d) => store.day(window.dateKey(d)).mood);
  return (
    <div>
      <SectionLabel>{t("mood_hist_t")}</SectionLabel>
      <Card padding="md">
        {!any ? (
          <div style={{ fontSize: 13.5, color: "var(--text-muted)", textAlign: "center", padding: "12px 0" }}>{t("no_history")}</div>
        ) : (
          <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
            {days.map((d, i) => {
              const mood = store.day(window.dateKey(d)).mood;
              const m = MOODS.find((x) => x.value === mood);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", aspectRatio: "1", maxWidth: 26, borderRadius: 8, display: "grid", placeItems: "center", background: m ? "color-mix(in srgb, " + m.color + " 18%, transparent)" : "var(--surface-sunken)" }}>
                    {m ? <L name={m.icon} size={14} color={m.color} /> : <span style={{ width: 4, height: 4, borderRadius: 99, background: "var(--ink-300)" }}></span>}
                  </div>
                  <span style={{ fontSize: 8.5, color: "var(--text-muted)", fontWeight: 600 }}>{d.getDate()}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

Object.assign(window, { HistoryView, BarChart });
