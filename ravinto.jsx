/* Vire-app — Ravinto-moduuli. Alanavigaatio: Koti / Yleisnäkymä / Ruokapäiväkirja. */

const ATERIAT = [
  { id: "aamiainen", key: "meal_breakfast", icon: "sunrise" },
  { id: "lounas", key: "meal_lunch", icon: "sun" },
  { id: "valipala", key: "meal_snack", icon: "apple" },
  { id: "paivallinen", key: "meal_dinner", icon: "moon" },
];

const PIKAVALINNAT = [
  { name: { fi: "Kaurapuuro", en: "Oatmeal", sv: "Havregröt" }, kcal: 210 },
  { name: { fi: "Ruisleipä & juusto", en: "Rye bread & cheese", sv: "Rågbröd & ost" }, kcal: 180 },
  { name: { fi: "Kananmuna", en: "Egg", sv: "Ägg" }, kcal: 78 },
  { name: { fi: "Banaani", en: "Banana", sv: "Banan" }, kcal: 105 },
  { name: { fi: "Kanasalaatti", en: "Chicken salad", sv: "Kycklingsallad" }, kcal: 340 },
  { name: { fi: "Lohi & peruna", en: "Salmon & potato", sv: "Lax & potatis" }, kcal: 520 },
  { name: { fi: "Jogurtti & marjat", en: "Yogurt & berries", sv: "Yoghurt & bär" }, kcal: 160 },
  { name: { fi: "Kahvi & maito", en: "Coffee & milk", sv: "Kaffe & mjölk" }, kcal: 40 },
];

function RavintoModule({ store, onHome, t, lang }) {
  const { AppFrame, BottomNav } = window;
  const [sub, setSub] = React.useState("yleis");
  const items = [
    { id: "koti", label: t("nav_home"), icon: "house", onClick: onHome },
    { id: "yleis", label: t("nav_overview"), icon: "pie-chart", active: sub === "yleis", onClick: () => setSub("yleis") },
    { id: "kirja", label: t("nav_diary"), icon: "notebook-pen", active: sub === "kirja", onClick: () => setSub("kirja") },
  ];
  const screen = sub === "kirja"
    ? <Ruokapaivakirja store={store} t={t} lang={lang} />
    : <RavintoYleis store={store} t={t} lang={lang} onLog={() => setSub("kirja")} />;
  return <AppFrame bottom={<BottomNav items={items} />}>{screen}</AppFrame>;
}

function RavintoYleis({ store, onLog, t, lang }) {
  const { Card, ProgressRing, Button, Badge } = window.VS;
  const { L, PageHeader } = window;
  const key = window.dateKey();
  const day = store.day(key);
  const g = store.state.goals;
  const totals = window.dayTotals(day);
  const remaining = Math.max(0, g.energy - totals.energy);
  const byMeal = ATERIAT.map((a) => {
    const ms = day.meals.filter((m) => m.slot === a.id);
    return { ...a, kcal: ms.reduce((x, m) => x + (Number(m.kcal) || 0), 0), count: ms.length };
  });

  return (
    <div>
      <PageHeader title={t("food_title")} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, margin: "-4px 4px 0" }}>{window.longDateL(lang)}</div>

        {/* ateriat */}
        <Card padding="md">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t("todays_meals")}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {byMeal.map((m, i) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 0", borderBottom: i < byMeal.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                <div style={chip(m.count ? "var(--apricot-100)" : "var(--ink-100)", m.count ? "var(--apricot-700)" : "var(--ink-400)")}><L name={m.icon} size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{t(m.key)}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{m.count ? `${m.count} ${t("entries_n")}` : t("not_logged")}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: m.count ? "var(--text-secondary)" : "var(--ink-300)", fontVariantNumeric: "tabular-nums" }}>{m.kcal ? `${m.kcal} kcal` : "—"}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* avaa ruokapäiväkirja — aterioiden ja energiaseurannan välissä */}
        <Button block variant="soft" iconLeft={<L name="notebook-pen" size={18} />} onClick={onLog}>{t("open_diary")}</Button>

        {/* energiaseuranta — nopea vilaus */}
        <Card padding="lg">
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <ProgressRing value={totals.energy} max={g.energy} accent="nutrition" valueText={window.numFmt(lang, totals.energy)} label={`/ ${window.numFmt(lang, g.energy)} kcal`} size={120} thickness={11} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{t("remaining")}</div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{window.numFmt(lang, remaining)} kcal</div>
              <div style={{ marginTop: 8 }}>
                <Badge tone={totals.energy === 0 ? "neutral" : "success"} dot>{totals.energy === 0 ? t("no_logs_yet") : t("good_balance")}</Badge>
              </div>
            </div>
          </div>
        </Card>

        <WaterCard store={store} dayKey={key} t={t} />
      </div>
    </div>
  );
}

