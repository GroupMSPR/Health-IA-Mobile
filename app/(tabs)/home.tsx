import { View, Text, ScrollView } from "react-native"
import { FullHeader } from "../../assets/componants/header"
import DashboardInfoSquared from "../../assets/componants/dashboardInfoSquare"
import ExerciceVignet from "../../assets/componants/exerciceVignet"
import { useEffect, useState } from "react"
import { LineChart } from "react-native-gifted-charts";
import api from "../../lib/api"
import { useAuth } from "../../context/authContext"

interface HealthMetric {
    id: string;
    date: string;
    weight: number | null;
    steps_count: number | null;
    sleep_time: string | null;
    calories_burned: number | null;
    active_minute: number | null;
}

interface Exercise {
    id: string;
    name: string;
    category: string;
    image?: string | null;
    difficulty_level: string;
    target_muscle: string;
    recommended_duration_seconds: number;
    ai_confidence?: number; 
}

const Home = () => {
    const [open, setOpen] = useState(false)
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [availableGoals, setAvailableGoals] = useState<any[]>([]);
    const [availableConstraints, setAvailableConstraints] = useState<any[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
    const [isSavingOnboarding, setIsSavingOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [recommendations, setRecommendations] = useState<Exercise[]>([]);
    const [error, setError] = useState<string | null>(null);


    const [weeklyData, setWeeklyData] = useState({
        totalMinutes: 0,
        totalCalories: 0,
        totalSteps: 0,
        latestWeight: null as number | null,
        minChange: { text: '--', type: 'neutral' },
        calChange: { text: '--', type: 'neutral' },
        stepChange: { text: '--', type: 'neutral' },
        weightChange: { text: '--', type: 'neutral' },
        chartLabels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        chartCalories: [0, 0, 0, 0, 0, 0, 0],
        chartSteps: [0, 0, 0, 0, 0, 0, 0]
    });

    const data = [
        { label: "Mon", value: 5000, value2: 2200 },
        { label: "Tue", value: 7500, value2: 2400 },
        { label: "Wed", value: 6200, value2: 2100 },
        { label: "Thu", value: 8100, value2: 2600 },
        { label: "Fri", value: 9000, value2: 2800 },
        { label: "Sat", value: 10000, value2: 3000 },
        { label: "Sun", value: 7000, value2: 2300 },
    ];

    const { user } = useAuth();

    const fetchRecommendations = async () => {
    if (!user) return;

    try {
        // BMI
        let calculatedBmi = user.bmi;

        if (!calculatedBmi && user.weight && user.height) {
            calculatedBmi =
                Number(user.weight) /
                Math.pow(Number(user.height) / 100, 2);
        }

        // Age
        let age = 25;

        if (user.birthdate) {
            const birth = new Date(user.birthdate);
            const today = new Date();

            age = today.getFullYear() - birth.getFullYear();

            const m = today.getMonth() - birth.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
        }

        const aiPayload = {
            age,
            bmi: parseFloat((Number(calculatedBmi) || 22).toFixed(1)),
            physical_activity_level:
                user.physical_activity_level || "moderate",
            favorite_exercise_category:
                user.favorite_exercise_category || "Cardio",
        };

        // AI prediction
        console.log("ai prediction")
        const aiResponse = await api.post("/api/ai/recommend", aiPayload);

        console.log(aiResponse)

        const predictions =
            aiResponse.data?.predictions ||
            aiResponse.data?.data?.predictions ||
            [];

        if (!Array.isArray(predictions) || predictions.length === 0) {
            setRecommendations([]);
            return;
        }

        const top5 = predictions.slice(0, 5);

        const exerciseNames = top5.map((p: any) => p.exercise);

        // Fetch exercise details
        console.log("fetch exercise details")
        let dbExercises: any[] = [];

        if (exerciseNames.length) {
            const dbResponse = await api.post("/api/exercises/search", {
                search: {
                    filters: [
                        {
                            field: "name",
                            operator: "in",
                            value: exerciseNames,
                        },
                    ],
                },
            });
            console.log(dbResponse)
            dbExercises = dbResponse.data?.data || dbResponse.data || [];
        }

        // Merge AI + DB
        const merged = top5.map((prediction: any) => {
            const exercise = dbExercises.find(
                (e: any) =>
                    e?.name?.toLowerCase() ===
                    prediction.exercise?.toLowerCase()
            );

            if (exercise) {
                return {
                    ...exercise,
                    ai_confidence: prediction.confidence,
                };
            }

            return null;
        });

        console.log(merged)
        setRecommendations(merged);
    } catch (err) {
        console.error(err);
    }
};

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // 1. VÉRIFICATION DE L'ONBOARDING (L'utilisateur a-t-il des objectifs ?)
                const userRes = await api.post('/api/users/search', {
                    search: {
                        filters: [{ field: 'id', operator: '=', value: user.id }],
                        includes: [{ relation: 'goals' }]
                    }
                });

                fetchRecommendations()

                const currentUserData = userRes.data?.data?.[0] || userRes.data?.[0];

                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const pastDateString = sevenDaysAgo.toISOString().split('T')[0];

                const response = await api.post('/api/health-metrics/search', {
                    search: {
                        filters: [
                            { field: 'user_id', operator: '=', value: user.id },
                            { field: 'date', operator: '>=', value: pastDateString }
                        ],
                        sorts: [
                            { field: 'date', direction: 'desc' }
                        ]
                    }
                });

                const data: HealthMetric[] = response.data?.data || response.data || [];

                // Vérifier si on a un bilan pour aujourd'hui

                // Préparer les tableaux pour les 7 derniers jours
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return d.toISOString().split('T')[0];
                });

                const dayNames = last7Days.map(dateStr => new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short' }));

                const calData = last7Days.map(date => {
                    const m = data.find(x => x.date.startsWith(date));
                    return m?.calories_burned ? Number(m.calories_burned) : 0;
                });
                const stpData = last7Days.map(date => {
                    const m = data.find(x => x.date.startsWith(date));
                    return m?.steps_count ? Number(m.steps_count) : 0;
                });
                const minData = last7Days.map(date => {
                    const m = data.find(x => x.date.startsWith(date));
                    return m?.active_minute ? Number(m.active_minute) : 0;
                });

                // Calcul des totaux
                const totalCal = calData.reduce((a, b) => a + b, 0);
                const totalMin = minData.reduce((a, b) => a + b, 0);
                const totalStp = stpData.reduce((a, b) => a + b, 0);

                const latestWeight = data.find(m => m.weight !== null)?.weight || user.weight || null;
                const previousWeight = data.filter(m => m.weight !== null).length > 1
                    ? data.filter(m => m.weight !== null)[1].weight
                    : null;

                // Calcul des tendances
                const getChange = (today: number, yesterday: number) => {
                    if (!yesterday && !today) return { text: '--', type: 'neutral' };
                    if (!yesterday) return { text: '+100%', type: 'positive' };
                    const diff = Math.round(((today - yesterday) / yesterday) * 100);
                    return {
                        text: diff > 0 ? `+${diff}%` : `${diff}%`,
                        type: diff > 0 ? 'positive' : (diff < 0 ? 'negative' : 'neutral')
                    };
                };

                let weightChange = { text: '--', type: 'neutral' };
                if (latestWeight && previousWeight && latestWeight !== previousWeight) {
                    const diff = (latestWeight - previousWeight).toFixed(1);
                    weightChange = {
                        text: Number(diff) > 0 ? `+${diff}kg` : `${diff}kg`,
                        type: Number(diff) > 0 ? 'negative' : 'positive'
                    };
                }

                setWeeklyData({
                    totalMinutes: totalMin,
                    totalCalories: totalCal,
                    totalSteps: totalStp,
                    latestWeight: latestWeight,
                    minChange: getChange(minData[6], minData[5]),
                    calChange: getChange(calData[6], calData[5]),
                    stepChange: getChange(stpData[6], stpData[5]),
                    weightChange: weightChange,
                    chartLabels: dayNames,
                    chartCalories: calData,
                    chartSteps: stpData
                });

                weeklyData.totalMinutes.toString()

            } catch (error) {
                console.error("Erreur récupération données:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const stats = [
        { id: 1, name: 'Minutes actives (7j)', value: weeklyData.totalMinutes.toString(), change: weeklyData.minChange.text, changeType: weeklyData.minChange.type, icon: "#00f", bgColor: 'bg-blue-50' },
        { id: 2, name: 'Calories brûlées (7j)', value: weeklyData.totalCalories.toLocaleString('fr-FR'), change: weeklyData.calChange.text, changeType: weeklyData.calChange.type, icon: "#f00", bgColor: 'bg-orange-50' },
        { id: 3, name: 'Pas cumulés (7j)', value: weeklyData.totalSteps.toLocaleString('fr-FR'), change: weeklyData.stepChange.text, changeType: weeklyData.stepChange.type, icon: "#a500a5", bgColor: 'bg-purple-50' },
        { id: 4, name: 'Poids actuel', value: weeklyData.latestWeight ? `${weeklyData.latestWeight}` : '--', change: weeklyData.weightChange.text, changeType: weeklyData.weightChange.type, icon: "#0f0", bgColor: 'bg-emerald-50' },
    ];


    return (
        <ScrollView style={{ flex: 1 }} horizontal={false} showsVerticalScrollIndicator={false} >
            <FullHeader open={open} setOpen={setOpen} />
            <View style={{ backgroundColor: '#f4f4f4', flexDirection: 'column', alignContent: 'center' }}>

                <View style={{ flexDirection: 'column', alignContent: 'center', padding: 8 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Welcome back, {user?.first_name}</Text>
                    <Text>Here's your fitness summary for today</Text>
                </View>

                <View style={{ flexDirection: 'column', alignContent: 'center', padding: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <DashboardInfoSquared squareColor={stats[0].icon} percentAsText={stats[0].change} percentColor={stats[0].changeType === 'positive' ? 'text-emerald-600' : stats[0].changeType === 'negative' ? 'text-red-500' : 'text-slate-400'} text={stats[0].name} value={stats[0].value} />
                        <DashboardInfoSquared squareColor={stats[1].icon} percentAsText={stats[1].change} percentColor={stats[1].changeType === 'positive' ? 'text-emerald-600' : stats[1].changeType === 'negative' ? 'text-red-500' : 'text-slate-400'} text={stats[1].name} value={stats[1].value} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <DashboardInfoSquared squareColor={stats[2].icon} percentAsText={stats[2].change} percentColor={stats[2].changeType === 'positive' ? 'text-emerald-600' : stats[2].changeType === 'negative' ? 'text-red-500' : 'text-slate-400'} text={stats[2].name} value={stats[2].value} />
                        <DashboardInfoSquared squareColor={stats[3].icon} percentAsText={stats[3].change} percentColor={stats[3].changeType === 'positive' ? 'text-emerald-600' : stats[3].changeType === 'negative' ? 'text-red-500' : 'text-slate-400'} text={stats[3].name} value={stats[3].value} />
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        borderColor: "#bCbCbC",
                        borderWidth: 1,
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 24,
                        borderBottomLeftRadius: 24,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        marginLeft: 8,
                        marginBottom: 8,
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

                <View style={{
                    flexDirection: "column",
                    alignItems: "center",
                    borderColor: "#bCbCbC",
                    borderWidth: 1,
                    backgroundColor: "#fff",
                    borderRadius: 24,
                    margin: 8,
                    padding: 8
                }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: "700",
                        color: "#1F2937",
                        padding: 8
                    }}>Weekly Progress</Text>

                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}>
                            <View style={{ width: 12, height: 12, backgroundColor: "#4CAF50", marginRight: 6 }} />
                            <Text>Steps</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ width: 12, height: 12, backgroundColor: "#FF9800", marginRight: 6 }} />
                            <Text>Calories</Text>
                        </View>
                    </View>

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


