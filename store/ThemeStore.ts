import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

interface ThemeStoreType {
    Theme: "Dark" | "Light";
    setTheme: (theme: "Dark" | "Light") => void;
}

function getTheme(): "Dark" | "Light" {

    if (Platform.OS === "web") {
        const theme = localStorage.getItem("theme");
        if (theme === "Dark" || theme === "Light") {
            return theme;
        }
    }
    else {
        const theme = SecureStore.getItem("theme");
        if (theme === "Dark" || theme === "Light") {
            return theme;
        }
    }

    return "Dark"
}

const useThemeStore = create<ThemeStoreType>((set) => ({
    Theme: getTheme(),
    setTheme: (theme: "Dark" | "Light") => {
        if (Platform.OS === "web") {
            localStorage.setItem("theme", theme);
        }
        else {
            SecureStore.setItem("theme", theme);
        }
        set(() => ({ Theme: theme }));
    }
}));


export default useThemeStore;