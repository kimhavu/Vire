/* Vire-app — käyttöönotto (nollasta). Nimi + tavoitteet. Monikielinen. */

function Onboarding({ onDone, t, lang, onLang }) {
  const { Card, Button, Input } = window.VS;
  const { L } = window;
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [goals, setGoals] = React.useState({ steps: 8000, energy: 2000, activeMin: 30, water: 8 });
  const setGoal = (k, v) => setGoals((g) => ({ ...g, [k]: v }));

  const langOpts = [{ value: "fi", label: "Suomi" }, { value: "en", label: "English" }, { value: "sv", label: "Svenska" }];

  const steps = [
    (
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <img src="assets/logo/vire-logomark.svg" width="64" height="64" alt="Vire" />
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10 }}>{t("ob_welcome_t")}</h1>
          <p style={{ fontSize: 16.5, color: "var(--text-secondary)", lineHeight: 1.55, maxWidth: 320 }}>{t("ob_welcome_b")}</p>
        </div>
        <Button size="lg" block onClick={() => setStep(1)} iconRight={<L name="arrow-right" size={18} />}>{t("ob_start")}</Button>
        <div style={{ display: "flex", gap: 6 }}>
          {langOpts.map((o) => (
            <button key={o.value} onClick={() => onLang(o.value)} style={{
              border: "1px solid " + (lang === o.value ? "var(--brand-400)" : "var(--border-default)"),
              background: lang === o.value ? "var(--brand-50)" : "transparent", color: lang === o.value ? "var(--brand-700)" : "var(--text-muted)",
              borderRadius: 999, padding: "5px 13px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-sans)",
            }}>{o.label}</button>
          ))}
        </div>
      </div>
    ),
    (
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <div style={stepLabel}>{t("ob_step")} 1 / 2</div>
          <h2 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>{t("ob_name_t")}</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>{t("ob_name_s")}</p>
        </div>
        <Input label={t("ob_firstname")} placeholder={t("ob_name_ph")} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="ghost" onClick={() => setStep(0)}>{t("back")}</Button>
          <Button block onClick={() => setStep(2)} disabled={!name.trim()}>{t("continue")}</Button>
        </div>
      </div>
    ),
    (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={stepLabel}>{t("ob_step")} 2 / 2</div>
          <h2 style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>{t("ob_goals_t")}</h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)" }}>{t("ob_goals_s")}</p>
        </div>
        <GoalRow icon="footprints" tint="var(--sage-500)" label={t("goal_steps")} unit={t("u_steps")} value={goals.steps} step={500} min={1000} lang={lang} onChange={(v) => setGoal("steps", v)} />
        <GoalRow icon="flame" tint="var(--apricot-500)" label={t("goal_energy")} unit={t("u_kcal")} value={goals.energy} step={50} min={800} lang={lang} onChange={(v) => setGoal("energy", v)} />
        <GoalRow icon="activity" tint="var(--brand-500)" label={t("goal_active")} unit={t("u_min")} value={goals.activeMin} step={5} min={5} lang={lang} onChange={(v) => setGoal("activeMin", v)} />
        <GoalRow icon="droplet" tint="var(--brand-400)" label={t("goal_water")} unit={t("u_glasses")} value={goals.water} step={1} min={1} lang={lang} onChange={(v) => setGoal("water", v)} />
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <Button variant="ghost" onClick={() => setStep(1)}>{t("back")}</Button>
          <Button block size="lg" onClick={() => onDone({ name: name.trim() }, goals)}>{t("ob_start_use")}</Button>
        </div>
      </div>
    ),
  ];

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "28px 18px", background: "var(--surface-page)" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Card padding="lg" style={{ padding: "32px 26px" }}>{steps[step]}</Card>
        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 18 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: i === step ? 22 : 7, height: 7, borderRadius: 999, background: i === step ? "var(--brand-500)" : "var(--ink-200)", transition: "all .24s" }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

const stepLabel = { fontSize: 13, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--brand-600)", marginBottom: 12 };

function GoalRow({ icon, tint, label, unit, value, step, min, onChange, lang }) {
  const { L } = window;
  const btn = (dir, fn) => (
    <button onClick={fn} style={{ width: 38, height: 38, borderRadius: 11, border: "1px solid var(--border-default)", background: "var(--surface-card)", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--ink-600)", flexShrink: 0 }}>
      <L name={dir} size={18} strokeWidth={2.3} />
    </button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--ink-50)", color: tint, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <L name={icon} size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{window.numFmt(lang, value)} {unit}</div>
      </div>
      {btn("minus", () => onChange(Math.max(min, value - step)))}
      {btn("plus", () => onChange(value + step))}
    </div>
  );
}

Object.assign(window, { Onboarding });
