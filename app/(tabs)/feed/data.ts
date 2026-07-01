export interface ApiUser {
    id: string
    first_name: string
    last_name: string
    avatar?: string | null
}

export interface ApiComment {
    id: string
    content: string
    user_id: string
    post_id: string
    created_at: string
    user?: ApiUser
}

export interface ApiPost {
    id: string
    text: string
    image?: string | null
    like_count: number
    created_at: string
    user_id: string
    user?: ApiUser
    comments?: ApiComment[]
}

export interface Post {
    id: string
    author: string
    initials: string
    avatarColor: string
    timeAgo: string
    text: string
    image?: string | null
    likes: number
    commentsCount: number
    liked: boolean
    comments: Comment[]
}

export interface Comment {
    id: string
    author: string
    initials: string
    avatarColor: string
    timeAgo: string
    content: string
}

const COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#3b82f6","#8b5cf6","#ec4899"]

function colorFromId(id: string): string {
    let sum = 0
    for (const c of id) sum += c.charCodeAt(0)
    return COLORS[sum % COLORS.length]
}

function timeAgo(dateStr: string): string {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diff < 60) return "À l'instant"
    if (diff < 3600) return `${Math.floor(diff / 60)}min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}j ago`
}

export function toPost(p: ApiPost, likedIds: Set<string>): Post {
    const name = p.user ? `${p.user.first_name} ${p.user.last_name}` : "Utilisateur"
    const initials = p.user
        ? `${p.user.first_name?.[0] ?? ""}${p.user.last_name?.[0] ?? ""}`.toUpperCase()
        : "?"
    return {
        id: p.id,
        author: name,
        initials,
        avatarColor: colorFromId(p.user_id),
        timeAgo: timeAgo(p.created_at),
        text: p.text,
        image: p.image,
        likes: p.like_count,
        commentsCount: p.comments?.length ?? 0,
        liked: likedIds.has(p.id),
        comments: (p.comments ?? []).map(c => toComment(c)),
    }
}

export function toComment(c: ApiComment): Comment {
    const name = c.user ? `${c.user.first_name} ${c.user.last_name}` : "Utilisateur"
    return {
        id: c.id,
        author: name,
        initials: c.user ? `${c.user.first_name?.[0] ?? ""}${c.user.last_name?.[0] ?? ""}`.toUpperCase() : "?",
        avatarColor: colorFromId(c.user_id),
        timeAgo: timeAgo(c.created_at),
        content: c.content,
    }
}
