import { View, StyleSheet, Button } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import useThemeStore from "@/store/ThemeStore";

import MatchStart from "@/components/MatchStart";
import SelectPlayer from "@/components/SelectPlayer";
import useCreateMatchStore from "@/store/CreateMatchStore";

const CreateMatch = () => {
    const { Theme } = useThemeStore();
    const theme = Theme === "Dark" ? Colors.dark : Colors.light;
    // const styles = generateStyles(theme);

    const { isMatchStarted, Player1, Player2, EndMatch, StartMatch } =
        useCreateMatchStore();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 20,
                    backgroundColor: theme.background,
                }}
            >
                {!isMatchStarted ? <SelectPlayer /> : <MatchStart />}
            </View>
            <View
                style={{
                    paddingHorizontal: 20,
                    marginBottom: 20,
                }}
            >
                {!isMatchStarted && (
                    <View>
                        {Player1 && Player2 && (
                            <View>
                                <Button
                                    title="Start Match"
                                    color={"green"}
                                    onPress={StartMatch}
                                />
                            </View>
                        )}
                        {(Player1 || Player2) && (
                            <View style={{ marginTop: 20 }}>
                                <Button
                                    title="Reset Players"
                                    color={"red"}
                                    onPress={EndMatch}
                                />
                            </View>
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default CreateMatch;

const generateStyles = (theme: typeof Colors.dark | typeof Colors.light) => {
    return StyleSheet.create({});
};
