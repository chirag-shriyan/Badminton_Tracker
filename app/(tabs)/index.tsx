import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";

import useNetInfoStore from "@/store/NetInfo";
import usePlayerStore, { PlayerDataType } from "@/store/PlayerStore";
import Local_DB from "@/constants/Local_DB";

const Home = () => {
    const { isInternetConnected } = useNetInfoStore();

    const {
        PlayersDataLoading,
        setPlayersDataLoading,
        getPlayersData,
        getPlayersDataOffline,
    } = usePlayerStore();

    const InitialPlayersData = usePlayerStore().PlayersData;
    const [PlayersData, setPlayersData] = useState<PlayerDataType[] | null>(
        null
    );

    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    function PlayerSearch(value: string) {
        if (value.trim() !== "" && PlayersData) {
            const filteredData = PlayersData.filter((player) =>
                player.name.toLowerCase().includes(value.toLowerCase())
            );
            setPlayersData(filteredData);
        } else {
            setPlayersData(InitialPlayersData);
        }
    }

    useEffect(() => {
        if (isInternetConnected) {
            getPlayersData();
            setPlayersDataLoading(true);
        } else if (isInternetConnected === false) {
            getPlayersDataOffline();
            setPlayersDataLoading(true);
        }
    }, [isInternetConnected]);

    useEffect(() => {
        setPlayersData(InitialPlayersData);
        if (PlayersData !== null) {
            setPlayersDataLoading(false);
        }
    }, [InitialPlayersData]);

    return (
        <SafeAreaView
            style={{
                backgroundColor: theme.background,
                flex: 1,
            }}
        >
            <StatusBar style={Theme === "Dark" ? "light" : "dark"} />
            <ScrollView keyboardShouldPersistTaps="always">
                <View
                    style={{
                        flex: 1,
                        paddingTop: 20,
                        paddingHorizontal: 10,
                        backgroundColor: theme.background,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 25,
                                fontWeight: "900",
                                marginBottom: 10,
                                color: theme.text,
                            }}
                        >
                            {isInternetConnected
                                ? "Ranking"
                                : "Ranking (Offline)"}
                        </Text>

                        <TextInput
                            style={styles.playerSearch}
                            placeholder="Enter player name"
                            placeholderTextColor={"gray"}
                            onChangeText={PlayerSearch}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 10,
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Text style={styles.rankingCell}>#</Text>
                        <Text style={styles.nameCell}>Name</Text>
                        <Text style={styles.pointsCell}>Points</Text>
                        <Text style={styles.totalMatchCell}>Total Match</Text>
                    </View>
                </View>

                <View>
                    {PlayersData &&
                    PlayersData.length > 0 &&
                    !PlayersDataLoading ? (
                        PlayersData.map((player) => {
                            return (
                                <Pressable
                                    key={player.playerId}
                                    style={styles.rankingContainer}
                                    onPress={() =>
                                        router.push(
                                            `/player/${player.playerId}`
                                        )
                                    }
                                >
                                    <Text style={styles.rankingCell}>
                                        {player.rank}.
                                    </Text>
                                    <Text style={styles.nameCell}>
                                        {player.name}
                                    </Text>
                                    <Text style={styles.pointsCell}>
                                        {player.points}
                                    </Text>
                                    <Text style={styles.totalMatchCell}>
                                        {player.totalMatch}
                                    </Text>
                                </Pressable>
                            );
                        })
                    ) : PlayersDataLoading ? (
                        <Text
                            style={{
                                marginVertical: 20,
                                textAlign: "center",
                                color: theme.text,
                            }}
                        >
                            Loading...
                        </Text>
                    ) : (
                        <Text
                            style={{
                                marginVertical: 20,
                                textAlign: "center",
                                color: theme.text,
                            }}
                        >
                            No Players Data
                        </Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        playerSearch: {
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 10,
            color: theme.text,
        },
        rankingContainer: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            paddingHorizontal: 20,
        },
        rankingCell: {
            width: "10%",
            marginRight: 5,
            fontSize: 12,
            fontWeight: "bold",
            color: theme.text,
        },
        nameCell: {
            width: "40%",
            marginRight: 5,
            fontSize: 12,
            fontWeight: "bold",
            color: theme.text,
        },
        pointsCell: {
            width: "20%",
            marginRight: 5,
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.text,
        },
        totalMatchCell: {
            width: "20%",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
            color: theme.text,
        },
    });
};
