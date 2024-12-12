import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";
import { SafeAreaView } from "react-native-safe-area-context";

const Admin = () => {
    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

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
                Admin Panel
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/createMatch")}
            >
                <Entypo name="add-to-list" size={24} color={theme.text} />
                <Text style={styles.buttonText}>Create Match</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/addPlayer")}
            >
                <FontAwesome5 name="user-plus" size={24} color={theme.text} />
                <Text style={styles.buttonText}>Add Player</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/editPlayer")}
            >
                <FontAwesome5 name="user-edit" size={24} color={theme.text} />
                <Text style={styles.buttonText}>Edit Player</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/removePlayer")}
            >
                <FontAwesome5 name="user-minus" size={24} color={theme.text} />
                <Text style={styles.buttonText}>Remove Player</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Admin;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        button: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 10,
            padding: 20,
            marginVertical: 10,
        },
        buttonText: {
            fontSize: 16,
            fontWeight: "500",
            marginLeft: 10,
            color: theme.text,
        },
    });
};
