import { Colors } from "@/constants/Colors";
import useNetInfoStore from "@/store/NetInfo";
import usePlayerStore, { PlayerDataType } from "@/store/PlayerStore";
import useThemeStore from "@/store/ThemeStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Player() {
    const { id } = useLocalSearchParams();
    const { getPlayer } = usePlayerStore();
    const { isInternetConnected } = useNetInfoStore();

    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    const [Player, setPlayer] = useState<PlayerDataType | null>(null);

    useEffect(() => {
        if (isInternetConnected) {
            const player = getPlayer(id as string);
            setPlayer(player);
        } else {
            alert("No internet connection");
        }
    }, []);

    if (!Player) {
        return (
            <Text
                style={{
                    flex: 1,
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontSize: 25,
                    color: theme.text,
                    backgroundColor: theme.background,
                }}
            >
                No Players Found
            </Text>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView scrollEnabled={true}>
                <Text
                    style={{
                        fontSize: 25,
                        marginVertical: 10,
                        color: theme.text,
                        textAlign: "center",
                    }}
                >
                    {Player.name}
                </Text>
                <View style={styles.hr} />
                <View style={styles.PlayerDataContainer}>
                    <Text style={styles.text}>Player Rank</Text>
                    <Text style={styles.text}># {Player.rank}</Text>
                </View>

                <View style={styles.hr} />
                <View style={styles.PlayerDataContainer}>
                    <Text style={styles.text}>Points</Text>
                    <Text style={styles.text}>{Player.points}</Text>
                </View>

                <View style={styles.hr} />
                <View style={styles.PlayerDataContainer}>
                    <Text style={styles.text}>Total Match</Text>
                    <Text style={styles.text}>{Player.totalMatch}</Text>
                </View>

                <View style={styles.hr} />
                <View style={styles.PlayerDataContainer}>
                    <Text style={styles.text}>Total Win</Text>
                    <Text style={styles.text}>{Player.totalWin}</Text>
                </View>

                <View style={styles.hr} />
                <View style={styles.PlayerDataContainer}>
                    <Text style={styles.text}>Total Lost</Text>
                    <Text style={styles.text}>{Player.totalLost}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        hr: {
            borderTopWidth: 1,
            borderTopColor: theme.borderColor,
        },
        container: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: theme.background,
        },
        PlayerDataContainer: {
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: theme.background,
        },
        text: {
            color: theme.text,
            marginBottom: 10,
            fontSize: 20,
        },
    });
};
