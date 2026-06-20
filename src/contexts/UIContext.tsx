import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";
type Language = "es" | "en";

type UIContextValue = {
  theme: Theme;
  language: Language;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const v = localStorage.getItem("heindall-theme");
    return v === "light" ? "light" : "dark";
  });
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "es";
    const v = localStorage.getItem("heindall-language");
    return v === "en" ? "en" : "es";
  });

  useEffect(() => {
    localStorage.setItem("heindall-theme", theme);
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("heindall-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value: UIContextValue = {
    theme,
    language,
    setTheme: setThemeState,
    setLanguage: setLanguageState,
    toggleTheme: () => setThemeState((p) => (p === "dark" ? "light" : "dark")),
    toggleLanguage: () => setLanguageState((p) => (p === "es" ? "en" : "es")),
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
};