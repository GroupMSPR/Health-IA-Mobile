import { useState, useEffect, useCallback } from "react"
import {
    Text, ScrollView, TextInput, Pressable,
    StyleSheet, StatusBar, View, ActivityIndicator, RefreshControl
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { useAuth } from "../../../context/authContext"
import api from "../../../lib/api"
import { type Post, type ApiPost, toPost } from "./data"

type FilterTab = "Tous" | "Mes posts"
const TABS: FilterTab[] = ["Tous", "Mes posts"]

export default function Feed() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<FilterTab>("Tous")
    const [search, setSearch] = useState("")
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

    const fetchPosts = useCallback(async () => {
        try {
            const filters: any[] = []
            if (activeTab === "Mes posts" && user) {
                filters.push({ field: "user_id", operator: "=", value: user.id })
            }

            const res = await api.post("/api/posts/search", {
                search: {
                    filters,
                    includes: [
                        { relation: "user" },
                        { relation: "comments", filters: [], includes: [{ relation: "user" }] },
                        { relation: "likers" },
                    ],
                    sorts: [{ field: "created_at", direction: "desc" }],
                },
            })

            const raw: ApiPost[] = res.data?.data ?? res.data ?? []
            const liked = new Set<string>(
                raw.filter((p: any) =>
                    p.likers?.some((l: any) => l.id === user?.id)
                ).map((p: any) => p.id)
            )
            setLikedIds(liked)
            setPosts(raw.map(p => toPost(p, liked)))
        } catch (e) {
            console.error("Erreur chargement posts", e)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [activeTab, user])

    useEffect(() => {
        setLoading(true)
        fetchPosts()
    }, [fetchPosts])

    const onRefresh = () => {
        setRefreshing(true)
        fetchPosts()
    }

    const toggleLike = async (postId: string) => {
        try {
            await api.post("/api/like", { post_id: postId })
            setPosts(prev => prev.map(p =>
                p.id === postId
                    ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                    : p
            ))
        } catch (e) {
            console.error("Erreur like", e)
        }
    }

    const filtered = posts.filter(p =>
        search === "" ||
        p.text.toLowerCase().includes(search.toLowerCase()) ||
        p.author.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Feed</Text>
                        <Text style={styles.headerSub}>{posts.length} posts</Text>
                    </View>
                </View>

                {/* Bannière */}
                <View style={styles.shareBanner}>
                    <View style={styles.shareBannerIcon}>
                        <Text style={{ color: "#fff", fontSize: 18 }}>+</Text>
                    </View>
                    <View>
                        <Text style={styles.shareBannerTitle}>Share your progress</Text>
                        <Text style={styles.shareBannerSub}>Inspire the community</Text>
                    </View>
                </View>

                {/* Recherche */}
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher un post..."
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filtres */}
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

                {/* Liste */}
                <View style={styles.postsList}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 40 }} />
                    ) : filtered.length === 0 ? (
                        <Text style={styles.empty}>Aucun post trouvé</Text>
                    ) : (
                        filtered.map(post => (
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
                                </View>

                                <Text style={styles.postContent}>{post.text}</Text>

                                <View style={styles.postActions}>
                                    <Pressable
                                        style={styles.actionBtn}
                                        onPress={(e) => { e.stopPropagation?.(); toggleLike(post.id) }}
                                    >
                                        <Text style={styles.actionIcon}>{post.liked ? "❤️" : "🤍"}</Text>
                                        <Text style={[styles.actionCount, post.liked && { color: "#ef4444" }]}>
                                            {post.likes}
                                        </Text>
                                    </Pressable>
                                    <Pressable style={styles.actionBtn}>
                                        <Text style={styles.actionIcon}>💬</Text>
                                        <Text style={styles.actionCount}>{post.commentsCount}</Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        ))
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
    shareBanner: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#4f46e5",
        marginHorizontal: 16, marginTop: 16, borderRadius: 14, padding: 16, gap: 12,
    },
    shareBannerIcon: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.25)", justifyContent: "center", alignItems: "center",
    },
    shareBannerTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
    shareBannerSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
    searchRow: { paddingHorizontal: 16, paddingTop: 14 },
    searchInput: {
        backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 14,
        paddingVertical: 10, fontSize: 14, color: "#111827", borderWidth: 1, borderColor: "#e5e7eb",
    },
    tabsRow: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 12, gap: 8 },
    tab: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb",
    },
    tabActive: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
    tabText: { fontSize: 13, fontWeight: "500", color: "#374151" },
    tabTextActive: { color: "#fff" },
    postsList: { paddingHorizontal: 16, paddingTop: 16 },
    postCard: {
        backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
    avatarText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    postMeta: { flex: 1 },
    postAuthor: { fontSize: 14, fontWeight: "600", color: "#111827" },
    postTime: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
    postContent: { fontSize: 13, color: "#6b7280", lineHeight: 19, marginBottom: 14 },
    postActions: {
        flexDirection: "row", borderTopWidth: 1, borderTopColor: "#f3f4f6",
        paddingTop: 12, gap: 20,
    },
    actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
    actionIcon: { fontSize: 16 },
    actionCount: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
    empty: { textAlign: "center", color: "#9ca3af", marginTop: 40, fontSize: 14 },
})
