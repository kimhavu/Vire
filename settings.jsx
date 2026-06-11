/* Vire-app — alasivut: Omat tiedot, Ilmoitukset, Asetukset. */

/* ---------- Omat tiedot ---------- */
function MyInfoView({ store, t, lang, onBack }) {
  const { Card, Input, Button, Avatar } = window.VS;
  const { L, PageHeader } = window;
  const p = store.state.profile;
  const [f, setF] = React.useState({ name: p.name, email: p.email, age: p.age, height: p.height, weight: p.weight });
  const [saved, setSaved] = React.useState(false);
  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setSaved(false); };
  const save = () => { store.updateProfile(f); setSaved(true); };

  const pickPhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => store.updateProfile({ photo: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <PageHeader title={t("myinfo_t")} onBack={onBack} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* kuva */}
        <Card padding="lg" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {p.photo ? (
            <img src={p.photo} alt={p.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", boxShadow: "0 0 0 2px var(--surface-card), 0 0 0 4px var(--brand-300)" }} />
          ) : <Avatar name={p.name || "?"} size="xl" ring />}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{p.name || "—"}</div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: "var(--radius-md)", background: "var(--surface-brand-soft)", color: "var(--text-brand)", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
              <L name="camera" size={16} /> {t("change_photo")}
              <input type="file" accept="image/*" onChange={pickPhoto} style={{ display: "none" }} />
            </label>
          </div>
        </Card>

        {/* kentät */}
        <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label={t("field_name")} value={f.name} onChange={(e) => set("name", e.target.value)} />
          <Input label={t("field_email")} type="email" placeholder="aino@esimerkki.fi" value={f.email} onChange={(e) => set("email", e.target.value)} optional={t("optional")} />
          <div style={{ display: "flex", gap: 10 }}>
            <Input label={t("field_age")} type="number" value={f.age} onChange={(e) => set("age", e.target.value)} style={{ flex: 1 }} optional={t("optional")} />
            <Input label={t("field_height")} type="number" value={f.height} onChange={(e) => set("height", e.target.value)} style={{ flex: 1 }} optional={t("optional")} />
            <Input label={t("field_weight")} type="number" value={f.weight} onChange={(e) => set("weight", e.target.value)} style={{ flex: 1 }} optional={t("optional")} />
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.45 }}>{t("myinfo_note")}</div>
          <Button block onClick={save} iconLeft={<L name={saved ? "check" : "save"} size={17} />}>{saved ? t("saved_ok") : t("save")}</Button>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Ilmoitukset ---------- */
