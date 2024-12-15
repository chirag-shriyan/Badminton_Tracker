import { Platform } from "react-native";

function getItem(key: string) {
    if (Platform.OS === "web" && typeof window !== "undefined") {
        return localStorage.getItem(key);
    }
}

function setItem(key: string, value: string) {
    if (Platform.OS === "web" && typeof window !== "undefined") {
        return localStorage.setItem(key, value);
    }
}
function deleteItem(key: string) {
    if (Platform.OS === "web" && typeof window !== "undefined") {
        return localStorage.removeItem(key);
    }
}

const Local_DB = {
    getItem,
    setItem,
    deleteItem,
};

export default Local_DB;
export { getItem, setItem };
