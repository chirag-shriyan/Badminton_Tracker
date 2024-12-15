import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";

import useThemeStore from "@/store/ThemeStore";
import { Colors } from "@/constants/Colors";

import useCreateMatchStore from "@/store/CreateMatchStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useGlobalStateStore from "@/store/GlobalStateStore";
import Loading from "@/app/loading";
import { router } from "expo-router";
import useNetInfoStore from "@/store/NetInfo";

const MatchStart = () => {
    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    const { isLoading, setLoading } = useGlobalStateStore();
    const { isInternetConnected } = useNetInfoStore();

    const {
        isMatchCompleted,
        Player1,
        Player2,
        Target,
        setTarget,
        AddPoints,
        RemovePoints,
        ResetMatch,
        EndMatch,
        CompleteMatch,
        CompleteMatchOffline,
    } = useCreateMatchStore();

    useEffect(() => {
        if (
            Player1?.matchPoints === Target - 1 &&
            Player2?.matchPoints === Target - 1
        ) {
            setTarget(Target + 1);
        }
    }, [Player1?.matchPoints, Player2?.matchPoints]);

    function handleAddPoints(player: "Player1" | "Player2") {
        AddPoints(player);
    }
    function handleRemovePoints(player: "Player1" | "Player2") {
        RemovePoints(player);
    }
    async function handleCompleteMatch() {
        if (isInternetConnected) {
            setLoading(true);
            await CompleteMatch();
            setLoading(false);
            router.replace("/");
        } else if (isInternetConnected === false) {
            setLoading(true);
            CompleteMatchOffline();
            setTimeout(function () {
                setLoading(false);
            }, 100);
            router.replace("/");
        }
    }

    return !isLoading ? (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    ...styles.matchContainer,
                    backgroundColor:
                        Theme === "Light" ? "rgb(220, 246, 250)" : "",
                }}
            >
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    <View style={{ flex: 1, marginHorizontal: 5 }}>
                        <Button
                            title="End Match"
                            color={"red"}
                            onPress={EndMatch}
                        />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 5 }}>
                        <Button title="Reset Match" onPress={ResetMatch} />
                    </View>
                </View>

                <View style={styles.playerContainer}>
                    <View style={{ flexDirection: "row" }}>
                        {Player1?.isServing && (
                            <MaterialCommunityIcons
                                name="badminton"
                                size={24}
                                color={theme.text}
                                style={{
                                    position: "absolute",
                                }}
                            />
                        )}
                        <Text style={styles.playerText}>
                            {`${Player1?.name} (${Player1?.matchPoints})`}
                        </Text>
                    </View>

                    <View style={styles.hr} />

                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <Button
                                title="Subtract"
                                color={"red"}
                                onPress={() => handleRemovePoints("Player1")}
                            />
                        </View>

                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <Button
                                title="Add"
                                color={"green"}
                                onPress={() => handleAddPoints("Player1")}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.playerContainer}>
                    <View style={{ flexDirection: "row" }}>
                        {Player2?.isServing && (
                            <MaterialCommunityIcons
                                name="badminton"
                                size={24}
                                color={theme.text}
                                style={{
                                    position: "absolute",
                                }}
                            />
                        )}
                        <Text style={styles.playerText}>
                            {`${Player2?.name} (${Player2?.matchPoints})`}
                        </Text>
                    </View>

                    <View style={styles.hr} />

                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <Button
                                title="Subtract"
                                color={"red"}
                                onPress={() => handleRemovePoints("Player2")}
                            />
                        </View>

                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <Button
                                title="Add"
                                color={"green"}
                                onPress={() => handleAddPoints("Player2")}
                            />
                        </View>
                    </View>
                </View>

                <Text
                    style={{
                        textAlign: "center",
                        color: theme.text,
                        fontSize: 20,
                    }}
                >
                    First to Point {Target} Wins
                </Text>

                {isMatchCompleted && (
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <Button
                            title="Complete Match"
                            color={"green"}
                            onPress={handleCompleteMatch}
                        />
                    </View>
                )}
            </View>
        </View>
    ) : (
        <Loading />
    );
};

export default MatchStart;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        hr: {
            marginVertical: 10,
            borderTopWidth: 1,
            borderTopColor: theme.borderColor,
        },
        matchContainer: {
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 10,
        },
        playerContainer: {
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 10,
            marginVertical: 10,
        },
        input: {
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 10,
            color: theme.text,
        },
        playerText: {
            flex: 1,
            textAlign: "center",
            color: theme.text,
            fontSize: 20,
        },
    });
};
