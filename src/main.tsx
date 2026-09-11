import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CompactPreviewWindow from "./features/clipboard/components/CompactPreviewWindow";
import SettingsWindow from "./features/settings/components/SettingsWindow";
import "./index.css";
import "./styles/components/index.css";
import "./styles/themes/load";

const params = new URLSearchParams(window.location.search);
const isCompactPreview = params.get("window") === "compact-preview";
const isSettingsWindow = params.get("window") === "settings";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {isCompactPreview
      ? <CompactPreviewWindow />
      : isSettingsWindow
        ? <SettingsWindow />
        : <App />}
  </React.StrictMode>,
);
