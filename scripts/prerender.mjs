/**
 * Bakes the rendered markup into dist/index.html.
 *
 * The site is a brochure with one interactive drawer; making the first paint
 * wait on a 260 KB bundle is the wrong trade, especially on a phone on mobile
 * data, which is how this will actually be looked at. After this step the page
 * paints from HTML alone and React hydrates over the top.
 */
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const { render } = await import(pathToFileURL("dist-ssr/entry-server.js").href);
const html = await readFile("dist/index.html", "utf8");
const markup = render();

const out = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
if (out === html) {
  console.error("prerender: could not find the root div — nothing was injected");
  process.exit(1);
}
await writeFile("dist/index.html", out);
await rm("dist-ssr", { recursive: true, force: true });
console.log(`prerender: ${(markup.length / 1024).toFixed(1)} KB of markup inlined`);
