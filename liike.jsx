/* Vire-app — Liike-moduuli. Alanavigaatio: Koti / Harjoitteet / Viikko-ohjelma. */

/* Esimerkkiharjoitteet (ei dataa — paikkamerkki personoidulle ohjelmalle). */
const SAMPLE_EXERCISES = [
  { name: { fi: "Kyykky", en: "Squat", sv: "Knäböj" }, sets: "4 × 10", tone: "duotone", dur: "0:46" },
  { name: { fi: "Punnerrus", en: "Push-up", sv: "Armhävning" }, sets: "3 × 12", tone: "sage", dur: "0:38" },
  { name: { fi: "Lankku", en: "Plank", sv: "Planka" }, sets: "3 × 45 s", tone: "warm", dur: "0:33" },
];

function VideoField({ tone = "duotone", duration = "0:45", caption }) {
  const { L } = window;
  const grads = {
    natural: "linear-gradient(135deg, #6E8C7C 0%, #9FB6A8 100%)",
    duotone: "linear-gradient(140deg, #3C4A93 0%, #6B7FD7 100%)",
    warm: "linear-gradient(135deg, #B5704A 0%, #E8A87C 100%)",
    sage: "linear-gradient(135deg, #4E7C66 0%, #88B89C 100%)",
  };
  const [playing, setPlaying] = React.useState(false);
  return (
    <div onClick={() => setPlaying(true)} style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 14, overflow: "hidden", background: grads[tone], cursor: "pointer" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.32, backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)", backgroundSize: "4px 4px" }}></div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), rgba(0,0,0,0) 55%)" }}></div>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "grid", placeItems: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
          <L name={playing ? "loader" : "play"} size={23} color="var(--brand-600)" strokeWidth={2.4} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", display: "inline-flex", alignItems: "center", gap: 6 }}><L name="video" size={15} color="#fff" /> {caption}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(0,0,0,0.4)", padding: "3px 8px", borderRadius: 999, fontVariantNumeric: "tabular-nums" }}>{duration}</span>
      </div>
    </div>
  );
}

function LiikeModule({ store, onHome, t, lang }) {
  const { AppFrame, BottomNav } = window;
  const [sub, setSub] = React.useState("harjoitteet");
  const [refDate, setRefDate] = React.useState(new Date());

  const items = [
    { id: "koti", label: t("nav_home"), icon: "house", onClick: onHome },
    { id: "harjoitteet", label: t("nav_workouts"), icon: "dumbbell", active: sub === "harjoitteet", onClick: () => setSub("harjoitteet") },
    { id: "viikko", label: t("nav_week"), icon: "calendar-days", active: sub === "viikko", onClick: () => setSub("viikko") },
  ];

  const screen = sub === "viikko"
    ? <ViikkoOhjelma store={store} refDate={refDate} setRefDate={setRefDate} t={t} lang={lang} onOpenDay={(d) => { setRefDate(d); setSub("harjoitteet"); }} />
    : <Harjoitteet store={store} refDate={refDate} t={t} lang={lang} />;

  return <AppFrame bottom={<BottomNav items={items} />}>{screen}</AppFrame>;
}

