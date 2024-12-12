import { create } from "zustand";
import {
    collection,
    DocumentData,
    getDocs,
    orderBy,
    query,
} from "firebase/firestore";
import { db } from "@/constants/firebase";

interface MatHistoryDataType {
    matchId: string;
    createdAt: Date;
    player1: {
        name: string;
        matchPoints: number;
        isWinner: boolean;
    };
    player2: {
        name: string;
        matchPoints: number;
        isWinner: boolean;
    };
}

interface MatchHistoryStoreType {
    isMatchDataLoading: boolean;
    MatchHistoryData: [] | DocumentData;
    getMatchHistoryData: () => void;
}

const useMatchHistoryStore = create<MatchHistoryStoreType>((set, get) => ({
    isMatchDataLoading: true,
    MatchHistoryData: [],
    getMatchHistoryData: async () => {
        try {
            const dataRef = collection(db, "matches");
            const q = query(dataRef, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data: MatHistoryDataType[] = [];
            querySnapshot.forEach((item) => {
                data.push(item.data() as MatHistoryDataType);
            });

            set(() => ({ MatchHistoryData: data, isMatchDataLoading: false }));
        } catch (e) {
            console.log(e);
            set(() => ({ isMatchDataLoading: false }));
        }
    },
}));

export default useMatchHistoryStore;
export { MatHistoryDataType };
