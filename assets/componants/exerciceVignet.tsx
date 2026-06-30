import { View, Pressable, Text, StyleSheet } from "react-native";
import { router } from "expo-router";

type ExerciseVignetteProps = {
  title: string;
  difficulty: string;
  difficultyColor: string;
  duration: string;
  caloriesBurntEstimate: string;
  reps: string;
  id: string;
};

const ExerciseVignette = ({
  title,
  difficulty,
  difficultyColor,
  duration,
  caloriesBurntEstimate,
  reps,
  id,
}: ExerciseVignetteProps) => {
  return (
    <Pressable
      onPress={() => router.replace(`/(tabs)/exercise/${id}`)}
      style={styles.card}
    >
      <Text style={styles.title}>{title}</Text>

      <Text style={[styles.difficulty, { color: difficultyColor }]}>
        {difficulty}
      </Text>

      <View style={styles.row}>
        <Text style={styles.meta}>🕙{duration}</Text>
        <Text style={styles.meta}>🔥{caloriesBurntEstimate}</Text>
        <Text style={styles.meta}>🔄️{reps}</Text>
      </View>
    </Pressable>
  );
};

export default ExerciseVignette;

const styles = StyleSheet.create({
  card: {
    borderColor: "#bcbcbc",
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    margin: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 4,
  },
  difficulty: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  meta: {
    fontSize: 14,
    color: "#444",
  },
});