import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import usePlayerStore, { PlayerDataType } from "@/store/PlayerStore";

import useThemeStore from "@/store/ThemeStore";
import { Colors } from "@/constants/Colors";
import useCreateMatchStore from "@/store/CreateMatchStore";

const SelectPlayer = () => {
    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    const [playerName, setPlayerName] = useState("");

    const InitialPlayersData = usePlayerStore().PlayersData;
    const [PlayersData, setPlayersData] = useState<PlayerDataType[]>([]);

    const { Player1, Player2, AddPlayer, Target, setTarget, setInitialTarget } =
        useCreateMatchStore();

    function PlayerSearch(value: string) {
        if (value.trim() !== "") {
            const filteredData = InitialPlayersData.filter((player) =>
                player.name.toLowerCase().includes(value.toLowerCase())
            );
            setPlayersData(filteredData);
        } else {
            setPlayersData([]);
        }
    }

    function handleAddPlayer(Player: PlayerDataType) {
        const player = {
            playerId: Player.playerId,
            name: Player.name,
            currentPoints: Player.points,
            totalMatch: Player.totalMatch,
            totalWin: Player.totalWin,
            totalLost: Player.totalLost,
            matchPoints: 0,
            isServing: false,
        };
        AddPlayer(player);
        setPlayerName("");
        setPlayersData([]);
    }

    useEffect(() => {
        if (Number(Target)) {
            setInitialTarget(Target);
        }
    }, [Target]);

    return (
        <View style={{ flex: 1, paddingVertical: 20 }}>
            <View>
                <Text
                    style={{
                        fontSize: 25,
                        fontWeight: "900",
                        marginBottom: 10,
                        color: theme.text,
                    }}
                >
                    Create Match
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter player name"
                    placeholderTextColor={"gray"}
                    value={playerName}
                    onChangeText={(text) => {
                        setPlayerName(text);
                        PlayerSearch(text);
                    }}
                    selectTextOnFocus
                />
                {!playerName && (
                    <TextInput
                        style={styles.input}
                        placeholder="Enter points to win"
                        placeholderTextColor={"gray"}
                        value={Target ? Target.toString() : ""}
                        onChangeText={(text) => {
                            !Number.isNaN(Number(text))
                                ? setTarget(Number(text))
                                : setTarget(0);
                        }}
                        selectTextOnFocus
                    />
                )}
            </View>

            {PlayersData.length > 0 ? (
                PlayersData.map((player) => {
                    return (
                        <TouchableOpacity
                            key={player.playerId}
                            style={{
                                marginRight: 5,
                                padding: 10,
                                borderWidth: 2,
                                borderColor: theme.borderColor,
                                borderRadius: 10,
                                marginBottom: 10,
                            }}
                            onPress={() => handleAddPlayer(player)}
                        >
                            <Text style={{ color: theme.text }}>
                                {player.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <View style={{ flex: 1 }}>
                    <View>
                        <Text style={styles.VSText}>
                            {Player1 ? Player1.name : "Player1"}
                        </Text>

                        <Text
                            style={{
                                textAlign: "center",
                                color: theme.text,
                                fontSize: 20,
                            }}
                        >
                            VS
                        </Text>

                        <Text style={styles.VSText}>
                            {Player2 ? Player2.name : "Player2"}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default SelectPlayer;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        input: {
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            color: theme.text,
        },
        VSText: {
            marginVertical: 10,
            textAlign: "center",
            color: theme.text,
            fontSize: 20,
            padding: 10,
            borderWidth: 2,
            borderColor: "gray",
            borderRadius: 10,
        },
    });
};
