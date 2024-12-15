import useAuthStore from "@/store/AuthStore";
import useGlobalStateStore from "@/store/GlobalStateStore";
import useNetInfoStore from "@/store/NetInfo";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
    const { user, getUser, getUserOffline, checkIsAdmin, isAdmin, isLoggedIn } =
        useAuthStore();

    const { isInternetConnected, checkInternetConnection } = useNetInfoStore();

    const { isLoading, setLoading } = useGlobalStateStore();

    useEffect(() => {
        checkInternetConnection();
    }, []);

    useEffect(() => {
        if (isInternetConnected) {
            const unsub = getUser();
            user && checkIsAdmin();
            if (isAdmin !== null && isLoggedIn === true) {
                setLoading(false);
            } else if (isLoggedIn === false) {
                setLoading(false);
            }
            return () => unsub && unsub();
        } else {
            getUserOffline();
            if (isAdmin !== null && isLoggedIn === true) {
                setLoading(false);
            } else if (isLoggedIn === false) {
                setLoading(false);
            }
        }
    }, [isInternetConnected, isAdmin, isLoggedIn]);

    return (
        <Stack>
            <Stack.Screen
                name="loading"
                options={{ headerShown: false }}
                redirect={!isLoading}
            />

            <Stack.Screen
                name="login"
                options={{ headerShown: false }}
                redirect={isLoggedIn || isLoading}
            />
            <Stack.Screen
                name="signup"
                options={{ headerShown: false }}
                redirect={isLoggedIn || isLoading}
            />

            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
                redirect={!isLoggedIn || isLoading}
            />
            <Stack.Screen
                name="(admin)"
                options={{ headerShown: false }}
                redirect={!isLoggedIn || !isAdmin || isLoading}
            />
            <Stack.Screen
                name="player/[id]"
                options={{ headerShown: false }}
                redirect={!isLoggedIn || isLoading}
            />
            <Stack.Screen
                name="match/[id]"
                options={{ headerShown: false }}
                redirect={!isLoggedIn || isLoading}
            />
            <Stack.Screen
                name="edit_player/[id]"
                options={{ headerShown: false }}
                redirect={!isLoggedIn || isLoading}
            />
        </Stack>
    );
}
