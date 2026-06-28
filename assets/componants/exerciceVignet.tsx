import { View, Pressable, Text } from "react-native"
import { router } from "expo-router";

const ExerciceVignet = ({
    title,
    difficulty,
    difficultyColor,
    duration,
    caloriesBurntEstimate,
    reps,
    id
}: {
    title: string
    difficulty: string
    difficultyColor: string
    duration: string
    caloriesBurntEstimate: string
    reps: string
    id: string
}) => {

    return (
        <Pressable onPress={() => router.replace(`/(tabs)/exercise/${id}`)} 
        style={{ borderColor: "#bCbCbC",
            backgroundColor:"#fff",
            borderRadius: 24,
            borderWidth: 1,
            padding: 20,
            margin:5 }}>
            <View style={{ flexDirection: 'column', backgroundColor: "#fff" }}>
                <Text style={{ fontWeight: 'bold', fontSize: 22 }}>{title}</Text>
                <Text>{difficulty}</Text>
                <View style={{ flexDirection:'row' }}>
                    <Text>{duration}</Text>
                    <Text>{caloriesBurntEstimate}</Text>
                    <Text>{reps}</Text>
                </View>
            </View>
        </Pressable>
    );
}
export default ExerciceVignet