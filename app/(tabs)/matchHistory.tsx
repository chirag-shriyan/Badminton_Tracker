import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import useNetInfoStore from "@/store/NetInfo";
import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import useMatchHistoryStore, {
    MatHistoryDataType,
} from "@/store/MatchHistoryStore";

const MatchHistory = () => {
    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    const { isInternetConnected } = useNetInfoStore();
    const { isMatchDataLoading, MatchHistoryData, getMatchHistoryData } =
        useMatchHistoryStore();

    useEffect(() => {
        getMatchHistoryData();
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 25,
                            fontWeight: "900",
                            color: theme.text,
                        }}
                    >
                        {isInternetConnected
                            ? "Match History"
                            : "Match History(Offline)"}
                    </Text>
                </View>

                <ScrollView>
                    {MatchHistoryData.length > 0 ? (
                        MatchHistoryData.map((match: MatHistoryDataType) => {
                            return (
                                <Pressable
                                    key={match.matchId}
                                    style={styles.matchContainer}
                                    onPress={() =>
                                        router.push(`/match/${match.matchId}`)
                                    }
                                >
                                    <View style={{ flexDirection: "row" }}>
                                        <Text
                                            style={{
                                                ...styles.fontStyle,
                                                color: match.player1.isWinner
                                                    ? "green"
                                                    : "red",
                                            }}
                                        >
                                            {match.player1.name} (
                                            {match.player1.matchPoints})
                                        </Text>

                                        <Text style={styles.fontStyle}>
                                            {" "}
                                            /{" "}
                                        </Text>

                                        <Text
                                            style={{
                                                ...styles.fontStyle,
                                                color: match.player2.isWinner
                                                    ? "green"
                                                    : "red",
                                            }}
                                        >
                                            {match.player2.name} (
                                            {match.player2.matchPoints})
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: "row" }}>
                                        <Text
                                            style={{
                                                ...styles.fontStyle,
                                                color: match.player1.isWinner
                                                    ? "green"
                                                    : "red",
                                            }}
                                        >
                                            {match.player1.isWinner ? "W" : "L"}
                                        </Text>

                                        <Text style={styles.fontStyle}>
                                            {" "}
                                            /{" "}
                                        </Text>

                                        <Text
                                            style={{
                                                ...styles.fontStyle,
                                                color: match.player2.isWinner
                                                    ? "green"
                                                    : "red",
                                            }}
                                        >
                                            {match.player2.isWinner ? "W" : "L"}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })
                    ) : isMatchDataLoading ? (
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text
                                style={{
                                    flex: 1,
                                    textAlignVertical: "center",
                                    textAlign: "center",
                                    fontSize: 20,
                                    color: theme.text,
                                }}
                            >
                                Loading...
                            </Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text
                                style={{
                                    flex: 1,
                                    textAlignVertical: "center",
                                    textAlign: "center",
                                    fontSize: 20,
                                    color: theme.text,
                                }}
                            >
                                Nothing To Show Here
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default MatchHistory;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        matchContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            marginHorizontal: 10,
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            marginBottom: 10,
        },
        fontStyle: {
            fontSize: 13,
            color: theme.text,
        },
    });
};
