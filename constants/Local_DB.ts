import { AsyncStorage as SQLiteKVStore } from "expo-sqlite/kv-store";
import { Platform } from "react-native";

function getItem(key: string) {
    if (Platform.OS !== "web") {
        return SQLiteKVStore.getItemSync(key);
    }
}

function setItem(key: string, value: string) {
    if (Platform.OS !== "web") {
        return SQLiteKVStore.setItemSync(key, value);
    }
}
function deleteItem(key: string) {
    if (Platform.OS !== "web") {
        return SQLiteKVStore.removeItemSync(key);
    }
}

const Local_DB = {
    getItem,
    setItem,
    deleteItem,
};

export default Local_DB;
export { getItem, setItem };
