import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { FullHeader } from "./header";

export default function UnderConstructionScreen() {
    const [open, setOpen] = useState(false)
    return (
        <ScrollView
            style={{ flex: 1 }}
            horizontal={false}
            showsVerticalScrollIndicator={false}
        >
            <FullHeader open={open} setOpen={setOpen} />

            <View
                style={{
                    backgroundColor: "#f4f4f4",
                    flexDirection: "column",
                    alignContent: "center",
                    paddingBottom: 20,
                }}
            >
                {/* Welcome */}
                <View style={{ padding: 12 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                        Bonjour
                    </Text>
                    <Text>Cette section est en cours de développement</Text>
                </View>

                {/* Main card */}
                <View
                    style={{
                        margin: 8,
                        padding: 16,
                        backgroundColor: "#fff",
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: "#e5e5e5",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 26,
                            fontWeight: "700",
                            color: "#1F2937",
                            marginBottom: 10,
                            textAlign: "center",
                        }}
                    >
                        🚧 En cours d’implémentation
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            textAlign: "center",
                            color: "#6B7280",
                            lineHeight: 20,
                        }}
                    >
                        Nous travaillons activement sur cette fonctionnalité pour améliorer
                        votre expérience.
                        {"\n\n"}
                        Elle sera disponible très bientôt dans une prochaine mise à jour.
                    </Text>
                </View>
                
                {/* Footer hint */}
                <View style={{ padding: 12, alignItems: "center" }}>
                    <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                        Merci de votre patience 🙌
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}