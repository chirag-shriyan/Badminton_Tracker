import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import useAuthStore from "@/store/AuthStore";
import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import useNetInfoStore from "@/store/NetInfo";

const Profile = () => {
    const { user, isAdmin, logout } = useAuthStore();
    const { isInternetConnected } = useNetInfoStore();

    const { Theme, setTheme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    const styles = generateStyles(theme);

    function handleLogout() {
        if (isInternetConnected) {
            logout();
        } else {
            alert("This action requires internet connection");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: 25,
                        fontWeight: "900",
                        marginBottom: 10,
                        color: theme.text,
                    }}
                >
                    Profile
                </Text>

                {user?.displayName && (
                    <Text style={styles.text}>
                        username : {user?.displayName}
                    </Text>
                )}
                {user?.email && (
                    <Text style={styles.text}>Email : {user?.email}</Text>
                )}
                {isAdmin && <Text style={styles.text}>Role : Admin</Text>}

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 30,
                    }}
                >
                    <Text style={{ ...styles.text, flex: 1 }}>
                        Theme : {Theme}
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                            setTheme(Theme === "Dark" ? "Light" : "Dark")
                        }
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "white",
                            }}
                        >
                            Toggle
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    marginBottom: 20,
                }}
            >
                <TouchableOpacity
                    style={{ ...styles.button }}
                    onPress={handleLogout}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            color: "white",
                        }}
                    >
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Profile;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 20,
            paddingHorizontal: 20,
            backgroundColor: theme.background,
        },
        text: {
            fontSize: 15,
            fontWeight: "900",
            marginBottom: 10,
            color: theme.text,
        },
        button: {
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 5,
            backgroundColor: theme.btnColor,
        },
    });
};
