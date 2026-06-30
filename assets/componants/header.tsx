import { View, Text, Image, Animated, Dimensions, Pressable } from "react-native"
import { router } from "expo-router";

const NavigatorHeader = ({
    setOpen
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <View style={{
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: "#bCbCbC"
        }}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
                Health AI Coach
            </Text>

            <Pressable onPress={() => setOpen(true)}>
                <Image
                    source={require('../../assets/images/menu.png')}
                    style={{ width: 40, height: 40 }}
                />
            </Pressable>
        </View>
    );
}
export default NavigatorHeader

const SCREEN_WIDTH = Dimensions.get("window").width;

export const NavigationSidebar = ({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const translateX = open ? 0 : -SCREEN_WIDTH * 0.75;


    return (
        <>
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

                <Pressable onPress={() => router.replace("/(tabs)/home")}>
                    <Text style={{ marginBottom: 15 }}>🏠 Home</Text>
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/feed")}>
                    <Text style={{ marginBottom: 15 }}>🧠 AI Coach</Text>
                </Pressable>
                <Pressable onPress={() => router.replace("/(tabs)/profile")}>
                <Text style={{ marginBottom: 15 }}>👤 Profile</Text>
                </Pressable>
            </Animated.View >
        </>
    );
};

export const FullHeader = ({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <>
            <NavigatorHeader setOpen={setOpen} />
            <NavigationSidebar open={open} setOpen={setOpen} />
        </>
    )
}