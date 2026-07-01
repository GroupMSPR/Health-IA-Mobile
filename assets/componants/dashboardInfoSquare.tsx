import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons";

const DashboardInfoSquared = ({
    squareColor,
    percentAsText,
    percentColor,
    text,
    value
}: {
    squareColor: string
    percentAsText: string
    percentColor: string
    text: string
    value: string
}) => {
    return (
        <View style={{
            borderColor: "#bCbCbC",
            backgroundColor:"#fff",
            borderRadius: 24,
            borderWidth: 1,
            flexBasis: "48%",
            padding: 20,
            margin:5
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start"
            }}>
                <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Ionicons name="square" size={20} color={squareColor}/>
                </View>

                <Text style={{
                    color: percentColor,
                    fontWeight: "600",
                    fontSize: 16
                }}>{percentAsText}</Text>
            </View>

            <Text style={{
                marginTop: 24,
                color: "#6B7280",
                fontSize: 16
            }}>{text}</Text>

            <Text style={{
                marginTop: 4,
                fontSize: 40,
                fontWeight: "700",
                color: "#111827"
            }}>{value}</Text>
        </View>
    );
}
export default DashboardInfoSquared
