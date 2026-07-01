import { useState, useEffect } from "react"
import {
    Text, ScrollView, TextInput, Pressable,
    StyleSheet, View, StatusBar, ActivityIndicator
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, router } from "expo-router"
import { useAuth } from "../../../context/authContext"
import api from "../../../lib/api"
import { type Post, type Comment, type ApiPost, type ApiComment, toPost, toComment } from "./data"

export default function PostDetail() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { user } = useAuth()

    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [commentText, setCommentText] = useState("")
    const [posting, setPosting] = useState(false)

    useEffect(() => {
        fetchPost()
    }, [id])

    const fetchPost = async () => {
        try {
            const res = await api.post("/api/posts/search", {
                search: {
                    filters: [{ field: "id", operator: "=", value: id }],
                    includes: [
                        { relation: "user" },
                        { relation: "comments", includes: [{ relation: "user" }] },
                        { relation: "likers" },
                    ],
                },
            })
            const raw: ApiPost[] = res.data?.data ?? res.data ?? []
            if (raw.length === 0) return

            const likedIds = new Set<string>(
                raw.filter((p: any) => p.likers?.some((l: any) => l.id === user?.id)).map((p: any) => p.id)
            )
            const p = toPost(raw[0], likedIds)
            setPost(p)
            setComments(raw[0].comments?.map((c: ApiComment) => toComment(c)) ?? [])
        } catch (e) {
            console.error("Erreur chargement post", e)
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async () => {
        if (!post) return
        try {
            await api.post("/api/like", { post_id: post.id })
            setPost(prev => prev ? {
                ...prev,
                liked: !prev.liked,
                likes: prev.liked ? prev.likes - 1 : prev.likes + 1
            } : prev)
        } catch (e) {
            console.error("Erreur like", e)
        }
    }

    const handlePostComment = async () => {
        if (!commentText.trim() || !post) return
        setPosting(true)
        try {
            const res = await api.post("/api/comments", {
                post_id: post.id,
                content: commentText.trim(),
            })
            const newComment: Comment = {
                id: res.data?.id ?? Date.now().toString(),
                author: user ? `${user.first_name} ${user.last_name}` : "Moi",
                initials: user ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() : "?",
                avatarColor: "#4f46e5",
                timeAgo: "À l'instant",
                content: commentText.trim(),
            }
            setComments(prev => [newComment, ...prev])
            setCommentText("")
        } catch (e) {
            console.error("Erreur commentaire", e)
        } finally {
            setPosting(false)
        }
    }

    const userInitials = user
        ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
        : "?"

    if (loading) {
        return (
            <SafeAreaView style={styles.safe}>
                <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 60 }} />
            </SafeAreaView>
        )
    }

    if (!post) {
        return (
            <SafeAreaView style={styles.safe}>
                <Text style={styles.notFound}>Post introuvable</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />

            {/* Top bar */}
            <View style={styles.topBar}>
                <Pressable style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backArrow}>←</Text>
                </Pressable>
                <Text style={styles.topBarTitle}>Post Detail</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>

                    {/* Auteur */}
                    <View style={styles.postHeader}>
                        <View style={[styles.avatar, { backgroundColor: post.avatarColor }]}>
                            <Text style={styles.avatarText}>{post.initials}</Text>
                        </View>
                        <View style={styles.postMeta}>
                            <Text style={styles.postAuthor}>{post.author}</Text>
                            <Text style={styles.postTime}>{post.timeAgo}</Text>
                        </View>
                    </View>

                    {/* Contenu */}
                    <Text style={styles.postContent}>{post.text}</Text>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{post.likes}</Text>
                            <Text style={styles.statLabel}>Likes</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{comments.length}</Text>
                            <Text style={styles.statLabel}>Comments</Text>
                        </View>
                    </View>

                    {/* Boutons */}
                    <View style={styles.actionRow}>
                        <Pressable
                            style={[styles.actionBtn, post.liked && styles.actionBtnLiked]}
                            onPress={handleLike}
                        >
                            <Text style={styles.actionIcon}>{post.liked ? "❤️" : "🤍"}</Text>
                            <Text style={[styles.actionLabel, post.liked && { color: "#ef4444" }]}>Like</Text>
                        </Pressable>
                        <Pressable style={styles.actionBtn}>
                            <Text style={styles.actionIcon}>💬</Text>
                            <Text style={styles.actionLabel}>Comment</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Commentaires */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

                    <View style={styles.commentInputRow}>
                        <View style={[styles.avatarSmall, { backgroundColor: "#4f46e5" }]}>
                            <Text style={styles.avatarSmallText}>{userInitials}</Text>
                        </View>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Write a comment..."
                            placeholderTextColor="#9ca3af"
                            value={commentText}
                            onChangeText={setCommentText}
                            returnKeyType="send"
                            onSubmitEditing={handlePostComment}
                        />
                        <Pressable
                            style={[styles.postBtn, posting && { opacity: 0.6 }]}
                            onPress={handlePostComment}
                            disabled={posting}
                        >
                            <Text style={styles.postBtnText}>Post</Text>
                        </Pressable>
                    </View>

                    {comments.map(comment => (
                        <View key={comment.id} style={styles.commentItem}>
                            <View style={[styles.avatarSmall, { backgroundColor: comment.avatarColor }]}>
                                <Text style={styles.avatarSmallText}>{comment.initials}</Text>
                            </View>
                            <View style={styles.commentBody}>
                                <View style={styles.commentMeta}>
                                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                                    <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                                </View>
                                <Text style={styles.commentContent}>{comment.content}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#f3f4f6" },
    scroll: { flex: 1 },
    topBar: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: "#e5e7eb",
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center",
    },
    backArrow: { fontSize: 18, color: "#374151" },
    topBarTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
    notFound: { textAlign: "center", marginTop: 60, color: "#9ca3af", fontSize: 15 },
    card: {
        backgroundColor: "#fff", margin: 16, borderRadius: 16, padding: 16,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 }, elevation: 2,
    },
    postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
    avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
    avatarText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    postMeta: { flex: 1 },
    postAuthor: { fontSize: 15, fontWeight: "600", color: "#111827" },
    postTime: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
    postContent: { fontSize: 14, color: "#374151", lineHeight: 21, marginBottom: 20 },
    statsRow: {
        flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1,
        borderColor: "#f3f4f6", paddingVertical: 14, marginBottom: 12,
    },
    statItem: { flex: 1, alignItems: "center" },
    statValue: { fontSize: 18, fontWeight: "700", color: "#111827" },
    statLabel: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
    statDivider: { width: 1, backgroundColor: "#e5e7eb" },
    actionRow: { flexDirection: "row", gap: 8 },
    actionBtn: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
        paddingVertical: 10, borderRadius: 10, borderWidth: 1,
        borderColor: "#e5e7eb", backgroundColor: "#f9fafb", gap: 6,
    },
    actionBtnLiked: { borderColor: "#fca5a5", backgroundColor: "#fff1f2" },
    actionIcon: { fontSize: 16 },
    actionLabel: { fontSize: 13, fontWeight: "600", color: "#374151" },
    commentsSection: { paddingHorizontal: 16 },
    commentsTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 14 },
    commentInputRow: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
        borderRadius: 12, padding: 8, gap: 8, marginBottom: 16,
        borderWidth: 1, borderColor: "#e5e7eb",
    },
    avatarSmall: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
    avatarSmallText: { color: "#fff", fontWeight: "700", fontSize: 12 },
    commentInput: { flex: 1, fontSize: 14, color: "#111827", paddingVertical: 4 },
    postBtn: { backgroundColor: "#4f46e5", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
    postBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
    commentItem: { flexDirection: "row", gap: 10, marginBottom: 16 },
    commentBody: { flex: 1 },
    commentMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
    commentAuthor: { fontSize: 13, fontWeight: "600", color: "#111827" },
    commentTime: { fontSize: 11, color: "#9ca3af" },
    commentContent: { fontSize: 13, color: "#374151", lineHeight: 19 },
})
