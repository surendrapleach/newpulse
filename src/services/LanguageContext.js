import React, { createContext, useContext, useMemo, useState } from "react";
import { LANGUAGE_OPTIONS, STRINGS } from "../utils/i18n";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = useMemo(() => {
    return (key, vars = {}) => {
      const table = STRINGS[language] || STRINGS.en;
      let value = table[key] || STRINGS.en[key] || key;
      const plural = vars.count === 1 ? "" : "s";
      value = value.replace("{plural}", plural);
      Object.keys(vars).forEach((k) => {
        value = value.replace(`{${k}}`, String(vars[k]));
      });
      return value;
    };
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: LANGUAGE_OPTIONS,
    }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};
