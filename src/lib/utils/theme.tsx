import React, {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";

export const ThemeContext = createContext(false);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: FunctionComponent = ({ children }) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const cl = document.body.classList;

    if (dark) {
      cl.add("dark");
    } else {
      cl.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const cl = document.body.classList;

    if (mql.matches) {
      cl.add("dark");
      setDark(true);
    }

    mql.addEventListener("change", (e) => {
      if (e.matches) {
        cl.add("dark");
      } else {
        cl.remove("dark");
      }
      setDark(e.matches);
    });
  }, []);

  return <ThemeContext.Provider value={dark}>{children}</ThemeContext.Provider>;
};
