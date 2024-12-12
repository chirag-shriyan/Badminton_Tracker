import { create } from "zustand";
import * as NetInfo from "@react-native-community/netinfo";

interface NetInfoStoreType {
    isInternetConnected: boolean | null;
    checkInternetConnection: () => void;
}

const useNetInfoStore = create<NetInfoStoreType>((set, get) => ({
    isInternetConnected: false,
    checkInternetConnection: () => {
        NetInfo.addEventListener((internet) => {
            set(() => ({ isInternetConnected: internet.isConnected }))
        })
    }
}));


export default useNetInfoStore;