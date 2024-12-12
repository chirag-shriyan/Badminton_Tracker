import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import useAuthStore from "@/store/AuthStore";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
    const { login } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={Theme === "Dark" ? "light" : "dark"} />

            <Text
                style={{
                    fontSize: 25,
                    fontWeight: "900",
                    marginBottom: 10,
                    color: theme.text,
                }}
            >
                Login
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter email"
                placeholderTextColor={"gray"}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={"gray"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => login(email, password)}
            >
                <Text
                    style={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 15,
                    }}
                >
                    Login
                </Text>
            </TouchableOpacity>

            <Link
                href={"/signup"}
                style={{
                    marginVertical: 30,
                    marginHorizontal: 5,
                    textAlign: "center",
                    color: "#00a2ee",
                }}
            >
                don't have a account?
            </Link>
        </SafeAreaView>
    );
};

export default Login;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 200,
            paddingHorizontal: 20,
            backgroundColor: theme.background,
        },
        input: {
            padding: 10,
            borderColor: "gray",
            borderWidth: 2,
            borderRadius: 10,
            marginTop: 10,
            color: theme.text,
        },
        button: {
            padding: 10,
            borderColor: theme.btnColor,
            borderWidth: 2,
            borderRadius: 10,
            marginTop: 10,
            backgroundColor: theme.btnColor,
        },
    });
};
