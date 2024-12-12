import { router, useLocalSearchParams } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import usePlayerStore, { PlayerDataType } from "@/store/PlayerStore";
import useNetInfoStore from "@/store/NetInfo";

import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";

export default function EditPlayer() {
    const { id } = useLocalSearchParams();
    const { getPlayer, editPlayer } = usePlayerStore();
    const { isInternetConnected } = useNetInfoStore();

    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    const [Player, setPlayer] = useState<PlayerDataType | null>(null);

    const [name, setName] = useState("");
    const [points, setPoints] = useState("");
    const [totalMatch, setTotalMatch] = useState("");
    const [totalWin, setTotalWin] = useState("");
    const [totalLost, setTotalLost] = useState("");

    useEffect(() => {
        if (Player) {
            setName(Player.name);
            setPoints(Player.points.toString());
            setTotalMatch(Player.totalMatch.toString());
            setTotalWin(Player.totalWin.toString());
            setTotalLost(Player.totalLost.toString());
        }
    }, [Player]);

    useEffect(() => {
        const player = getPlayer(id as string);
        setPlayer(player);
    }, []);

    function handleEditPlayer() {
        const condition =
            name.trim() !== "" &&
            points.trim() !== "" &&
            totalMatch.trim() !== "" &&
            totalWin.trim() !== "" &&
            totalLost.trim() !== "";

        if (isInternetConnected && Player && condition) {
            const player = {
                playerId: Player.playerId,
                name: name,
                points: Number(points),
                totalMatch: Number(totalMatch),
                totalWin: Number(totalWin),
                totalLost: Number(totalLost),
            };
            editPlayer(player);
            router.replace("/");
        } else if (!isInternetConnected) {
            alert("This action requires internet connection");
        } else {
            alert("All the fields are required");
        }
    }

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
                        <View style={styles.playerContainer}>
                            <Text style={styles.text}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter player's name"
                                placeholderTextColor={"gray"}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.playerContainer}>
                            <Text style={styles.text}>Points</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter player's points"
                                placeholderTextColor={"gray"}
                                keyboardType="numeric"
                                value={points}
                                onChangeText={(text) =>
                                    !Number.isNaN(Number(text))
                                        ? setPoints(text)
                                        : setPoints("")
                                }
                            />
                        </View>

                        <View style={styles.playerContainer}>
                            <Text style={styles.text}>Total Match</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter player's total match"
                                placeholderTextColor={"gray"}
                                keyboardType="numeric"
                                value={totalMatch}
                                onChangeText={(text) =>
                                    !Number.isNaN(Number(text))
                                        ? setTotalMatch(text)
                                        : setTotalMatch("")
                                }
                            />
                        </View>

                        <View style={styles.playerContainer}>
                            <Text style={styles.text}>Total Win</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter player's total match"
                                placeholderTextColor={"gray"}
                                keyboardType="numeric"
                                inputMode="numeric"
                                value={totalWin}
                                onChangeText={(text) =>
                                    !Number.isNaN(Number(text))
                                        ? setTotalWin(text)
                                        : setTotalWin("")
                                }
                            />
                        </View>

                        <View style={styles.playerContainer}>
                            <Text style={styles.text}>Total Lost</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter player's total match"
                                placeholderTextColor={"gray"}
                                keyboardType="numeric"
                                value={totalLost}
                                onChangeText={(text) =>
                                    !Number.isNaN(Number(text))
                                        ? setTotalLost(text)
                                        : setTotalLost("")
                                }
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleEditPlayer}
                    >
                        <Text style={{ color: "white", textAlign: "center" }}>
                            Edit Player
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        input: {
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 10,
            color: theme.text,
        },
        playerContainer: {
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
        text: {
            color: theme.text,
            marginBottom: 10,
            fontSize: 15,
        },
    });
};
