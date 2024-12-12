import { create } from "zustand";

interface GlobalStateStoreType {
    isLoading: boolean;
    setLoading: (boolean: boolean) => void;
}

const useGlobalStateStore = create<GlobalStateStoreType>((set) => ({
    isLoading: true,
    setLoading: (boolean: boolean) => {
        set(() => ({ isLoading: boolean }));
    }
}));


export default useGlobalStateStore;