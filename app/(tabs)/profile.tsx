import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React from "react";
import useAuthStore from "@/store/AuthStore";
import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import useNetInfoStore from "@/store/NetInfo";
import useMatchHistoryStore from "@/store/MatchHistoryStore";
import useGlobalStateStore from "@/store/GlobalStateStore";
import Loading from "../loading";

const Profile = () => {
    const { user, isAdmin, logout } = useAuthStore();
    const { isInternetConnected } = useNetInfoStore();
    const { SyncDatabase, isLocalData } = useMatchHistoryStore();
    const { isLoading, setLoading } = useGlobalStateStore();

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
    function handleSyncDatabase() {
        if (isInternetConnected) {
            Alert.alert("", "Are you sure you want to sync local data", [
                { text: "Cancel", onPress: () => {}, style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        setLoading(true);
                        await SyncDatabase();
                        setTimeout(function () {
                            setLoading(false);
                        }, 100);
                    },
                },
            ]);
        } else {
            alert("This action requires internet connection");
        }
    }

    return !isLoading ? (
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
                {isLocalData && (
                    <TouchableOpacity
                        style={{
                            ...styles.button,
                            marginBottom: 10,
                            backgroundColor: "#ffbc11",
                        }}
                        onPress={handleSyncDatabase}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "white",
                            }}
                        >
                            Sync Local Data
                        </Text>
                    </TouchableOpacity>
                )}

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
    ) : (
        <Loading />
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
