/* Vire-app — Profiili-moduuli: pääsivu + alasivut (omat tiedot, historiat,
   ilmoitukset, asetukset) + kirjaudu ulos. */

function ProfileModule({ store, t, lang }) {
  const [page, setPage] = React.useState("main");
  const back = () => setPage("main");
  if (page === "myinfo") return <window.MyInfoView store={store} t={t} lang={lang} onBack={back} />;
  if (page === "trainhist") return <window.HistoryView store={store} t={t} lang={lang} kind="train" onBack={back} />;
  if (page === "foodhist") return <window.HistoryView store={store} t={t} lang={lang} kind="food" onBack={back} />;
  if (page === "notif") return <window.NotificationsView store={store} t={t} onBack={back} />;
  if (page === "settings") return <window.SettingsView store={store} t={t} lang={lang} onBack={back} />;
  return <ProfileMain store={store} t={t} lang={lang} onNav={setPage} />;
}

function ProfileMain({ store, t, lang, onNav }) {
  const { Card, Avatar, Badge, Button } = window.VS;
  const { L, PageHeader, SectionLabel } = window;
  const p = store.state.profile;
  const g = store.state.goals;
  const [confirmLogout, setConfirmLogout] = React.useState(false);

  const days = Object.values(store.state.days);
  const totalMeals = days.reduce((a, d) => a + d.meals.length, 0);
  const totalWorkouts = days.reduce((a, d) => a + d.workouts.length, 0);
  const activeDays = days.filter((d) => d.meals.length || d.workouts.length || d.steps || d.water || d.mood).length;
  const sinceDate = p.since ? window.parseKey(p.since) : new Date();
  const daysSince = Math.max(1, Math.round((Date.now() - sinceDate) / 86400000) + 1);

  const menu = [
    { id: "myinfo", icon: "user-round", label: t("m_myinfo") },
    { id: "trainhist", icon: "trending-up", label: t("m_trainhist") },
    { id: "foodhist", icon: "utensils", label: t("m_foodhist") },
    { id: "notif", icon: "bell", label: t("m_notif") },
    { id: "settings", icon: "settings", label: t("m_settings") },
  ];

  const avatar = p.photo
    ? <img src={p.photo} alt={p.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 2px var(--surface-card), 0 0 0 4px var(--brand-300)" }} />
    : <Avatar name={p.name || "?"} size="xl" ring />;

  return (
    <div>
      <PageHeader title={t("profile_t")} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* identiteetti */}
        <Card padding="lg" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {avatar}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 21, fontWeight: 800 }}>{p.name || "—"}</div>
            <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 8 }}>{t("member_days", { n: daysSince })}</div>
            <Badge tone="brand" dot>{t("pilot_user")}</Badge>
          </div>
        </Card>

        {/* koonti */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[{ v: totalMeals, l: t("st_meals") }, { v: totalWorkouts, l: t("st_workouts") }, { v: activeDays, l: t("st_active") }].map((s) => (
            <Card key={s.l} padding="md" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{s.v}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{s.l}</div>
            </Card>
          ))}
        </div>

        {/* tavoitteet */}
        <div>
          <SectionLabel>{t("goals_section")}</SectionLabel>
          <Card bare style={{ overflow: "hidden", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", padding: 0 }}>
            {[
              { k: "steps", icon: "footprints", tint: "var(--sage-500)", label: t("goal_steps_l"), unit: t("u_steps"), step: 500, min: 1000 },
              { k: "energy", icon: "flame", tint: "var(--apricot-500)", label: t("goal_energy_l"), unit: t("u_kcal"), step: 50, min: 800 },
              { k: "activeMin", icon: "activity", tint: "var(--brand-500)", label: t("goal_active"), unit: t("u_min"), step: 5, min: 5 },
              { k: "water", icon: "droplet", tint: "var(--brand-400)", label: t("goal_water"), unit: t("u_glasses"), step: 1, min: 1 },
            ].map((row, i, arr) => (
              <div key={row.k} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: "var(--ink-50)", color: row.tint, display: "grid", placeItems: "center", flexShrink: 0 }}><L name={row.icon} size={19} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{row.label}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{window.numFmt(lang, g[row.k])} {row.unit}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => store.updateGoals({ [row.k]: Math.max(row.min, g[row.k] - row.step) })} style={stepBtn}><L name="minus" size={16} strokeWidth={2.4} /></button>
                  <button onClick={() => store.updateGoals({ [row.k]: g[row.k] + row.step })} style={stepBtn}><L name="plus" size={16} strokeWidth={2.4} /></button>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* valikko */}
        <div>
          <SectionLabel>{t("menu_section")}</SectionLabel>
          <Card bare style={{ overflow: "hidden", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", padding: 0 }}>
            {menu.map((m, i) => (
              <button key={m.id} onClick={() => onNav(m.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", border: "none",
                borderBottom: i < menu.length - 1 ? "1px solid var(--border-subtle)" : "none", background: "transparent",
                cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left",
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: "var(--brand-50)", color: "var(--brand-600)", display: "grid", placeItems: "center", flexShrink: 0 }}><L name={m.icon} size={19} /></div>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{m.label}</span>
                <L name="chevron-right" size={19} color="var(--ink-300)" />
              </button>
            ))}
          </Card>
        </div>

        {/* kirjaudu ulos */}
        <Card padding="md">
          {!confirmLogout ? (
            <button onClick={() => setConfirmLogout(true)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left", padding: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "var(--status-error-bg)", color: "var(--coral-700)", display: "grid", placeItems: "center", flexShrink: 0 }}><L name="log-out" size={18} /></div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "var(--coral-700)" }}>{t("m_logout")}</span>
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.45 }}>{t("logout_confirm")}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <Button variant="ghost" onClick={() => setConfirmLogout(false)}>{t("cancel")}</Button>
                <Button block variant="danger" style={{ background: "var(--coral-500)", color: "#fff" }} onClick={() => store.resetAll()}>{t("logout_yes")}</Button>
              </div>
            </div>
          )}
        </Card>

        <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", padding: "4px 0 8px", lineHeight: 1.6 }}>
          Vire · {t("version")} {store.version}<br />
          {t("data_note")}
        </div>
      </div>
    </div>
  );
}

const stepBtn = { width: 34, height: 34, borderRadius: 10, border: "1px solid var(--border-default)", background: "var(--surface-card)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-600)" };

Object.assign(window, { ProfileModule });
