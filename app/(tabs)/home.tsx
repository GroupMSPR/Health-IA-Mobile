import { View, Text, ScrollView } from "react-native"
import { FullHeader } from "../../assets/componants/header"
import DashboardInfoSquared from "../../assets/componants/DashboardInfoSquare"
import ExerciceVignet from "../../assets/componants/exerciceVignet"
import { useState } from "react"
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient"

const Home = () => {
    const [open, setOpen] = useState(false)
    const username = 'user'

    const data = [
        { label: "Mon", value: 5000, value2: 2200 },
        { label: "Tue", value: 7500, value2: 2400 },
        { label: "Wed", value: 6200, value2: 2100 },
        { label: "Thu", value: 8100, value2: 2600 },
        { label: "Fri", value: 9000, value2: 2800 },
        { label: "Sat", value: 10000, value2: 3000 },
        { label: "Sun", value: 7000, value2: 2300 },
    ];
    return (
        <ScrollView style={{ flex: 1 }} horizontal={false} showsVerticalScrollIndicator={false}>
            <FullHeader open={open} setOpen={setOpen} />
            <View style={{ backgroundColor: '#f4f4f4', flexDirection: 'column', alignContent: 'center' }}>

                <View style={{ flexDirection: 'column', alignContent: 'center', padding: 8 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Welcome back, {username}</Text>
                    <Text>Here's your fitness summary for today</Text>
                </View>


                <View style={{ flexDirection: 'column', alignContent: 'center', padding: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <DashboardInfoSquared squareColor={"#00f"} percentAsText={"%12+"} percentColor="#0f0" text={"Active Minutes"} value={"248"} />
                        <DashboardInfoSquared squareColor={"#00f"} percentAsText={"%12+"} percentColor="#0f0" text={"Active Minutes"} value={"248"} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <DashboardInfoSquared squareColor={"#00f"} percentAsText={"%12+"} percentColor="#0f0" text={"Active Minutes"} value={"248"} />
                        <DashboardInfoSquared squareColor={"#00f"} percentAsText={"%12+"} percentColor="#0f0" text={"Active Minutes"} value={"248"} />
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        borderColor: "#bCbCbC",
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 24,
                        borderBottomLeftRadius: 24,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        marginLeft: 8,
                        padding: 8
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "700",
                            color: "#1F2937",
                            padding: 8
                        }}
                    >
                        Today's Workout Plan
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
                        <ExerciceVignet title={"Barbell Squat"} difficulty={"Intermediate"} difficultyColor={"#00f"} duration={"45min"} caloriesBurntEstimate={"320"} reps={"4x8-12"} id={"187870d8-1fc8-4097-a7df-02dde1792e01"} />
                        <ExerciceVignet title={"Barbell Squat"} difficulty={"Intermediate"} difficultyColor={"#00f"} duration={"45min"} caloriesBurntEstimate={"320"} reps={"4x8-12"} id={"187870d8-1fc8-4097-a7df-02dde1792e01"} />
                        <ExerciceVignet title={"Barbell Squat"} difficulty={"Intermediate"} difficultyColor={"#00f"} duration={"45min"} caloriesBurntEstimate={"320"} reps={"4x8-12"} id={"187870d8-1fc8-4097-a7df-02dde1792e01"} />
                        <ExerciceVignet title={"Barbell Squat"} difficulty={"Intermediate"} difficultyColor={"#00f"} duration={"45min"} caloriesBurntEstimate={"320"} reps={"4x8-12"} id={"187870d8-1fc8-4097-a7df-02dde1792e01"} />
                        <ExerciceVignet title={"Barbell Squat"} difficulty={"Intermediate"} difficultyColor={"#00f"} duration={"45min"} caloriesBurntEstimate={"320"} reps={"4x8-12"} id={"187870d8-1fc8-4097-a7df-02dde1792e01"} />
                    </ScrollView>
                </View>

                <View>
                    <LineChart
                        data={data}
                        data2={data.map(item => ({ value: item.value2 }))}

                        curved
                        thickness={3}
                        thickness2={3}

                        color="#4CAF50"      // steps line
                        color2="#FF9800"     // calories line

                        xAxisLabelTextStyle={{ fontSize: 12 }}
                        yAxisTextStyle={{ fontSize: 12 }}

                        hideRules={false}
                        showVerticalLines
                    />
                </View>

            </View>

        </ScrollView>)
}

export default Home
