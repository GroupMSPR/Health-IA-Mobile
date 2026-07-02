import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { FullHeader } from "../../../assets/componants/header";
import { router } from "expo-router";
import api from "../../../lib/api";

interface FormState {
    weight: string;
    steps_count: string;
    active_minute: string;
    calories_burned: string;
    sleep_hours: string;
    sleep_minutes: string;
    resting_bpm: string;
    avg_bpm: string;
    max_bpm: string;
}

interface InputFieldProps {
    label: string;
    field: keyof FormState;
    keyboardType?: any;
    placeholder?: string;
    form: FormState;
    onChange: (field: keyof FormState, value: string) => void;
}

const InputField = ({
    label,
    field,
    keyboardType = "numeric",
    placeholder,
    form,
    onChange,
}: InputFieldProps) => (
    <View style={{ marginBottom: 16 }}>
        <Text
            style={{
                fontWeight: "600",
                marginBottom: 6,
                color: "#374151",
            }}
        >
            {label}
        </Text>

        <TextInput
            value={form[field]}
            onChangeText={(text) => onChange(field, text)}
            keyboardType={keyboardType}
            placeholder={placeholder}
            blurOnSubmit={false}
            returnKeyType="next"
            style={{
                backgroundColor: "#F9FAFB",
                borderWidth: 1,
                borderColor: "#D1D5DB",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 16,
            }}
        />
    </View>
);

export default function HealthMetricsCreateScreen() {

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState<FormState>({
        weight: "",
        steps_count: "",
        active_minute: "",
        calories_burned: "",
        sleep_hours: "",
        sleep_minutes: "",
        resting_bpm: "",
        avg_bpm: "",
        max_bpm: "",
    });

    const handleChange = (field: keyof FormState, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        console.log('test')

        const hours = String(form.sleep_hours || 0).padStart(2, "0");
        const minutes = String(form.sleep_minutes || 0).padStart(2, "0");

        const formattedSleepTime = `${hours}:${minutes}:00`;

        try {
            const payload = {
                mutate: [
                    {
                        operation: "create",
                        attributes: {
                            weight:
                                form.weight === ""
                                    ? null
                                    : Number(form.weight),

                            steps_count:
                                form.steps_count === ""
                                    ? null
                                    : Number(form.steps_count),

                            active_minute:
                                form.active_minute === ""
                                    ? null
                                    : Number(form.active_minute),

                            calories_burned:
                                form.calories_burned === ""
                                    ? null
                                    : Number(form.calories_burned),

                            sleep_time: formattedSleepTime,

                            resting_bpm:
                                form.resting_bpm === ""
                                    ? null
                                    : Number(form.resting_bpm),

                            avg_bpm:
                                form.avg_bpm === ""
                                    ? null
                                    : Number(form.avg_bpm),

                            max_bpm:
                                form.max_bpm === ""
                                    ? null
                                    : Number(form.max_bpm),
                        },
                    },
                ],
            };

            await api.post("/api/health-metrics/mutate", payload);

            Toast.show({
                type: "success",
                text1: "Health metrics saved successfully!",
            });

            router.replace("/(tabs)/home")
        } catch (err: any) {
            console.log(err?.response?.data || err);

            Toast.show({
                type: "error",
                text1:
                    err?.response?.status === 422
                        ? "Validation error."
                        : "Unable to save health metrics.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#F4F4F4" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
            >
                <FullHeader open={open} setOpen={setOpen} />

                <View
                    style={{
                        backgroundColor: "#F4F4F4",
                        flex: 1,
                        padding: 10,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#FFF",
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor: "#dcdcdc",
                            padding: 18,
                            marginBottom: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: "700",
                                marginBottom: 4,
                            }}
                        >
                            Daily Health Metrics
                        </Text>

                        <Text
                            style={{
                                color: "#6B7280",
                                marginBottom: 20,
                            }}
                        >
                            Fill today's health information.
                        </Text>

                        <InputField
                            label="Weight (kg)"
                            field="weight"
                            placeholder="75.5"
                            form={form}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Steps"
                            field="steps_count"
                            placeholder="10000"
                            form={form}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Active Minutes"
                            field="active_minute"
                            placeholder="45"
                            form={form}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Calories Burned"
                            field="calories_burned"
                            placeholder="580"
                            form={form}
                            onChange={handleChange}
                        />

                        <Text
                            style={{
                                fontWeight: "600",
                                marginBottom: 10,
                            }}
                        >
                            Sleep Duration
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                marginBottom: 16,
                            }}
                        >
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <TextInput
                                    value={form.sleep_hours}
                                    onChangeText={(v) =>
                                        handleChange("sleep_hours", v)
                                    }
                                    keyboardType="numeric"
                                    placeholder="Hours"
                                    blurOnSubmit={false}
                                    returnKeyType="next"
                                    style={{
                                        backgroundColor: "#F9FAFB",
                                        borderWidth: 1,
                                        borderColor: "#D1D5DB",
                                        borderRadius: 12,
                                        padding: 12,
                                    }}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <TextInput
                                    value={form.sleep_minutes}
                                    onChangeText={(v) =>
                                        handleChange("sleep_minutes", v)
                                    }
                                    keyboardType="numeric"
                                    placeholder="Minutes"
                                    blurOnSubmit={false}
                                    returnKeyType="done"
                                    style={{
                                        backgroundColor: "#F9FAFB",
                                        borderWidth: 1,
                                        borderColor: "#D1D5DB",
                                        borderRadius: 12,
                                        padding: 12,
                                    }}
                                />
                            </View>
                        </View>

                        <InputField
                            label="Resting BPM"
                            field="resting_bpm"
                            placeholder="62"
                            form={form}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Average BPM"
                            field="avg_bpm"
                            placeholder="88"
                            form={form}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Maximum BPM"
                            field="max_bpm"
                            placeholder="145"
                            form={form}
                            onChange={handleChange}
                        />

                        <TouchableOpacity
                            disabled={isSubmitting}
                            onPress={handleSubmit}
                            style={{
                                marginTop: 12,
                                backgroundColor: "#2563EB",
                                padding: 16,
                                borderRadius: 14,
                                alignItems: "center",
                            }}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text
                                    style={{
                                        color: "#FFF",
                                        fontWeight: "700",
                                        fontSize: 16,
                                    }}
                                >
                                    Save Today's Metrics
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}