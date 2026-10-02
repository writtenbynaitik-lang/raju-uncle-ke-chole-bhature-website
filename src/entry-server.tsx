import { renderToString } from "react-dom/server";
import App from "./App";
import "./styles/base.css";

/** Used only at build time, to bake the markup into index.html. */
export function render() {
  return renderToString(<App />);
}
