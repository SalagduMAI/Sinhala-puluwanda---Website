import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { GameProvider } from "./contexts/GameContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>
);

