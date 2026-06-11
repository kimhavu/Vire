/* Vire-app — kehyksetön kuori: ikoni, runko, navigaatiot, banneri, dropdown. */

function L({ name, size = 22, color, strokeWidth }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = "";
    const i = document.createElement("i");
    i.setAttribute("data-lucide", name);
    ref.current.appendChild(i);
    const attrs = { width: size, height: size };
    if (strokeWidth) attrs["stroke-width"] = strokeWidth;
    window.lucide.createIcons({ attrs, root: ref.current });
  }, [name, size, strokeWidth]);
  return <span ref={ref} style={{ display: "inline-flex", color }}></span>;
}

/* Sisältöalue. Reilusti tilaa alalaitaan (alapalkki + hengitystila). */
function AppFrame({ children, bottom }) {
  return (
    <div style={{
      width: "100%", maxWidth: 520, margin: "0 auto", minHeight: "100%",
      background: "var(--surface-page)", position: "relative",
      display: "flex", flexDirection: "column",
      boxShadow: "0 0 0 1px var(--border-subtle)",
    }}>
      <div style={{ flex: 1, paddingBottom: 116 }}>{children}</div>
      {bottom}
    </div>
  );
}

function BottomNav({ items }) {
  return (
    <nav style={{
      position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: 0,
      width: "100%", maxWidth: 520, zIndex: 30,
      background: "var(--nav-bg, rgba(255,255,255,0.86))", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      borderTop: "1px solid var(--border-subtle)",
      paddingBottom: "max(18px, env(safe-area-inset-bottom))", paddingTop: 2,
    }}>
      <div style={{ display: "flex" }}>
        {items.map((tab) => (
          <button key={tab.id} onClick={tab.onClick} style={{
            flex: 1, border: "none", background: "transparent", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 0 4px",
            color: tab.active ? "var(--brand-500)" : "var(--ink-400)", fontFamily: "var(--font-sans)",
          }}>
            <L name={tab.icon} size={23} strokeWidth={tab.active ? 2.3 : 1.9} />
            <span style={{ fontSize: 10.5, fontWeight: tab.active ? 700 : 600, letterSpacing: ".01em" }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* Hero-banneri (etusivun yläosa): brändigradientti + valkoinen logo. */
function Banner({ title, subtitle, right }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, var(--brand-600) 0%, var(--brand-500) 45%, var(--sage-500) 130%)",
      padding: "calc(env(safe-area-inset-top) + 22px) 22px 26px",
      borderBottomLeftRadius: 26, borderBottomRightRadius: 26,
    }}>
      {/* pehmeät pallot */}
      <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 70%)", top: -70, right: -50 }}></div>
      <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)", backgroundSize: "5px 5px" }}></div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <img src="assets/logo/vire-logomark-white.svg" width="26" height="26" alt="Vire" />
            <span style={{ fontSize: 19, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>Vire</span>
          </div>
          {right}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", fontWeight: 600, marginBottom: 3 }}>{subtitle}</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>{title}</h1>
      </div>
    </div>
  );
}

/* Tavallinen sivuotsikko (alasivut). Selkeä, hieman alempana ylälaidasta. */
function PageHeader({ title, onBack, right }) {
  return (
    <div style={{ paddingTop: "calc(env(safe-area-inset-top) + 18px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 18px 14px" }}>
        {onBack ? (
          <button onClick={onBack} style={{ border: "none", background: "var(--surface-card)", width: 38, height: 38, borderRadius: 12, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
            <L name="chevron-left" size={22} color="var(--ink-700)" />
          </button>
        ) : null}
        <h1 style={{ flex: 1, fontSize: 25, fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</h1>
        {right}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, body, action }) {
  const { Card } = window.VS;
  return (
    <Card padding="lg" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 14, padding: "40px 28px" }}>
      <div style={{ width: 58, height: 58, borderRadius: 18, background: "var(--brand-50)", color: "var(--brand-500)", display: "grid", placeItems: "center" }}>
        <L name={icon} size={27} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
      {body ? <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, maxWidth: 280 }}>{body}</div> : null}
      {action}
    </Card>
  );
}

/* Kevyt dropdown-valikko (oma, ei natiivi). options = [{value,label,icon?}] */
function Dropdown({ value, options, onChange, placeholder, icon }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const sel = options.find((o) => o.value === value);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((v) => !v)} style={{
        width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10,
        padding: "12px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)",
        background: "var(--surface-card)", cursor: "pointer", fontFamily: "var(--font-sans)", textAlign: "left",
        color: sel ? "var(--text-primary)" : "var(--text-muted)", fontSize: 15,
      }}>
        {icon || (sel && sel.icon) ? <span style={{ color: "var(--brand-500)", display: "inline-flex" }}>{sel && sel.icon ? sel.icon : icon}</span> : null}
        <span style={{ flex: 1, fontWeight: sel ? 600 : 500 }}>{sel ? sel.label : (placeholder || "")}</span>
        <L name={open ? "chevron-up" : "chevron-down"} size={19} color="var(--ink-400)" />
      </button>
      {open ? (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 40,
          background: "var(--surface-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-lg)", overflow: "hidden", padding: 6,
        }}>
          {options.map((o) => (
            <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", border: "none",
              background: o.value === value ? "var(--brand-50)" : "transparent", cursor: "pointer", borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: o.value === value ? 700 : 600,
              color: o.value === value ? "var(--brand-700)" : "var(--text-primary)", textAlign: "left",
            }}>
              {o.icon ? <span style={{ display: "inline-flex", color: o.value === value ? "var(--brand-600)" : "var(--ink-500)" }}>{o.icon}</span> : null}
              <span style={{ flex: 1 }}>{o.label}</span>
              {o.value === value ? <L name="check" size={17} color="var(--brand-600)" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* Section-otsikko listoille */
function SectionLabel({ children, style }) {
  return <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 4px 10px", ...style }}>{children}</div>;
}

Object.assign(window, { L, AppFrame, BottomNav, Banner, PageHeader, EmptyState, Dropdown, SectionLabel });
