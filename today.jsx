/* Vire-app — Tänään (etusivu). Banneri, renkaat (piilotettavissa), fiilis,
   päivän ateriat & harjoitukset omina kenttinään. */

const MOODS = [
  { value: "great", icon: "laugh", color: "var(--sage-500)", key: "mood_great" },
  { value: "good", icon: "smile", color: "var(--brand-500)", key: "mood_good" },
  { value: "even", icon: "meh", color: "var(--lilac-500)", key: "mood_even" },
  { value: "tired", icon: "frown", color: "var(--apricot-500)", key: "mood_tired" },
  { value: "stressed", icon: "annoyed", color: "var(--coral-500)", key: "mood_stressed" },
];

function TodayScreen({ store, onGo, t, lang }) {
  const { Card, ProgressRing, Badge, Avatar, Button } = window.VS;
  const { L, Banner, SectionLabel } = window;
  const key = window.dateKey();
  const day = store.day(key);
  const totals = window.dayTotals(day);
  const g = store.state.goals;
  const p = store.state.profile;
  const name = p.name || "";
  const hideRings = store.state.settings.hideRings;

  const h = new Date().getHours();
  const greeting = h < 10 ? t("greet_morning") : h < 17 ? t("greet_day") : t("greet_evening");

  const [stepInput, setStepInput] = React.useState("");

  const rings = [
    { v: totals.steps, max: g.steps, accent: "movement", icon: "footprints", label: t("goal_steps"), val: window.numFmt(lang, totals.steps) },
    { v: totals.energy, max: g.energy, accent: "nutrition", icon: "flame", label: t("goal_energy"), val: window.numFmt(lang, totals.energy) },
    { v: totals.activeMin, max: g.activeMin, accent: "brand", icon: "activity", label: t("nav_move"), val: String(totals.activeMin) },
  ];
  const allZero = totals.steps === 0 && totals.energy === 0 && totals.activeMin === 0 && totals.water === 0;

  const avatar = p.photo
    ? <img src={p.photo} alt={name} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 2px rgba(255,255,255,0.7)" }} />
    : <Avatar name={name || "?"} size="md" />;

  return (
    <div>
      <Banner subtitle={window.longDateL(lang)} title={`${greeting}${name ? ", " + name : ""}`} right={avatar} />

      <div style={{ padding: "18px 20px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* renkaat (trendikenttä) */}
        {!hideRings ? (
          <Card padding="lg">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{t("day_goals")}</div>
              <Badge tone={allZero ? "neutral" : "success"} dot>{allZero ? t("start_logging") : t("in_good_vire")}</Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {rings.map((r) => (
                <div key={r.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                  <ProgressRing value={r.v} max={r.max} accent={r.accent} size={94} thickness={9} valueText={<L name={r.icon} size={24} />} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 16, fontVariantNumeric: "tabular-nums" }}>{r.val}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{r.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {/* fiilis */}
        <MoodField store={store} dayKey={key} t={t} lang={lang} />

        {/* askeleet */}
        <Card padding="md">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "var(--sage-100)", color: "var(--sage-700)", display: "grid", placeItems: "center" }}>
              <L name="footprints" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{t("goal_steps")}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{t("add_manually")}</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 18, fontVariantNumeric: "tabular-nums" }}>{window.numFmt(lang, totals.steps)}</div>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {[500, 1000, 2000].map((n) => (
              <Button key={n} variant="soft" size="sm" style={{ flex: 1 }} onClick={() => store.addSteps(key, n)}>+{window.numFmt(lang, n)}</Button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="number" inputMode="numeric" placeholder={t("set_value")} value={stepInput} onChange={(e) => setStepInput(e.target.value)}
              style={inputStyle} />
            <Button variant="secondary" size="sm" disabled={stepInput === ""} onClick={() => { store.setSteps(key, Math.round(Number(stepInput) || 0)); setStepInput(""); }}>{t("set_btn")}</Button>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.45 }}>{t("steps_note")}</div>
        </Card>

        {/* päivän ateriat */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 4px 10px" }}>
            <SectionLabel style={{ margin: 0 }}>{t("todays_meals")}</SectionLabel>
            <button onClick={() => onGo("ravinto")} style={linkBtn}>{t("view_all")}</button>
          </div>
          <Card padding="sm" style={{ padding: 8 }}>
            {day.meals.length === 0 ? (
              <Empty t={t} icon="utensils" label={t("no_meals_today")} onAdd={() => onGo("ravinto")} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {day.meals.slice(0, 4).map((m, i) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: i < Math.min(day.meals.length, 4) - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                    <div style={miniChip("var(--apricot-100)", "var(--apricot-700)")}><L name="utensils" size={17} /></div>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.text}</div>
                    {m.kcal ? <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>{m.kcal} kcal</span> : null}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* päivän harjoitukset */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 4px 10px" }}>
            <SectionLabel style={{ margin: 0 }}>{t("todays_workouts")}</SectionLabel>
            <button onClick={() => onGo("liike")} style={linkBtn}>{t("view_all")}</button>
          </div>
          <Card padding="sm" style={{ padding: 8 }}>
            {day.workouts.length === 0 ? (
              <Empty t={t} icon="dumbbell" label={t("no_workouts_today")} onAdd={() => onGo("liike")} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {day.workouts.slice(0, 4).map((w, i) => (
                  <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: i < Math.min(day.workouts.length, 4) - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                    <div style={miniChip("var(--sage-100)", "var(--sage-700)")}><L name="activity" size={17} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.name}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>{w.mins} {t("u_min")}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {allZero ? (
          <Card soft padding="md" style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: "var(--surface-card)", color: "var(--brand-500)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
              <L name="sparkles" size={21} />
            </div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.45 }}>{t("fresh_start")}</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function Empty({ icon, label, onAdd, t }) {
  const { L } = window;
  return (
    <button onClick={onAdd} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 10px", border: "none",
      background: "transparent", cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left",
    }}>
      <div style={miniChip("var(--ink-100)", "var(--ink-400)")}><L name={icon} size={17} /></div>
      <span style={{ flex: 1, fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
      <L name="plus-circle" size={22} color="var(--brand-500)" />
    </button>
  );
}

function MoodField({ store, dayKey, t, lang }) {
  const { Card } = window.VS;
  const { L, Dropdown, SectionLabel } = window;
  const day = store.day(dayKey);
  const opts = MOODS.map((m) => ({ value: m.value, label: t(m.key), icon: <L name={m.icon} size={18} /> }));

  // 7 viime päivän fiilikset
  const recent = window.weekDays(window.parseKey(dayKey)).map((d) => {
    const dd = store.day(window.dateKey(d));
    return { d, mood: dd.mood };
  });

  return (
    <Card padding="md">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "var(--lilac-100)", color: "var(--lilac-500)", display: "grid", placeItems: "center" }}>
          <L name="heart" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{t("mood_title")}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{t("mood_sub")}</div>
        </div>
      </div>
      <Dropdown value={day.mood} options={opts} placeholder={t("mood_pick")} icon={<L name="smile" size={18} />} onChange={(v) => store.setMood(dayKey, v)} />
      {/* viikon fiilisnauha */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>{t("mood_history")}</div>
        <div style={{ display: "flex", gap: 6 }}>
          {recent.map((r, i) => {
            const m = MOODS.find((x) => x.value === r.mood);
            const isToday = window.dateKey(r.d) === dayKey;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: "100%", aspectRatio: "1", maxWidth: 38, borderRadius: 11, display: "grid", placeItems: "center",
                  background: m ? "color-mix(in srgb, " + m.color + " 16%, transparent)" : "var(--surface-sunken)",
                  border: isToday ? "1.5px solid var(--brand-300)" : "1.5px solid transparent",
                }}>
                  {m ? <L name={m.icon} size={18} color={m.color} /> : <span style={{ width: 5, height: 5, borderRadius: 99, background: "var(--ink-300)" }}></span>}
                </div>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{window.DOW_SHORT[lang][i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

const inputStyle = {
  flex: 1, height: 40, borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)",
  padding: "0 14px", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-primary)", background: "var(--surface-card)",
};
const linkBtn = { border: "none", background: "transparent", color: "var(--brand-600)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans)" };
const miniChip = (bg, fg) => ({ width: 34, height: 34, borderRadius: 10, background: bg, color: fg, display: "grid", placeItems: "center", flexShrink: 0 });

Object.assign(window, { TodayScreen, MOODS });
