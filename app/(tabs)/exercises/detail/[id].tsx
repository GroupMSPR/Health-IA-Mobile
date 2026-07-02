import React, { useEffect, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FullHeader } from "../../../../assets/componants/header"
import { Redirect, useLocalSearchParams } from "expo-router";
import api from "../../../../lib/api";

const difficultyColors: Record<string, string> = {
    Beginner: "#22C55E",
    Intermediate: "#F59E0B",
    Advanced: "#EF4444",
};

const injuryColors: Record<string, string> = {
    Low: "#22C55E",
    Medium: "#F59E0B",
    High: "#EF4444",
};

interface Equipment {
    id: string;
    name: string;
}

interface Muscle {
    id: string;
    name: string;
}

interface Exercise {
    id: string;
    name: string;
    category: string;
    sub_category?: string;
    image?: string | null;
    difficulty_level: string;
    injury_risk_level?: string;
    target_muscle: string;
    secondary_muscle: string;
    range_of_motion?: string;
    recommended_duration_seconds: number;
    recommended_rest_minutes: number;
    estimated_calories_per_minutes: number;
    rep_range_min: number;
    rep_range_max: number;
    short_description?: string;
    instructions?: string;
    equipments?: Equipment[];
    primaryMuscles?: Muscle[];
    secondaryMuscles?: Muscle[];
}

export default function ExerciseDetailScreen() {
    const { id } = useLocalSearchParams();
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exercise, setExercise] = useState<Exercise | null>(null);

    const DEFAULT_EXERCISE_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000";

    const getDifficultyTranslation = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return 'Débutant';
            case 'Intermediate': return 'Intermédiaire';
            case 'Advanced': return 'Avancé';
            default: return difficulty || 'N/A';
        }
    };

    useEffect(() => {
        console.log()
        console.log(exercise)
    }, [exercise])

    useEffect(() => {
        console.log("exercise id =" + id)
        const fetchExerciseDetail = async () => {
            if (!id) return <Redirect href="/(tabs)/home" />;
            setIsLoading(true);
            setError(null);

            try {
                const response = await api.post('/api/exercises/search', {
                    search: {
                        filters: [
                            { field: 'id', operator: 'in', value: [id] }
                        ],
                        includes: [
                            { relation: 'equipments' },
                            { relation: 'primaryMuscles' },
                            { relation: 'secondaryMuscles' }
                        ]
                    }
                });

                const results = response.data?.data || response.data;
                console.log(response)

                if (Array.isArray(results) && results.length > 0) {
                    setExercise(results[0]);
                } else if (results && results.id) {
                    setExercise(results);
                } else {
                    setError("L'exercice demandé est introuvable.");
                }
            } catch (err: any) {
                console.error("Erreur récupération détail exercice:", err);
                const msg = "Impossible de charger les détails de l'exercice.";
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExerciseDetail();
    }, []);



    return (
        <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <FullHeader open={open} setOpen={setOpen} />

            <View style={{ backgroundColor: "#f4f4f4", paddingBottom: 30 }}>

                {/* Image */}
                <Image
                    source={{ uri: exercise?.image ?? DEFAULT_EXERCISE_IMAGE }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Title */}
                <View style={styles.header}>
                    <Text style={styles.title}>{isLoading
                        ? "loading"
                        : exercise?.name ?? "error"}
                    </Text>
                    <Text style={styles.category}>{isLoading
                        ? "loading"
                        : exercise?.category ?? "error"}
                    </Text>
                </View>

                {/* Stats */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Exercise Information</Text>

                    <InfoRow
                        icon="arm-flex"
                        label="Difficulty"
                        value={isLoading
                            ? "loading"
                            : exercise?.difficulty_level ?? "error"}
                        color={
                            exercise?.difficulty_level
                                ? difficultyColors[exercise?.difficulty_level] ?? "#6B7280"
                                : "#6B7280"
                        }
                    />

                    <InfoRow
                        icon="repeat"
                        label="Rep Range"
                        value={isLoading
                            ? "loading"
                            : `${exercise?.rep_range_min ?? "error"} - ${exercise?.rep_range_max ?? "error"}`}
                    />

                    <InfoRow
                        icon="clock-outline"
                        label="Recommended Duration"
                        value={isLoading
                            ? "loading"
                            : exercise?.recommended_duration_seconds != null
                                ? `${Math.floor(exercise.recommended_duration_seconds / 60)} min`
                                : "error"}
                    />

                    <InfoRow
                        icon="timer-outline"
                        label="Recommended Rest"
                        value={isLoading
                            ? "loading"
                            : exercise?.recommended_rest_minutes != null
                                ? `${exercise.recommended_rest_minutes} min`
                                : "error"}
                    />

                    <InfoRow
                        icon="fire"
                        label="Calories / Minute"
                        value={isLoading
                            ? "loading"
                            : exercise?.estimated_calories_per_minutes != null
                                ? `${exercise.estimated_calories_per_minutes} kcal`
                                : "error"}
                        color="#EA580C"
                    />

                    <InfoRow
                        icon="alert-circle"
                        label="Injury Risk"
                        value={isLoading
                            ? "loading"
                            : exercise?.injury_risk_level ?? "error"}
                        color={
                            exercise?.injury_risk_level ? injuryColors[exercise?.injury_risk_level] ?? "#6B7280" : "#6B7280"
                        }
                    />
                </View>

                {/* Instructions */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Instructions</Text>

                    <Text style={styles.instructions}>
                        {isLoading
                            ? "loading"
                            : exercise?.instructions ?? "error"}
                    </Text>
                </View>

            </View>
        </ScrollView>
    );
}

function InfoRow({
    icon,
    label,
    value,
    color = "#374151",
}: {
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    label: string
    value: string
    color?: string
}) {
    return (
        <View style={styles.infoRow}>
            <View style={styles.left}>
                <MaterialCommunityIcons
                    name={icon}
                    size={22}
                    color={color}
                />
                <Text style={styles.label}>{label}</Text>
            </View>

            <Text style={[styles.value, { color }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 260,
    },

    header: {
        padding: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1F2937",
    },

    category: {
        marginTop: 4,
        fontSize: 16,
        color: "#6B7280",
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        marginHorizontal: 12,
        marginBottom: 14,
        padding: 18,
        borderWidth: 1,
        borderColor: "#d4d4d4",
    },

    cardTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 14,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },

    left: {
        flexDirection: "row",
        alignItems: "center",
    },

    label: {
        marginLeft: 10,
        fontSize: 16,
        color: "#374151",
    },

    value: {
        fontWeight: "600",
        fontSize: 15,
    },

    instructions: {
        fontSize: 16,
        color: "#4B5563",
        lineHeight: 26,
    },
});