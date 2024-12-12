import { create } from "zustand";
import { collection, deleteDoc, doc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/constants/firebase";
import { Alert } from "react-native";
import * as Crypto from "expo-crypto";

interface PlayerDataType {
    playerId: string;
    name: string;
    points: number;
    rank?: number;
    totalMatch: number;
    totalWin: number;
    totalLost: number;
    createAt?: Timestamp;
    updateAt?: Timestamp;
}
interface PlayerStoreType {
    PlayersDataLoading: boolean;
    setPlayersDataLoading: (boolean: boolean) => void;

    readonly PlayersData: PlayerDataType[];

    getPlayersData: () => void;
    setPlayer: (name: string) => void;

    getPlayer: (playerId: string) => PlayerDataType | null;
    editPlayer: (player: PlayerDataType) => void;
    removePlayer: (playerId: string) => void;

    getPlayersDataOffline: () => void;

}

const usePlayerStore = create<PlayerStoreType>((set, get) => ({
    // PlayersDataLoading and setPlayersDataLoading
    PlayersDataLoading: true,
    setPlayersDataLoading: (boolean: boolean) => {
        set(() => ({ PlayersDataLoading: boolean }));
    },

    // PlayersData and all the other operation on PlayersData
    PlayersData: [],

    // getPlayersData to get all the player data from internet (requires internet)
    getPlayersData: async () => {
        try {
            const dataRef = collection(db, "players");
            const querySnapshot = await getDocs(dataRef);
            const players: PlayerDataType[] = [];

            querySnapshot.forEach((item) => {
                const data: PlayerDataType = item.data() as PlayerDataType;
                players.push(data);
            });

            players.sort((a: any, b: any) => b.points - a.points || a.updateAt - b.updateAt);
            players.forEach((player, index) => player.rank = index + 1);

            set(() => ({ PlayersData: players }));
            set(() => ({ PlayersDataLoading: false }));
        } catch (error) {
            console.log(error);
        }
    },

    // setPlayer to add new player to the database (requires internet)
    setPlayer: async (name: string) => {
        if (name.trim() !== "") {
            try {
                const q = query(
                    collection(db, "players"),
                    where("name", "==", name)
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    const playerId = Crypto.randomUUID();
                    const player = {
                        playerId: playerId,
                        name: name,
                        points: 0,
                        totalMatch: 0,
                        totalWin: 0,
                        totalLost: 0,
                        createAt: Timestamp.fromDate(new Date()),
                        updateAt: Timestamp.fromDate(new Date()),
                    };

                    await setDoc(doc(db, "players", playerId), player);
                    alert(`Player created with ID: ${playerId}`);
                    get().getPlayersData();

                } else {
                    alert(`Player with the name "${name}" already exist`);
                }
            } catch (e) {
                alert(`Error creating player: ${e}`);
            }
        }
    },

    // getPlayer to player form PlayersData state
    getPlayer: (playerId: string) => {
        const PlayersData = get().PlayersData;
        const player = PlayersData.find((player) => player.playerId === playerId);
        if (player) {
            return player;
        }
        else {
            return null;
        }
    },

    // editPlayer to edit player in the database (requires internet)
    editPlayer: async (player: PlayerDataType) => {
        if (player) {
            try {
                const dataRef = doc(db, "players", player.playerId);
                await updateDoc(dataRef, { ...player });
                get().getPlayersData();
            } catch (error) {
                console.log(error);
            }
        }
    },

    // setPlayer to remove player from database (requires internet)
    removePlayer: async (playerId: string) => {
        try {
            Alert.alert(
                '',
                "Are you sure you want to delete this player",
                [
                    { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                    {
                        text: 'OK', onPress: async () => {
                            await deleteDoc(doc(db, "players", playerId));
                            get().getPlayersData();
                        }
                    },
                ],
            )

        } catch (error) {
            console.log(error);
        }
    },

    // getPlayersDataOffline to get player from local database (offline mode)
    getPlayersDataOffline: async () => {
    }
}));


export default usePlayerStore;
export { PlayerDataType };