function NotificationsView({ store, t, onBack }) {
  const { Card, Switch } = window.VS;
  const { L, PageHeader } = window;
  const n = store.state.settings.notif;
  const rows = [
    { k: "workout", icon: "footprints", tint: "var(--sage-500)", label: t("notif_workout"), sub: t("notif_workout_s") },
    { k: "meal", icon: "utensils", tint: "var(--apricot-500)", label: t("notif_meal"), sub: t("notif_meal_s") },
    { k: "weekly", icon: "calendar-check", tint: "var(--brand-500)", label: t("notif_weekly"), sub: t("notif_weekly_s") },
    { k: "mood", icon: "heart", tint: "var(--lilac-500)", label: t("notif_mood"), sub: t("notif_mood_s") },
  ];
  return (
    <div>
      <PageHeader title={t("notif_t")} onBack={onBack} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", margin: "-2px 4px 0", lineHeight: 1.45 }}>{t("notif_sub")}</div>
        <Card bare style={{ overflow: "hidden", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", padding: 0 }}>
          {rows.map((r, i) => (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", borderBottom: i < rows.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "var(--ink-50)", color: r.tint, display: "grid", placeItems: "center", flexShrink: 0 }}><L name={r.icon} size={19} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{r.label}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{r.sub}</div>
              </div>
              <Switch checked={!!n[r.k]} onChange={() => store.updateNotif({ [r.k]: !n[r.k] })} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ---------- Asetukset ---------- */
function SettingsView({ store, t, lang, onBack }) {
  const { Card, Switch, Button, Input } = window.VS;
  const { L, PageHeader, SectionLabel, Dropdown } = window;
  const s = store.state.settings;
  const [syncUrl, setSyncUrl] = React.useState(s.syncUrl || "");
  const [syncState, setSyncState] = React.useState(null); // null | 'loading' | 'ok' | 'fail' | 'none'
  const [confirmReset, setConfirmReset] = React.useState(false);

  const doSync = async () => {
    store.updateSettings({ syncUrl });
    if (!syncUrl) { setSyncState("none"); return; }
    setSyncState("loading");
    const res = await window.fetchPrograms(syncUrl);
    if (res.ok) { store.setPrograms(res.programs); setSyncState("ok"); }
    else setSyncState("fail");
  };

  const langOpts = [
    { value: "fi", label: t("lang_fi"), icon: <L name="languages" size={16} /> },
    { value: "en", label: t("lang_en"), icon: <L name="languages" size={16} /> },
    { value: "sv", label: t("lang_sv"), icon: <L name="languages" size={16} /> },
  ];

  return (
    <div>
      <PageHeader title={t("settings_t")} onBack={onBack} />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* ulkoasu */}
        <div>
          <SectionLabel>{t("appearance")}</SectionLabel>
          <Card bare style={{ overflow: "hidden", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", padding: 0 }}>
            <ToggleRow icon="moon" tint="var(--lilac-500)" label={t("dark_mode")} sub={t("dark_mode_s")}
              checked={s.theme === "dark"} onChange={() => store.updateSettings({ theme: s.theme === "dark" ? "light" : "dark" })} />
            <ToggleRow icon="circle-dashed" tint="var(--brand-500)" label={t("hide_rings")} sub={t("hide_rings_s")} last
              checked={s.hideRings} onChange={() => store.updateSettings({ hideRings: !s.hideRings })} />
          </Card>
        </div>

        {/* kieli */}
        <div>
          <SectionLabel>{t("language")}</SectionLabel>
          <Dropdown value={s.lang} options={langOpts} onChange={(v) => store.updateSettings({ lang: v })} icon={<L name="languages" size={18} />} />
        </div>

        {/* pilvisynkronointi */}
        <div>
          <SectionLabel>{t("cloud_section")}</SectionLabel>
          <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input label={t("sync_url")} placeholder={t("sync_url_ph")} value={syncUrl} onChange={(e) => setSyncUrl(e.target.value)} optional={t("optional")} />
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", lineHeight: 1.45 }}>{t("sync_note")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Button onClick={doSync} variant="secondary" iconLeft={<L name="refresh-cw" size={16} />}>{t("sync_now")}</Button>
              {syncState === "loading" ? <span style={{ fontSize: 13, color: "var(--text-muted)" }}>…</span> : null}
              {syncState === "ok" ? <span style={{ fontSize: 13, color: "var(--green-700)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}><L name="check-circle-2" size={16} /> {t("sync_ok")}</span> : null}
              {syncState === "fail" ? <span style={{ fontSize: 13, color: "var(--coral-700)", fontWeight: 700 }}>{t("sync_fail")}</span> : null}
              {syncState === "none" ? <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{t("sync_none")}</span> : null}
            </div>
          </Card>
        </div>

        {/* tiedot / nollaus */}
        <div>
          <SectionLabel>{t("data_section")}</SectionLabel>
          <Card padding="md">
            {!confirmReset ? (
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--status-error-bg)", color: "var(--coral-700)", display: "grid", placeItems: "center", flexShrink: 0 }}><L name="rotate-ccw" size={19} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{t("start_over")}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{t("start_over_s")}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>{t("reset_btn")}</Button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.45 }}>{t("reset_confirm")}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Button variant="ghost" onClick={() => setConfirmReset(false)}>{t("cancel")}</Button>
                  <Button block variant="danger" style={{ background: "var(--coral-500)", color: "#fff" }} onClick={() => store.resetAll()}>{t("reset_yes")}</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon, tint, label, sub, checked, onChange, last }) {
  const { Switch } = window.VS;
  const { L } = window;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", borderBottom: last ? "none" : "1px solid var(--border-subtle)" }}>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: "var(--ink-50)", color: tint, display: "grid", placeItems: "center", flexShrink: 0 }}><L name={icon} size={19} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{sub}</div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

Object.assign(window, { MyInfoView, NotificationsView, SettingsView });
