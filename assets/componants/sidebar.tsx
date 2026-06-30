import { Animated, Dimensions, Pressable, Text } from "react-native";
import { router } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;

const NavigationSidebar = ({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const translateX = open ? 0 : -SCREEN_WIDTH * 0.75;
    

    return (
        <>
            {/* BACKDROP */}
            {open && (
                <Pressable
                    onPress={() => setOpen(false)}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        zIndex: 1
                    }}
                />
            )}

            {/* SIDEBAR */}
            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: SCREEN_WIDTH * 0.75,
                    backgroundColor: "#fff",
                    padding: 20,
                    transform: [{ translateX }],
                    zIndex: 2
                }}
            >
                <Text style={{ fontSize: 20, marginBottom: 20 }}>Menu</Text>

                <Text style={{ marginBottom: 15 }}>🏠 Home</Text>
                <Pressable onPress={() => router.replace("/(tabs)/feed")}>
                    <Text style={{ marginBottom: 15 }}>🧠 AI Coach</Text>
                </Pressable>
                <Text style={{ marginBottom: 15 }}>➕ Create</Text>
                <Text style={{ marginBottom: 15 }}>👤 Profile</Text>
            </Animated.View>
        </>
    );
};

export default NavigationSidebar;