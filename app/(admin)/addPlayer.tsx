import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import useNetInfoStore from "@/store/NetInfo";

import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import usePlayerStore from "@/store/PlayerStore";

const AddPlayer = () => {
    const [playerName, setPlayerName] = useState("");
    const { isInternetConnected } = useNetInfoStore();
    const { setPlayer } = usePlayerStore();

    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    async function AddPlayer(name: string) {
        if (isInternetConnected) {
            setPlayer(name);
            setPlayerName("");
        } else {
            alert("This action requires internet connection");
        }
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingVertical: 20,
                paddingHorizontal: 20,
                backgroundColor: theme.background,
            }}
        >
            <Text
                style={{
                    fontSize: 25,
                    fontWeight: "900",
                    marginBottom: 10,
                    color: theme.text,
                }}
            >
                Add Player
            </Text>

            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter player name"
                    placeholderTextColor={"gray"}
                    value={playerName}
                    onChangeText={setPlayerName}
                    onSubmitEditing={() => AddPlayer(playerName)}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => AddPlayer(playerName)}
                >
                    <Text style={{ color: "white" }}>Create</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AddPlayer;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
        },
        input: {
            flex: 1,
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            marginRight: 5,
            padding: 10,
            color: theme.text,
        },
        button: {
            borderWidth: 2,
            borderColor: theme.btnColor,
            borderRadius: 10,
            padding: 10,
            backgroundColor: theme.btnColor,
        },
    });
};