function WaterCard({ store, dayKey, t }) {
  const { Card } = window.VS;
  const { L } = window;
  const day = store.day(dayKey);
  const goal = store.state.goals.water;
  const water = day.water || 0;
  return (
    <Card padding="md">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <L name="droplet" size={20} color="var(--brand-500)" />
        <span style={{ fontWeight: 700, fontSize: 15 }}>{t("goal_water")}</span>
        <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600 }}>{water} / {goal} {t("u_glasses")}</span>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {Array.from({ length: goal }).map((_, i) => (
          <div key={i} onClick={() => store.setWater(dayKey, water === i + 1 ? i : i + 1)} style={{
            flex: "1 1 0", minWidth: 28, height: 38, borderRadius: 10, cursor: "pointer",
            background: i < water ? "var(--brand-100)" : "var(--surface-sunken)",
            border: i < water ? "1.5px solid var(--brand-300)" : "1.5px solid transparent", display: "grid", placeItems: "center",
          }}>
            <L name="droplet" size={16} color={i < water ? "var(--brand-500)" : "var(--ink-300)"} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function Ruokapaivakirja({ store, t, lang }) {
  const { Card, Button, Input, Badge } = window.VS;
  const { L, PageHeader, Dropdown, SectionLabel } = window;
  const key = window.dateKey();
  const day = store.day(key);
  const [slot, setSlot] = React.useState("aamiainen");
  const [text, setText] = React.useState("");
  const [kcal, setKcal] = React.useState("");

  const addFree = () => {
    if (!text.trim()) return;
    store.addMeal(key, { slot, text: text.trim(), kcal: Math.round(Number(kcal) || 0) });
    setText(""); setKcal("");
  };
  const addQuick = (idx) => {
    const q = PIKAVALINNAT[idx];
    store.addMeal(key, { slot, text: q.name[lang] || q.name.fi, kcal: q.kcal });
  };

  const slotMeals = day.meals.filter((m) => m.slot === slot);
  const menuOpts = PIKAVALINNAT.map((q, i) => ({ value: String(i), label: `${q.name[lang] || q.name.fi} · ${q.kcal} kcal`, icon: <L name="utensils" size={16} /> }));

  return (
    <div>
      <PageHeader title={t("nav_diary")} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, margin: "-4px 4px 0" }}>{window.longDateL(lang)}</div>

        {/* ateriavalinta — visuaalinen merkki kun kirjattu */}
        <div style={{ display: "flex", gap: 8 }}>
          {ATERIAT.map((a) => {
            const on = slot === a.id;
            const logged = day.meals.some((m) => m.slot === a.id);
            return (
              <button key={a.id} onClick={() => setSlot(a.id)} style={{
                position: "relative", flex: 1, border: on ? "1.5px solid var(--brand-400)" : "1px solid var(--border-default)",
                background: on ? "var(--brand-50)" : (logged ? "var(--sage-100)" : "var(--surface-card)"), borderRadius: "var(--radius-md)",
                padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                color: on ? "var(--brand-700)" : (logged ? "var(--sage-700)" : "var(--ink-500)"), fontFamily: "var(--font-sans)",
              }}>
                {logged ? (
                  <span style={{ position: "absolute", top: 5, right: 5, width: 14, height: 14, borderRadius: "50%", background: "var(--sage-500)", display: "grid", placeItems: "center" }}>
                    <L name="check" size={10} color="#fff" strokeWidth={3.5} />
                  </span>
                ) : null}
                <L name={a.icon} size={19} />
                <span style={{ fontSize: 11, fontWeight: on || logged ? 700 : 600 }}>{t(a.key)}</span>
              </button>
            );
          })}
        </div>

        {/* vapaa kirjaus */}
        <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{t("write_self")} — {t(ATERIAT.find((a) => a.id === slot).key).toLowerCase()}</div>
          <textarea placeholder={t("meal_ph")} value={text} onChange={(e) => setText(e.target.value)} rows={2}
            style={{ width: "100%", boxSizing: "border-box", resize: "none", borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", padding: "11px 14px", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-primary)", background: "var(--surface-card)", lineHeight: 1.45 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 130 }}>
              <Input type="number" placeholder="kcal" value={kcal} onChange={(e) => setKcal(e.target.value)} optional={t("optional")} />
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
              <Button block onClick={addFree} disabled={!text.trim()} iconLeft={<L name="plus" size={17} />}>{t("add")}</Button>
            </div>
          </div>

          {/* dropvalikko: valitse valikosta */}
          <div>
            <SectionLabel style={{ margin: "4px 0 8px" }}>{t("choose_menu")}</SectionLabel>
            <Dropdown value="" options={menuOpts} placeholder={t("choose_menu")} icon={<L name="list" size={18} />} onChange={(v) => addQuick(Number(v))} />
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.45 }}>{t("menu_note")}</div>
          </div>
        </Card>

        {/* kirjaukset tälle aterialle */}
        <SectionLabel>{t(ATERIAT.find((a) => a.id === slot).key)} — {t("logged_label")}</SectionLabel>
        {slotMeals.length === 0 ? (
          <Card flat style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 14px" }}>
            <div style={chip("var(--ink-100)", "var(--ink-400)")}><L name="utensils" size={17} /></div>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{t("no_meals_slot")}</span>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {slotMeals.map((m) => (
              <Card key={m.id} flat style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px" }}>
                <div style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600, lineHeight: 1.35 }}>{m.text}</div>
                {m.kcal ? <Badge tone="nutrition">{m.kcal} kcal</Badge> : null}
                <button onClick={() => store.removeMeal(key, m.id)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-400)", padding: 4 }}><L name="trash-2" size={17} /></button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const chip = (bg, fg) => ({ width: 36, height: 36, borderRadius: 11, background: bg, color: fg, display: "grid", placeItems: "center", flexShrink: 0 });

Object.assign(window, { RavintoModule, ATERIAT });
