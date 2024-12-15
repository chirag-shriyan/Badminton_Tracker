import { create } from "zustand";
import * as Local_DB from "@/constants/Local_DB";

interface ThemeStoreType {
    Theme: "Dark" | "Light";
    setTheme: (theme: "Dark" | "Light") => void;
}

function getTheme(): "Dark" | "Light" {
    const theme = Local_DB.getItem("theme");
    if (theme === "Dark" || theme === "Light") {
        return theme;
    }

    return "Dark";
}

const useThemeStore = create<ThemeStoreType>((set) => ({
    Theme: getTheme(),
    setTheme: (theme: "Dark" | "Light") => {
        Local_DB.setItem("theme", theme);
        set(() => ({ Theme: theme }));
    },
}));

export default useThemeStore;
