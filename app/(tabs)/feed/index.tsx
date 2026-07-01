import { useState } from "react"
import {
    Text, ScrollView, TextInput, Pressable,
    StyleSheet, StatusBar, View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { useAuth } from "../../../context/authContext"
import { MOCK_POSTS, CATEGORY_BADGE, type Post } from "./data"
import { FullHeader } from "../../../assets/componants/header"

type FilterTab = "All" | "Workouts" | "Nutrition" | "Milestones"
const TABS: FilterTab[] = ["All", "Workouts", "Nutrition", "Milestones"]

export default function Feed() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<FilterTab>("All")
    const [search, setSearch] = useState("")
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)
    const [open, setOpen] = useState(false)

    const memberCount = 247

    const toggleLike = (id: string, e: any) => {
        e.stopPropagation?.()
        setPosts(prev => prev.map(p =>
            p.id === id
                ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                : p
        ))
    }

    const filtered = posts.filter(p => {
        const matchTab =
            activeTab === "All" ||
            (activeTab === "Workouts"   && p.category === "Workout") ||
            (activeTab === "Nutrition"  && p.category === "Nutrition") ||
            (activeTab === "Milestones" && p.category === "Milestone")
        const matchSearch =
            search === "" ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase()) ||
            p.author.toLowerCase().includes(search.toLowerCase())
        return matchTab && matchSearch
    })

    return (
        <SafeAreaView style={styles.safe}>
            <FullHeader open={open} setOpen={setOpen} />
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Feed</Text>
                        <Text style={styles.headerSub}>{memberCount} members</Text>
                    </View>
                    <Pressable style={styles.addBtn}>
                        <Text style={styles.addBtnText}>+</Text>
                    </Pressable>
                </View>

                {/* Share banner */}
                <Pressable style={styles.shareBanner}>
                    <View style={styles.shareBannerIcon}>
                        <Text style={{ color: "#fff", fontSize: 18 }}>+</Text>
                    </View>
                    <View>
                        <Text style={styles.shareBannerTitle}>Share your progress</Text>
                        <Text style={styles.shareBannerSub}>Inspire the community</Text>
                    </View>
                </Pressable>

                {/* Search */}
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search posts..."
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filter tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
                    <View style={styles.tabsRow}>
                        {TABS.map(tab => (
                            <Pressable
                                key={tab}
                                style={[styles.tab, activeTab === tab && styles.tabActive]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                                    {tab}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>

                {/* Posts */}
                <View style={styles.postsList}>
                    {filtered.length === 0 ? (
                        <Text style={styles.empty}>Aucun post trouvé</Text>
                    ) : (
                        filtered.map(post => {
                            const badge = CATEGORY_BADGE[post.category]
                            return (
                                <Pressable
                                    key={post.id}
                                    style={styles.postCard}
                                    onPress={() => router.push(`/(tabs)/feed/${post.id}`)}
                                >
                                    <View style={styles.postHeader}>
                                        <View style={[styles.avatar, { backgroundColor: post.avatarColor }]}>
                                            <Text style={styles.avatarText}>{post.initials}</Text>
                                        </View>
                                        <View style={styles.postMeta}>
                                            <Text style={styles.postAuthor}>{post.author}</Text>
                                            <Text style={styles.postTime}>{post.timeAgo}</Text>
                                        </View>
                                        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                                            <Text style={[styles.badgeText, { color: badge.color }]}>
                                                {badge.label}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.postTitle}>{post.title}</Text>
                                    <Text style={styles.postContent}>{post.content}</Text>

                                    <View style={styles.postActions}>
                                        <Pressable
                                            style={styles.actionBtn}
                                            onPress={(e) => toggleLike(post.id, e)}
                                        >
                                            <Text style={styles.actionIcon}>{post.liked ? "❤️" : "🤍"}</Text>
                                            <Text style={[styles.actionCount, post.liked && { color: "#ef4444" }]}>
                                                {post.likes}
                                            </Text>
                                        </Pressable>
                                        <Pressable style={styles.actionBtn}>
                                            <Text style={styles.actionIcon}>💬</Text>
                                            <Text style={styles.actionCount}>{post.comments}</Text>
                                        </Pressable>
                                        <Pressable style={styles.actionBtn}>
                                            <Text style={styles.actionIcon}>📤</Text>
                                            <Text style={styles.actionCount}>{post.shares}</Text>
                                        </Pressable>
                                    </View>
                                </Pressable>
                            )
                        })
                    )}
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f3f4f6" },
    scroll: { flex: 1 },
    header: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12, backgroundColor: "#fff",
    },
    headerTitle: { fontSize: 26, fontWeight: "700", color: "#111827" },
    headerSub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
    addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#4f46e5", justifyContent: "center", alignItems: "center" },
    addBtnText: { color: "#fff", fontSize: 24, lineHeight: 28 },
    shareBanner: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#4f46e5",
        marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 16, gap: 12,
    },
    shareBannerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.25)", justifyContent: "center", alignItems: "center" },
    shareBannerTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
    shareBannerSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
    searchRow: { paddingHorizontal: 16, paddingTop: 14 },
    searchInput: {
        backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 14,
        paddingVertical: 10, fontSize: 14, color: "#111827", borderWidth: 1, borderColor: "#e5e7eb",
    },
    tabsScroll: { marginTop: 12 },
    tabsRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8 },
    tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb" },
    tabActive: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
    tabText: { fontSize: 13, fontWeight: "500", color: "#374151" },
    tabTextActive: { color: "#fff" },
    postsList: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
    postCard: {
        backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
    avatarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    postMeta: { flex: 1 },
    postAuthor: { fontSize: 14, fontWeight: "600", color: "#111827" },
    postTime: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 11, fontWeight: "600" },
    postTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 6 },
    postContent: { fontSize: 13, color: "#6b7280", lineHeight: 19, marginBottom: 14 },
    postActions: { flexDirection: "row", borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 12, gap: 20 },
    actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
    actionIcon: { fontSize: 16 },
    actionCount: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
    empty: { textAlign: "center", color: "#9ca3af", marginTop: 40, fontSize: 14 },
})
