import { db } from "@/constants/firebase";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { create } from "zustand";

import * as Crypto from "expo-crypto";

interface CreteMatchPlayerType {
    playerId: string;
    name: string;
    currentPoints: number;
    matchPoints: number;
    isServing: boolean;
    isWinner?: boolean;
}

interface CreateMatchStoreType {
    isMatchStarted: boolean;
    isMatchCompleted: boolean;

    InitialTarget: number;
    setInitialTarget: (points: number) => void;

    Target: number;
    setTarget: (points: number) => void;

    Player1: CreteMatchPlayerType | null;
    Player2: CreteMatchPlayerType | null;
    AddPlayer: (Player: CreteMatchPlayerType) => void;
    StartMatch: () => void;
    EndMatch: () => void;
    ResetMatch: () => void;
    AddPoints: (player: "Player1" | "Player2") => void;
    RemovePoints: (player: "Player1" | "Player2") => void;
    CompleteMatch: () => void;
}

const useCreateMatchStore = create<CreateMatchStoreType>((set, get) => ({
    isMatchStarted: false,
    isMatchCompleted: false,
    Player1: null,
    Player2: null,

    InitialTarget: 11,
    setInitialTarget: (points: number) => {
        set(() => ({ InitialTarget: points }));
    },

    Target: 11,
    setTarget: (points: number) => {
        set(() => ({ Target: points }));
    },

    AddPlayer: (Player: CreteMatchPlayerType) => {
        const Player1 = get().Player1;
        const Player2 = get().Player2;

        if (!Player1) {
            set(() => ({ Player1: { ...Player, isServing: true } }));
        } else if (!Player2 && Player1.playerId !== Player.playerId) {
            set(() => ({ Player2: Player }));
        } else {
            alert("This player is already selected");
        }
    },

    StartMatch: () => {
        const Player1 = get().Player1;
        const Player2 = get().Player2;
        const Target = get().Target;

        if (Player1 && Player2 && Target) {
            set(() => ({ isMatchStarted: true }));
        } else if (!Player1 && !Player2) {
            alert("Both players has to be selected");
        } else if (!Target) {
            alert("Points to win is required and can not be 0");
        }
    },

    EndMatch: () => {
        set(() => ({
            isMatchStarted: false,
            isMatchCompleted: false,
            InitialTarget: 11,
            Target: 11,
            Player1: null,
            Player2: null,
        }));
    },

    ResetMatch: () => {
        const Player1 = get().Player1;
        const Player2 = get().Player2;
        const InitialTarget = get().InitialTarget;
        if (Player1 && Player2) {
            set(() => ({
                Target: InitialTarget,
                isMatchCompleted: false,
                Player1: { ...Player1, matchPoints: 0, isServing: true },
                Player2: { ...Player2, matchPoints: 0, isServing: false },
            }));
        }
    },

    AddPoints: (player: "Player1" | "Player2") => {
        const Player = get()[player];
        const opponent = get()[player === "Player1" ? "Player2" : "Player1"];
        const Target = get().Target;

        if (
            Player &&
            Player.matchPoints !== Target &&
            opponent?.matchPoints !== Target
        ) {
            if (Player.matchPoints + 1 === Target) {
                set(() => ({
                    [player]: {
                        ...Player,
                        matchPoints: Player.matchPoints + 1,
                        isServing: true,
                    },
                    [player === "Player1" ? "Player2" : "Player1"]: {
                        ...opponent,
                        isServing: false,
                    },
                }));
                set(() => ({ isMatchCompleted: true }));
            } else {
                set(() => ({
                    [player]: {
                        ...Player,
                        matchPoints: Player.matchPoints + 1,
                        isServing: true,
                    },
                    [player === "Player1" ? "Player2" : "Player1"]: {
                        ...opponent,
                        isServing: false,
                    },
                }));
            }
        }
    },

    RemovePoints: (player: "Player1" | "Player2") => {
        const Player = get()[player];
        const opponent = get()[player === "Player1" ? "Player2" : "Player1"];
        const Target = get().Target;
        const isMatchCompleted = get().isMatchCompleted;

        if (Player && Player.matchPoints > 0) {
            set(() => ({
                [player]: {
                    ...Player,
                    matchPoints: Player.matchPoints - 1,
                },
            }));

            if (isMatchCompleted && opponent?.matchPoints !== Target) {
                set(() => ({ isMatchCompleted: false }));
            }
        }
    },

    CompleteMatch: async () => {
        const Player1 = get().Player1;
        const Player2 = get().Player2;

        if (Player1 && Player2) {
            Player1.isWinner =
                Player1.matchPoints > Player2.matchPoints && true;
            Player2.isWinner =
                Player1.matchPoints < Player2.matchPoints && true;

            const dbPlayer1Req = await getDoc(
                doc(db, "players", Player1.playerId)
            );
            const dbPlayer2Req = await getDoc(
                doc(db, "players", Player2.playerId)
            );
            const dbPlayer1 = dbPlayer1Req.data();
            const dbPlayer2 = dbPlayer2Req.data();

            if (dbPlayer1 && dbPlayer2) {
                const P1Points = Player1.isWinner
                    ? Player1.matchPoints - Player2.matchPoints + 20
                    : 10;
                const P2Points = Player2.isWinner
                    ? Player2.matchPoints - Player1.matchPoints + 20
                    : 10;

                await updateDoc(doc(db, "players", Player1.playerId), {
                    points: dbPlayer1.points + P1Points,
                    totalMatch: dbPlayer1.totalMatch + 1,
                    totalWin: Player1.isWinner
                        ? dbPlayer1.totalWin + 1
                        : dbPlayer1.totalWin,
                    totalLost: !Player1.isWinner
                        ? dbPlayer1.totalLost + 1
                        : dbPlayer1.totalLost,
                });
                await updateDoc(doc(db, "players", Player2.playerId), {
                    points: dbPlayer2.points + P2Points,
                    totalMatch: dbPlayer2.totalMatch + 1,
                    totalWin: Player2.isWinner
                        ? dbPlayer2.totalWin + 1
                        : dbPlayer2.totalWin,
                    totalLost: !Player2.isWinner
                        ? dbPlayer2.totalLost + 1
                        : dbPlayer2.totalLost,
                });

                const matchId = Crypto.randomUUID();
                const MatchData = {
                    matchId: matchId,
                    createdAt: Timestamp.fromDate(new Date()),
                    player1: {
                        playerId: dbPlayer1.playerId,
                        name: dbPlayer1.name,
                        matchPoints: Player1.matchPoints,
                        isWinner: Player1.isWinner,
                    },
                    player2: {
                        playerId: dbPlayer2.playerId,
                        name: dbPlayer2.name,
                        matchPoints: Player2.matchPoints,
                        isWinner: Player2.isWinner,
                    },
                };

                await setDoc(doc(db, "matches", matchId), MatchData);
                get().EndMatch();
            }
        }
    },
}));

export default useCreateMatchStore;
