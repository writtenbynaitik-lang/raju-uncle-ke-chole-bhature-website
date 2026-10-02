import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/base.css";

/**
 * This page gets handed to someone — on a phone, across a counter. It has to
 * open on the hero every single time, so two browser defaults are turned off:
 *
 *  1. `scrollRestoration` is "auto" by default, which puts a returning visitor
 *     back wherever they last were. On a normal site that is a courtesy; here
 *     it means the owner is shown the middle of the menu instead of the name.
 *
 *  2. A leftover `#visit` or `#menu` in the address bar — left there by a nav
 *     click in an earlier visit — deep-links into the middle on the next open.
 *     In-page anchors still work normally once the page is up; only a hash the
 *     page was *opened* with is cleared.
 */
// Reveal animations hide their content until JS reveals it, so the stylesheet
// only applies that hiding under `.js`. Set it before React mounts: if this
// script had failed, the page would still have read correctly.
document.documentElement.classList.add("js");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (location.hash) {
  history.replaceState(null, "", location.pathname + location.search);
}

// `html` carries scroll-behavior: smooth for anchor links, which would animate
// this one too; jump instantly, before the first paint.
const html = document.documentElement;
const smooth = html.style.scrollBehavior;
html.style.scrollBehavior = "auto";
window.scrollTo(0, 0);
html.style.scrollBehavior = smooth;

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build ships prerendered markup, so hydrate it rather than
// throwing it away; `npm run dev` serves an empty root and mounts normally.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
