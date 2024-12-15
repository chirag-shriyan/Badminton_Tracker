import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import React, { useState } from "react";
import useAuthStore from "@/store/AuthStore";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import useNetInfoStore from "@/store/NetInfo";

const Signup = () => {
    const { signup } = useAuthStore();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    const { isInternetConnected } = useNetInfoStore();

    function handleSignup(username: string, email: string, password: string) {
        if (isInternetConnected) {
            signup(username, email, password);
        } else {
            alert("No internet connection");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={"inverted"} />

            <Text
                style={{
                    fontSize: 25,
                    fontWeight: "900",
                    marginBottom: 10,
                    color: theme.text,
                }}
            >
                Sign up
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor={"gray"}
                value={username}
                onChangeText={setUsername}
            />
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
                onPress={() => handleSignup(username, email, password)}
            >
                <Text
                    style={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 15,
                    }}
                >
                    Sign up
                </Text>
            </TouchableOpacity>

            <Link
                href={"/login"}
                style={{
                    marginVertical: 30,
                    marginHorizontal: 5,
                    textAlign: "center",
                    color: "#00a2ee",
                }}
            >
                already have a account?
            </Link>
        </SafeAreaView>
    );
};

export default Signup;

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
