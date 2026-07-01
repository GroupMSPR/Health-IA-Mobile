import { Slot } from "expo-router"
import { AuthProvider } from "../../../context/authContext"

export default function FeedLayout() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    )
}