function Harjoitteet({ store, refDate, t, lang }) {
  const { Card, Button, Badge, Input } = window.VS;
  const { L, PageHeader, EmptyState, SectionLabel } = window;
  const key = window.dateKey(refDate);
  const day = store.day(key);
  const isToday = key === window.dateKey();
  const [form, setForm] = React.useState(null);

  const save = () => {
    if (!form.name.trim()) return;
    store.addWorkout(key, { name: form.name.trim(), mins: Math.round(Number(form.mins) || 0), kcal: Math.round(Number(form.kcal) || 0) });
    setForm(null);
  };
  const totalMin = day.workouts.reduce((a, w) => a + (Number(w.mins) || 0), 0);
  const dateLabel = isToday ? t("nav_today") : `${window.DOW_SHORT[lang][(refDate.getDay() + 6) % 7]} ${window.shortDate(refDate, lang)}`;

  return (
    <div>
      <PageHeader title={t("move_title")} right={<Button variant="soft" size="sm" iconLeft={<L name="plus" size={16} />} onClick={() => setForm({ name: "", mins: "", kcal: "" })}>{t("log_btn")}</Button>} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, margin: "-4px 4px 0" }}>{dateLabel} · {t("week_w")} {window.isoWeek(refDate)}</div>

        {day.workouts.length > 0 ? (
          <Card padding="md" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={chip("var(--sage-100)", "var(--sage-700)", 46)}><L name="activity" size={23} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{totalMin} {t("u_min")}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{day.workouts.length} {t("workouts_today_n")}</div>
            </div>
            <Badge tone="movement" dot>{t("logged_badge")}</Badge>
          </Card>
        ) : null}

        {form ? (
          <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{t("new_workout")}</div>
            <Input label={t("what_did_you_do")} placeholder={t("workout_ph")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
            <div style={{ display: "flex", gap: 10 }}>
              <Input label={t("dur_min")} type="number" placeholder="30" value={form.mins} onChange={(e) => setForm({ ...form, mins: e.target.value })} style={{ flex: 1 }} />
              <Input label={t("energy_kcal")} type="number" placeholder="—" value={form.kcal} onChange={(e) => setForm({ ...form, kcal: e.target.value })} style={{ flex: 1 }} optional={t("optional")} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" onClick={() => setForm(null)}>{t("cancel")}</Button>
              <Button block onClick={save} disabled={!form.name.trim()}>{t("save")}</Button>
            </div>
          </Card>
        ) : null}

        {/* omat kirjaukset */}
        {day.workouts.length === 0 && !form ? (
          <EmptyState icon="dumbbell" title={t("no_entries")} body={t("log_workout_body")}
            action={<Button iconLeft={<L name="plus" size={17} />} onClick={() => setForm({ name: "", mins: "", kcal: "" })}>{t("log_workout")}</Button>} />
        ) : null}
        {day.workouts.length > 0 ? <SectionLabel>{t("my_workouts")}</SectionLabel> : null}
        {day.workouts.map((w) => (
          <Card key={w.id} flat style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px" }}>
            <div style={chip("var(--sage-100)", "var(--sage-700)", 40)}><L name="activity" size={20} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{w.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{w.mins} {t("u_min")}{w.kcal ? ` · ${w.kcal} kcal` : ""}</div>
            </div>
            <button onClick={() => store.removeWorkout(key, w.id)} style={iconBtn}><L name="trash-2" size={18} /></button>
          </Card>
        ))}

        {/* esimerkkiohjelma + videoupotus */}
        <SectionLabel style={{ marginTop: 8 }}>{t("planned_workouts")}</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SAMPLE_EXERCISES.map((ex, i) => (
            <Card key={i} padding="sm" style={{ padding: 12 }}>
              <VideoField tone={ex.tone} duration={ex.dur} caption={t("watch_technique")} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 4px 2px" }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "var(--brand-50)", color: "var(--brand-600)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{ex.name[lang] || ex.name.fi}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{ex.sets}</div>
                </div>
              </div>
            </Card>
          ))}
          <Card soft padding="md" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <L name="info" size={20} color="var(--brand-500)" />
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.45 }}>{t("sample_note")}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ViikkoOhjelma({ store, refDate, setRefDate, onOpenDay, t, lang }) {
  const { Card } = window.VS;
  const { L, PageHeader } = window;
  const days = window.weekDays(refDate);
  const wk = window.isoWeek(refDate);
  const todayKey = window.dateKey();
  const shift = (n) => { const d = new Date(refDate); d.setDate(d.getDate() + n * 7); setRefDate(d); };
  const monthRange = `${days[0].getDate()}.–${days[6].getDate()}.${days[6].getMonth() + 1}. ${days[6].getFullYear()}`;
  const totalMin = days.reduce((a, d) => a + store.day(window.dateKey(d)).workouts.reduce((x, w) => x + (Number(w.mins) || 0), 0), 0);
  const activeDays = days.filter((d) => store.day(window.dateKey(d)).workouts.length > 0).length;

  return (
    <div>
      <PageHeader title={t("week_plan_t")} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Card flat style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px" }}>
          <button onClick={() => shift(-1)} style={navBtn}><L name="chevron-left" size={20} color="var(--ink-600)" /></button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{t("week_w")} {wk}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>{monthRange}</div>
          </div>
          <button onClick={() => shift(1)} style={navBtn}><L name="chevron-right" size={20} color="var(--ink-600)" /></button>
        </Card>

        <div style={{ display: "flex", gap: 10 }}>
          <Card padding="md" style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{activeDays}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{t("active_days")}</div>
          </Card>
          <Card padding="md" style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{totalMin}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{t("min_total")}</div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {days.map((d, i) => {
            const dk = window.dateKey(d);
            const dd = store.day(dk);
            const isToday = dk === todayKey;
            const has = dd.workouts.length > 0;
            const mins = dd.workouts.reduce((a, w) => a + (Number(w.mins) || 0), 0);
            return (
              <Card key={i} flat interactive onClick={() => onOpenDay(d)} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
                border: isToday ? "1.5px solid var(--brand-300)" : "1px solid var(--border-subtle)",
                background: isToday ? "var(--brand-50)" : "var(--surface-card)",
              }}>
                <div style={{ width: 44, flexShrink: 0, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? "var(--brand-700)" : "var(--text-secondary)" }}>{window.DOW_SHORT[lang][i]}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{window.shortDate(d, lang)}</div>
                </div>
                <div style={{ width: 1, alignSelf: "stretch", background: "var(--border-subtle)" }}></div>
                <div style={chip(has ? "var(--sage-100)" : "var(--ink-100)", has ? "var(--sage-700)" : "var(--ink-400)", 38)}><L name={has ? "activity" : "circle-dashed"} size={19} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: has ? "var(--text-primary)" : "var(--text-muted)" }}>{has ? `${dd.workouts.length} ${t("workouts_count")}` : t("no_entries")}</div>
                  {has ? <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{mins} {t("u_min")}</div> : null}
                </div>
                <L name="chevron-right" size={19} color="var(--ink-300)" />
              </Card>
            );
          })}
        </div>

        <Card soft padding="md" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <L name="calendar-check" size={20} color="var(--brand-500)" />
          <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.45 }}>{t("week_note")}</div>
        </Card>
      </div>
    </div>
  );
}

const chip = (bg, fg, s) => ({ width: s, height: s, borderRadius: s >= 44 ? 14 : 11, background: bg, color: fg, display: "grid", placeItems: "center", flexShrink: 0 });
const iconBtn = { border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)", padding: 6 };
const navBtn = { border: "none", background: "var(--surface-sunken)", width: 36, height: 36, borderRadius: 11, display: "grid", placeItems: "center", cursor: "pointer" };

Object.assign(window, { LiikeModule, VideoField });
