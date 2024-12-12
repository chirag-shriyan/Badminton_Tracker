import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import useNetInfoStore from "@/store/NetInfo";
import useThemeStore from "@/store/ThemeStore";
import usePlayerStore from "@/store/PlayerStore";

const RemovePlayer = () => {
    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    const { isInternetConnected } = useNetInfoStore();

    const { removePlayer } = usePlayerStore();
    
    const InitialPlayersData = usePlayerStore().PlayersData;
    const [PlayersData, setPlayersData] = useState(InitialPlayersData);

    function handleRemovePlayer(playerId: string) {
        if (isInternetConnected) {
            removePlayer(playerId);
        } else {
            alert("This action requires internet connection");
        }
    }

    function PlayerSearch(value: string) {
        if (value.trim() !== "") {
            const filteredData = PlayersData.filter((player) =>
                player.name.toLowerCase().includes(value.toLowerCase())
            );
            setPlayersData(filteredData);
        } else {
            setPlayersData(InitialPlayersData);
        }
    }

    useEffect(() => {
        setPlayersData(InitialPlayersData);
    }, [InitialPlayersData]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView>
                <View
                    style={{
                        flex: 1,
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                        backgroundColor: theme.background,
                    }}
                >
                    <View style={{ marginBottom: 10 }}>
                        <Text
                            style={{
                                fontSize: 25,
                                fontWeight: "900",
                                marginBottom: 10,
                                color: theme.text,
                            }}
                        >
                            Remove Player
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter player name"
                            placeholderTextColor={"gray"}
                            onChangeText={PlayerSearch}
                        />
                    </View>

                    {PlayersData.length > 0 ? (
                        PlayersData.map((player) => {
                            return (
                                <View
                                    key={player.playerId}
                                    style={styles.playerContainer}
                                >
                                    <Text
                                        style={{
                                            flex: 1,
                                            marginRight: 5,
                                            padding: 10,
                                            borderWidth: 2,
                                            borderColor: theme.borderColor,
                                            borderRadius: 10,
                                            color: theme.text,
                                        }}
                                    >
                                        {player.name}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() =>
                                            handleRemovePlayer(player.playerId)
                                        }
                                    >
                                        <Text style={{ color: "white" }}>
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
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

export default RemovePlayer;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
        },
        input: {
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 10,
            color: theme.text,
        },
        playerContainer: {
            flexDirection: "row",
            marginBottom: 10,
        },
        button: {
            borderWidth: 2,
            borderColor: "red",
            borderRadius: 10,
            padding: 10,
            backgroundColor: "red",
        },
    });
};
