import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Vite removes this branch and its editor code from production builds.
const ThemeEditor = import.meta.env.DEV && new URLSearchParams(window.location.search).has("theme") ? lazy(() => import("./theme/ThemeEditor")) : null;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {ThemeEditor && <Suspense fallback={null}><ThemeEditor /></Suspense>}
  </StrictMode>,
);
