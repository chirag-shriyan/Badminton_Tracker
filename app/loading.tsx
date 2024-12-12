import { View, Text } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";
import { StatusBar } from "expo-status-bar";

const Loading = () => {
    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.background,
            }}
        >
            <StatusBar style={Theme === "Dark" ? "light" : "dark"} />
            
            <Text style={{ fontSize: 20, color: theme.text }}>Loading...</Text>
        </View>
    );
};

export default Loading;
