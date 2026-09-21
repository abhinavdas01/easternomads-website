import { useEffect, useRef, useState } from "react";
import { controls, contrast, fonts, presets, sanitizeTheme, scopes, storageKey, themeCss, validValue, type Control, type Scope, type Theme, type Tokens } from "./themeModel";
import "./theme-editor.css";

function readSaved(): Theme {
  try { return sanitizeTheme(JSON.parse(localStorage.getItem(storageKey) || "{}")); } catch { return {}; }
}

function ColorField({ control, value, onChange }: { control: Control; value: string; onChange: (value: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? value;
  const valid = validValue(control, text);
  return <div className="theme-studio__color">
    <input type="color" aria-label={`${control.label} picker`} value={value} onChange={e => onChange(e.target.value)} />
    <input id={`theme-${control.name}`} aria-label={control.label} value={text} spellCheck={false} maxLength={7} aria-invalid={!valid} onChange={e => { if (validValue(control, e.target.value)) { setDraft(null); onChange(e.target.value); } else setDraft(e.target.value); }} onBlur={() => setDraft(null)} />
  </div>;
}

export default function ThemeEditor() {
  const [theme, setThemeState] = useState<Theme>(readSaved);
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<Scope>("global");
  const [original, setOriginal] = useState(false);
  const [message, setMessage] = useState("Colors save automatically in this browser.");
  const [storageError, setStorageError] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [defaults] = useState<Tokens>(() => {
    const styles = getComputedStyle(document.documentElement);
    return Object.fromEntries(controls.map(c => [c.name, styles.getPropertyValue(c.name).trim() || (c.name === "--section-bg" ? styles.getPropertyValue("--paper").trim() : "")]));
  });

  const setTheme = (update: Theme | ((previous: Theme) => Theme)) => {
    const next = sanitizeTheme(typeof update === "function" ? update(theme) : update);
    setThemeState(next);
    try {
      if (Object.keys(next).length) localStorage.setItem(storageKey, JSON.stringify(next));
      else localStorage.removeItem(storageKey);
      setStorageError(false);
    } catch { setStorageError(true); }
  };
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);

  const value = (name: string) => theme[scope]?.[name] ?? theme.global?.[name] ?? defaults[name];
  const change = (name: string, next: string) => {
    const control = controls.find(c => c.name === name)!;
    if (!validValue(control, next)) return;
    setOriginal(false);
    setTheme(prev => ({ ...prev, [scope]: { ...prev[scope], [name]: next } }));
    setMessage("Preview updated. Your choice is saved in this browser.");
  };
  const resetScope = () => {
    setTheme(prev => { const next = { ...prev }; delete next[scope]; return next; });
    setOriginal(false); setMessage(`${scopes.find(([id]) => id === scope)![1]} overrides cleared.`);
  };
  const css = themeCss(theme);
  const exportText = `/* Eastern Nomads theme. Paste into src/theme-overrides.css.\n   Generated from the local theme editor; default tokens remain in src/theme.css. */\n${css || "/* Original theme: no overrides. */"}\n`;
  const exportCss = () => {
    const url = URL.createObjectURL(new Blob([exportText], { type: "text/css" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "eastern-nomads-theme.css";
    document.body.append(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("CSS exported. Paste it into src/theme-overrides.css to make this theme permanent.");
  };
  const copyCss = async () => {
    try { await navigator.clipboard.writeText(exportText); setMessage("CSS copied. Paste it into src/theme-overrides.css."); }
    catch { setMessage("Clipboard unavailable. Use Export CSS or select the CSS below."); }
  };
  const sectionColors = ["--brand", "--brand-deep", "--on-brand", "--ink", "--ink-soft", "--muted", "--surface", "--section-bg"];
  const extra: Record<string, string[]> = {
    nav: ["--paper", "--nav-opacity", "--logo-tint"],
    hero: ["--hero-text", "--hero-shade", "--hero-overlay-start", "--hero-overlay-middle", "--hero-overlay-end", "--logo-tint"],
    contact: ["--field", "--dark-hover"], team: ["--portrait-backdrop"], footer: ["--logo-tint"],
  };
  const visible = controls.filter(c => scope === "global" ? c.name !== "--section-bg" : [...sectionColors, ...(extra[scope] || [])].includes(c.name) && !(scope === "hero" && c.name === "--section-bg"));
  const buttonContrast = contrast(value("--on-brand"), value("--brand"));
  const bodyContrast = contrast(value("--ink-soft"), (scope !== "global" && theme[scope]?.["--section-bg"]) || value("--paper"));
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <>
    <style data-theme-preview>{original ? "" : css}</style>
    <div className="theme-studio">
      <button ref={trigger} className="theme-studio__trigger" aria-expanded={open} aria-controls="theme-studio-panel" onClick={() => setOpen(prev => !prev)}>Customize theme</button>
      {open && <aside id="theme-studio-panel" className="theme-studio__panel" aria-label="Local theme editor">
        <header className="theme-studio__header"><div><span>LOCAL PREVIEW</span><h2>Make it yours.</h2></div><button ref={closeButton} aria-label="Close theme editor" onClick={close}>Close</button></header>
        <div className="theme-studio__body">
          <p className="theme-studio__intro">Try colors on the actual website. The dark copper theme is the default. These experiments stay in this browser.</p>
          <fieldset><legend>Start with a palette</legend><div className="theme-studio__presets">{presets.map(preset => <button key={preset.name} onClick={() => { setTheme(Object.keys(preset.tokens).length ? { global: { ...preset.tokens } } : {}); setOriginal(false); setMessage(`${preset.name} applied to the whole website.`); }}>{preset.name}</button>)}</div><small>Presets replace all current overrides, including section choices.</small></fieldset>
          <label className="theme-studio__scope">Editing<select value={scope} onChange={e => setScope(e.target.value as Scope)}>{scopes.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          {scope !== "global" && <button onClick={() => document.querySelector(`[data-theme-section="${scope}"]`)?.scrollIntoView({ behavior: "instant", block: "start" })}>Jump to this section</button>}
          <div className="theme-studio__compare"><label><input type="checkbox" checked={original} onChange={e => setOriginal(e.target.checked)} /> Compare with original</label>{original && <small>Original is visible. Uncheck to return to your draft.</small>}</div>
          {["Colors", "Layout & effects", "Typography"].map(group => {
            const items = visible.filter(c => c.group === group);
            return items.length > 0 && <details key={group} open={group === "Colors"}><summary>{group}</summary><div className="theme-studio__fields">{items.map(control => <div className="theme-studio__field" key={`${scope}-${control.name}`}>
              <label htmlFor={`theme-${control.name}`}>{control.label}</label>
              {control.kind === "color" ? <ColorField control={control} value={value(control.name)} onChange={next => change(control.name, next)} /> : control.kind === "font" ? <select id={`theme-${control.name}`} value={value(control.name)} onChange={e => change(control.name, e.target.value)}>{fonts.map(font => <option key={font} value={font}>{font.split(",")[0].replaceAll('"', '')}</option>)}</select> : <div className="theme-studio__number"><input id={`theme-${control.name}`} type="number" min={control.min} max={control.max} step={control.step} value={parseFloat(value(control.name))} onChange={e => { if (e.target.value !== "") change(control.name, `${e.target.value}${control.unit}`); }} /><span>{control.unit || "off / on"}</span></div>}
              {scope !== "global" && theme[scope]?.[control.name] && <button className="theme-studio__inherit" onClick={() => setTheme(prev => { const next = { ...prev, [scope]: { ...prev[scope] } }; delete next[scope]![control.name]; return next; })}>Use inherited {control.label.toLowerCase()}</button>}
            </div>)}</div></details>;
          })}
          <div className="theme-studio__contrast"><strong>Draft contrast · solid color pairs</strong><p>Accent button: {buttonContrast.toFixed(2)}:1 · {buttonContrast >= 4.5 ? "meets 4.5:1" : "below 4.5:1"}</p><p>Body / background: {bodyContrast.toFixed(2)}:1</p><small>Photo overlays, gradients, hover states, and other controls need a visual check. The original orange button is 3.56:1.</small></div>
          <div className="theme-studio__actions"><button onClick={resetScope}>Reset this scope</button><button onClick={() => { setTheme({}); setOriginal(false); setMessage("All overrides cleared. Original theme restored."); }}>Reset all</button><button onClick={copyCss}>Copy CSS</button><button className="theme-studio__primary" onClick={exportCss}>Export CSS</button></div>
          <details><summary>Exported CSS</summary><textarea aria-label="Exported theme CSS" readOnly value={exportText} spellCheck={false} /></details>
          <p className="theme-studio__status" role="status">{storageError ? "Browser storage is unavailable. This preview lasts for this session; export CSS to keep it." : message}</p>
          <small>The editor is available only in local development. Exported overrides are applied only when you add them to the project.</small>
        </div>
      </aside>}
    </div>
  </>;
}
