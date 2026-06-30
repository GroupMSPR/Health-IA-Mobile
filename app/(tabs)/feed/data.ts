export type PostCategory = "Workout" | "Nutrition" | "Milestone"

export interface Comment {
    id: string
    author: string
    initials: string
    avatarColor: string
    timeAgo: string
    content: string
    likes: number
}

export interface Post {
    id: string
    author: string
    initials: string
    avatarColor: string
    timeAgo: string
    category: PostCategory
    title: string
    content: string
    likes: number
    comments: number
    shares: number
    liked: boolean
    mockComments: Comment[]
}

export const CATEGORY_BADGE: Record<PostCategory, { label: string; bg: string; color: string }> = {
    Workout:   { label: "Workout",   bg: "#dbeafe", color: "#1d4ed8" },
    Nutrition: { label: "Nutrition", bg: "#dcfce7", color: "#15803d" },
    Milestone: { label: "Milestone", bg: "#fef9c3", color: "#a16207" },
}

export const MOCK_POSTS: Post[] = [
    {
        id: "1",
        author: "Audrey Meyer",
        initials: "A",
        avatarColor: "#6366f1",
        timeAgo: "2h ago",
        category: "Workout",
        title: "Just hit a new deadlift PR! 🎉",
        content: "After 6 months of consistent training, I finally pulled 140kg today! Consistency is everything 👊",
        likes: 142,
        comments: 24,
        shares: 8,
        liked: false,
        mockComments: [
            { id: "c1", author: "Margaud Fischer", initials: "M", avatarColor: "#10b981", timeAgo: "1h ago", content: "Incredible work Audrey! That's a massive jump 🔥", likes: 12 },
            { id: "c2", author: "Thomas Reyes", initials: "T", avatarColor: "#ef4444", timeAgo: "45min ago", content: "Beast mode! 💪 Keep it up!", likes: 7 },
            { id: "c3", author: "Sophie Laurent", initials: "S", avatarColor: "#f59e0b", timeAgo: "30min ago", content: "Wow, tu es une inspiration !", likes: 4 },
        ],
    },
    {
        id: "2",
        author: "Marcus Webb",
        initials: "M",
        avatarColor: "#10b981",
        timeAgo: "4h ago",
        category: "Nutrition",
        title: "Meal prep Sunday done right 🥗",
        content: "6 days of high-protein lunches ready — simple and effective.",
        likes: 89,
        comments: 12,
        shares: 5,
        liked: false,
        mockComments: [
            { id: "c1", author: "Audrey Meyer", initials: "A", avatarColor: "#6366f1", timeAgo: "3h ago", content: "Je veux la recette ! 😍", likes: 8 },
            { id: "c2", author: "Sophie Laurent", initials: "S", avatarColor: "#f59e0b", timeAgo: "2h ago", content: "Quelle organisation, bravo !", likes: 3 },
        ],
    },
    {
        id: "3",
        author: "Sophie Laurent",
        initials: "S",
        avatarColor: "#f59e0b",
        timeAgo: "6h ago",
        category: "Milestone",
        title: "30 jours sans sucre raffiné 🏆",
        content: "Un mois de discipline, plus d'énergie, meilleur sommeil. Je continue !",
        likes: 203,
        comments: 41,
        shares: 17,
        liked: true,
        mockComments: [
            { id: "c1", author: "Marcus Webb", initials: "M", avatarColor: "#10b981", timeAgo: "5h ago", content: "Incroyable ! Je vais essayer aussi 🙌", likes: 15 },
        ],
    },
    {
        id: "4",
        author: "Thomas Reyes",
        initials: "T",
        avatarColor: "#ef4444",
        timeAgo: "1j ago",
        category: "Workout",
        title: "5km en 22 minutes ce matin 🏃",
        content: "Nouveau record personnel ! Objectif suivant : 20 minutes avant fin du mois.",
        likes: 67,
        comments: 9,
        shares: 3,
        liked: false,
        mockComments: [
            { id: "c1", author: "Audrey Meyer", initials: "A", avatarColor: "#6366f1", timeAgo: "20h ago", content: "Trop fort ! 🔥", likes: 5 },
        ],
    },
]
