import React from "react";
import { Stack } from "expo-router";
import { Text } from "react-native";

const AdminLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="addPlayer" options={{ headerShown: false }} />
            <Stack.Screen name="editPlayer" options={{ headerShown: false }} />
            <Stack.Screen
                name="removePlayer"
                options={{ headerShown: false }}
            />
            <Stack.Screen name="createMatch" options={{ headerShown: false }} />
        </Stack>
    );
};

export default AdminLayout;
