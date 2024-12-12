import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";

import usePlayerStore from "@/store/PlayerStore";
import useNetInfoStore from "@/store/NetInfo";
import { useEffect, useState } from "react";
import { router } from "expo-router";

const EditPlayer = () => {
    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);


    const InitialPlayersData = usePlayerStore().PlayersData;
    const [PlayersData, setPlayersData] = useState(InitialPlayersData);

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
                            Edit Player
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
                                    style={styles.playerContainer}
                                    key={player.playerId}
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
                                            router.push(
                                                `/edit_player/${player.playerId}`
                                            )
                                        }
                                    >
                                        <Text style={{ color: "white" }}>
                                            Edit
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

export default EditPlayer;

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
            borderColor: theme.btnColor,
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: theme.btnColor,
        },
    });
};
