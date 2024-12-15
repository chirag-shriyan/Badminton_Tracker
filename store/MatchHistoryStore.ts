import { create } from "zustand";
import {
    collection,
    doc,
    DocumentData,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/constants/firebase";
import Local_DB from "@/constants/Local_DB";

interface MatchHistoryDataType {
    matchId: string;
    createdAt: Date;
    isDataLocal?: boolean;
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
    isLocalData: boolean;
    MatchHistoryData: [] | DocumentData;
    getMatchHistoryData: () => void;
    getMatchHistoryDataOffline: () => void;
    SyncDatabase: () => Promise<void>;
}

const useMatchHistoryStore = create<MatchHistoryStoreType>((set, get) => ({
    isMatchDataLoading: true,
    isLocalData: false,
    MatchHistoryData: [],
    getMatchHistoryData: async () => {
        set(() => ({ isMatchDataLoading: true }));
        try {
            const dataRef = collection(db, "matches");
            const q = query(dataRef, orderBy("createdAt", "desc"), limit(20));
            const querySnapshot = await getDocs(q);
            const matchHistoryData: MatchHistoryDataType[] = [];
            querySnapshot.forEach((item) => {
                matchHistoryData.push(item.data() as MatchHistoryDataType);
            });
            Local_DB.setItem("match_history", JSON.stringify(matchHistoryData));

            let local_match_history: any = Local_DB.getItem(
                "local_match_history"
            );

            if (local_match_history) {
                local_match_history = JSON.parse(local_match_history);
                local_match_history.forEach((data: any) => {
                    matchHistoryData.push(data.MatchData);
                });
                set(() => ({ isLocalData: true }));
            }
            matchHistoryData.sort((a, b) => {
                return a.createdAt > b.createdAt ? -1 : 0;
            });
            set(() => ({
                MatchHistoryData: matchHistoryData,
                isMatchDataLoading: false,
            }));
        } catch (e) {
            console.log(e);
        }
    },

    SyncDatabase: async () => {
        let local_match_history: any = Local_DB.getItem("local_match_history");
        if (local_match_history) {
            local_match_history = JSON.parse(local_match_history);
            await local_match_history.forEach(async (data: any) => {
                try {
                    const Player1 = data.Player1;
                    const Player2 = data.Player2;
                    const date = Timestamp.fromDate(
                        new Date(data.MatchData.createdAt)
                    );

                    // Updating players points in database
                    await updateDoc(
                        doc(db, "players", Player1.playerId),
                        data.Player1
                    );
                    await updateDoc(
                        doc(db, "players", Player2.playerId),
                        data.Player2
                    );

                    // Setting match data in database
                    const MatchData = {
                        matchId: data.MatchData.matchId,
                        createdAt: date,
                        player1: data.MatchData.player1,
                        player2: data.MatchData.player2,
                    };
                    await setDoc(
                        doc(db, "matches", data.MatchData.matchId),
                        MatchData
                    );
                    Local_DB.deleteItem("local_match_history");
                    set(() => ({ isLocalData: false }));
                } catch (e) {
                    console.log("SyncDatabase:", e);
                }
            });
        }
    },

    // Offline Mode
    getMatchHistoryDataOffline: async () => {
        set(() => ({ isMatchDataLoading: true }));
        const MatchData: any = [];

        let local_match_history: any = Local_DB.getItem("local_match_history");
        if (local_match_history) {
            local_match_history = JSON.parse(local_match_history);
            local_match_history.forEach((data: any) => {
                MatchData.push(data.MatchData);
            });
            set(() => ({ isLocalData: true }));
        }

        let match_history: any = Local_DB.getItem("match_history");
        if (match_history) {
            match_history = JSON.parse(match_history);
            match_history.forEach((data: any) => {
                MatchData.push(data);
            });
        }

        MatchData.sort((a: any, b: any) => {
            return a.createdAt < b.createdAt ? -1 : 0;
        });

        set(() => ({
            MatchHistoryData: MatchData,
            isMatchDataLoading: false,
        }));
    },
}));

export default useMatchHistoryStore;
export { MatchHistoryDataType };
