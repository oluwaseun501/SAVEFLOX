import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import App from "./App";
import "./i18n";
import { AdsProvider } from "./context/AdsContext";

// ...

<ThemeProvider>
  <AdsProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AdsProvider>
</ThemeProvider>

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AdsProvider>
        <App />
         </AdsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);