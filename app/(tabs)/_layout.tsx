import { Tabs } from "expo-router";
import {
    AntDesign,
    FontAwesome,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons/";
import useAuthStore from "@/store/AuthStore";

import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";

export default function TabLayout() {
    const { isAdmin } = useAuthStore();

    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.tint,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: theme.tabBackground,
                },
            }}
        >
            
            <Tabs.Screen
                name="index"
                options={{
                    title: "Ranking",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <AntDesign name="barchart" size={24} color={color} />
                    ),
                    tabBarLabelPosition: "below-icon",
                }}
            />

            <Tabs.Screen
                name="matchHistory"
                options={{
                    title: "Match History",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name="history"
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarLabelPosition: "below-icon",
                }}
            />

            <Tabs.Screen
                name="admin"
                options={{
                    title: "Admin",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons
                            name="admin-panel-settings"
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarLabelPosition: "below-icon",
                }}
                redirect={!isAdmin}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesome name="user" size={24} color={color} />
                    ),
                    tabBarLabelPosition: "below-icon",
                }}
            />
        </Tabs>
    );
}
