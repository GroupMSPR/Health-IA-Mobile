# 📋 Plan de migration Frontend Web → Mobile React Native

Objectif : reproduire fidèlement sur **Expo SDK 56 / React Native 0.85** l'expérience web actuelle (pixel-fidelity, mêmes pages, mêmes styles, même accessibilité).

> ⚠️ **Expo SDK 56** : consulter https://docs.expo.dev/versions/v56.0.0/ avant tout code.

---

## PARTIE 1 — Plan du Frontend Web (état actuel)

### 1.1 Composants partagés (`/src/components`)

| Composant | Rôle |
|-----------|------|
| `ProtectedRoute` | Auth guard basé sur `AuthContext.isAuthenticated`. Redirige vers `/login`. |

> Le reste de l'UI est dupliqué inline dans chaque page (pas de design system extrait).

### 1.2 Inventaire des pages (`/src/pages`) — 21 pages

#### Auth (4)
- `LoginPage` — `/login` — Email + password, POST `/api/login`
- `RegisterPage` — `/register` — Création compte, POST `/api/register`
- `ForgotPasswordPage` — `/forgot-password` — Envoi email reset
- `ResetPasswordPage` — `/reset-password?token=&email=` — Nouveau mot de passe

#### Compte (2 stubs)
- `ProfilePage` — `/profile`
- `SettingsPage` — `/settings`

#### Principal (2)
- `DashboardPage` — `/dashboard` — Cards résumé (poids, calories, exos), graphiques, raccourcis
- `StatisticsPage` — `/statistics` — Graphiques poids/calories/cardio/pas, sélecteurs période

#### Exercices (5)
- `ExercisesMainPage` — `/exercises` — Liste paginée + recherche + filtres + mode multi-sélection
- `ExerciseDetailPage` — `/exercise/:id` — Détails, muscles ciblés, équipement, instructions
- `ExerciseCreatePage` — `/exercise/create` — Formulaire 4 sections
- `ExerciseEditPage` — `/exercise/:id/edit` — Idem create, pré-rempli
- `ExercisesRecommendsIAPage` — `/exercises/recommends-ia` — Top 5 recos IA basées profil

#### Aliments (6)
- `FoodsMainPage` — `/foods` — Liste + recherche + onglets catégories
- `FoodDetailPage` — `/food/:id` — Macros, micros, donut chart
- `FoodCreatePage` — `/food/create` — Formulaire création (URL ou upload base64)
- `FoodEditPage` — `/food/:id/edit` — Édition
- `FoodScanIAPage` — `/food-scan` — Caméra / drag-drop / texte → IA
- `FoodScanIAResultPage` — `/food-scan/result` — Résultat IA + bouton enregistrer

#### Mesures santé (4)
- Pages CRUD `HealthMetrics` (Main / Detail / Create / Edit)

### 1.3 Design system extrait

**Palette**
- Primaire : `#7B3FF2` (violet) — boutons, focus rings, badges actifs
- Secondaire : `#4A6BF0` (bleu) — gradients, accent
- Emerald `#10b981` — poids, succès
- Orange `#f97316` — calories, glucides
- Rose `#f43f5e` — cardio
- Slate scale (`50`→`900`) — texte, bordures, fonds

**Typographie**
- Titres : `text-3xl`/`text-4xl`, `font-extrabold`, `text-slate-900`
- Sous-titres : `text-sm`/`text-base`, `text-slate-500`
- Boutons : `font-bold`, `text-base`/`text-sm`

**Espacement & containers**
- Layouts : `max-w-7xl` (listes), `max-w-4xl` (formulaires/détails), `max-w-md` (auth)
- Padding pages : `p-4 sm:p-6 md:p-8`
- Espacement vertical : `space-y-6` à `space-y-8`

**Patterns réutilisables**
- **Card** : `bg-white rounded-3xl border border-slate-100 shadow-sm`
- **Badge** : `rounded-full px-3 py-1 text-xs font-bold` (couleur selon type)
- **Input** : `border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#7B3FF2]`
- **Primary button** : `bg-[#7B3FF2] text-white rounded-xl px-4 py-3 font-bold`
- **Metric card** : Icon coloré + nombre `text-2xl font-extrabold` + label `text-sm`
- **Skeleton** : `bg-slate-200 animate-pulse rounded-xl`
- **Empty state** : `border-2 border-dashed border-slate-200` + icône + texte
- **Error state** : `bg-red-50 border border-red-100` + AlertTriangle

**Librairies utilisées**
- `lucide-react` — icônes (700+)
- `chart.js` + `react-chartjs-2` — line, bar, donut
- `sonner` — toasts
- `axios` — HTTP (CSRF via cookie)
- `react-router-dom` — routing

### 1.4 API patterns (Lomkit REST)
- `POST /api/<resource>/search` — `{ search: { filters, sorts, include, limit, page } }`
- `POST /api/<resource>/mutate` — `{ create | update | sync_<relation> }`
- `DELETE /api/<resource>` — `{ resource: [ids] }`
- `GET /api/<resource>/count`

---

## PARTIE 2 — Plan de portage Mobile React Native

### 2.1 Stack cible

| Web | Mobile (Expo 56) |
|-----|------------------|
| React Router DOM | **Expo Router 56** (file-based, déjà en place) |
| Tailwind CSS | **StyleSheet** + thème centralisé (ou `nativewind` v5 si compatible SDK 56) |
| Chart.js | **`victory-native` v40+** ou **`react-native-gifted-charts`** |
| Lucide React | **`lucide-react-native`** |
| Sonner | **`sonner-native`** ou **`burnt`** |
| `<input type="file">` | **`expo-image-picker`** |
| Camera HTML | **`expo-camera`** |
| `localStorage` | **`expo-secure-store`** (déjà en place) |
| `react-chartjs-2` Donut | Composant SVG via `react-native-svg` |
| Axios | **Axios** (identique) |
| TanStack Query | **TanStack Query v5** (déjà en place) |

### 2.2 Architecture des routes (Expo Router)

```
app/
├── _layout.tsx                  # Root : QueryClientProvider + AuthGate + Stack
├── (auth)/
│   ├── _layout.tsx              # Stack sans headers
│   ├── login.tsx                # ✅ existe — à styliser
│   ├── register.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx       # params: token, email
├── (tabs)/
│   ├── _layout.tsx              # Tabs bottom : Dashboard / Exercises / Foods / Stats / Profile
│   ├── dashboard.tsx            # = DashboardPage
│   ├── statistics.tsx           # = StatisticsPage
│   ├── exercises/
│   │   ├── index.tsx            # ExercisesMainPage
│   │   ├── recommends-ia.tsx
│   │   ├── create.tsx
│   │   ├── [id].tsx             # ExerciseDetailPage
│   │   └── [id]/edit.tsx
│   ├── foods/
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   ├── [id].tsx
│   │   ├── [id]/edit.tsx
│   │   ├── scan.tsx             # FoodScanIAPage
│   │   └── scan-result.tsx      # via params
│   ├── health-metrics/
│   │   └── ... (CRUD)
│   └── profile.tsx              # + accès Settings
└── +not-found.tsx
```

> Les onglets (`(tabs)`) sont protégés par l'auth gate dans `_layout.tsx` root (redirect vers `(auth)/login` si pas de token SecureStore).

### 2.3 Design system à créer dans `Mobile/theme/`

**`theme/colors.ts`**
```ts
export const colors = {
  primary: '#7B3FF2',
  secondary: '#4A6BF0',
  emerald: '#10b981',
  orange: '#f97316',
  rose: '#f43f5e',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
    300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b',
    600: '#475569', 700: '#334155', 900: '#0f172a',
  },
} as const;
```

**`theme/spacing.ts`** — échelle multiple de 4
**`theme/typography.ts`** — tailles : 12, 14, 16, 18, 20, 24, 28, 32 ; weights 400/600/700/800
**`theme/radii.ts`** — sm:8, md:12, lg:16, xl:20, 2xl:24, 3xl:32, full:9999

### 2.4 Composants UI à créer dans `Mobile/components/ui/`

| Composant | Équivalent web | Notes |
|-----------|----------------|-------|
| `Screen` | `<main className="max-w-7xl p-6">` | `SafeAreaView` + `ScrollView` + padding |
| `Card` | `bg-white rounded-3xl border` | View stylé + ombre `elevation`/`shadowColor` |
| `Badge` | `<span className="rounded-full">` | Variantes : `primary`, `success`, `warning`, `danger`, `slate` |
| `PrimaryButton` | Bouton violet | `Pressable` + `accessibilityRole="button"` + état loading |
| `SecondaryButton` | Bouton outline | Idem, bordure slate |
| `Input` | `<input>` stylé | `TextInput` + label + erreur + focus ring |
| `Textarea` | `<textarea>` | `TextInput multiline` |
| `Select` | `<select>` | `@react-native-picker/picker` ou bottom-sheet maison |
| `Checkbox` | `<input type="checkbox">` | `Pressable` + icône check |
| `MetricCard` | Card metric tableau bord | Icon coloré + valeur + label |
| `SkeletonBlock` | `animate-pulse` | `Animated.View` opacity loop |
| `EmptyState` | Dashed border | View + icône + texte |
| `ErrorBanner` | `bg-red-50` | AlertTriangle + message |
| `SectionHeader` | Titre + sous-titre | Pour sections formulaires |
| `Avatar` | Image ronde profil | `Image` + fallback initiales |
| `IconBox` | Petit carré coloré avec icône | Header de chaque page |
| `Tabs` | Onglets catégories | Horizontal scrollable, indicateur actif |
| `ProgressBar` | Barre macro | View + View animée |
| `DonutChart` | Macros donut | `react-native-svg` Pie + légende |
| `LineChart` | Chart.js line | `victory-native` `VictoryLine` |
| `BarChart` | Chart.js bar | `victory-native` `VictoryBar` |
| `Toast` | Sonner | `sonner-native` provider dans root |

### 2.5 Mapping page-par-page

#### Auth (4 écrans)
- **Login** (existe déjà — à restyler) : KeyboardAvoidingView, logo centré, inputs `Input`, bouton `PrimaryButton`, lien vers register
- **Register** : Form 3 champs (nom, email, password), validation
- **ForgotPassword** : Input email + bouton submit + état succès
- **ResetPassword** : Lit `useLocalSearchParams` → token/email, 2 champs password

#### Dashboard
- `ScrollView` vertical
- `IconBox` + titre `Bienvenue, {user.name}`
- Grid 2×2 de `MetricCard` (poids, calories, exos, IMC)
- `Card` avec `LineChart` (poids 30j)
- `Card` avec `BarChart` (calories 7j)
- Liste raccourcis (Pressable cards) vers `/exercises`, `/foods`, `/food-scan`

#### Statistics
- Tabs/Pills sélecteur période (7j / 30j / 90j)
- 4 `Card` avec graphiques :
  - Poids → `LineChart` emerald
  - Calories → `BarChart` orange
  - Cardio → `LineChart` rose
  - Pas → `BarChart` violet
- Pagination état loading via `SkeletonBlock`

#### ExercisesMainPage
- Header sticky : titre + boutons (Add / mode sélection)
- `Input` recherche debounced 500ms (`use-debounce`)
- Tabs catégories scrollable horizontal
- `FlatList` 2 colonnes (`numColumns={2}`)
- Card item : image + nom + badges difficulté/cat + métriques + checkbox sélection
- Pagination : footer `FlatList` + `onEndReached`
- Mode sélection : long-press OU bouton header → checkboxes visibles, bouton delete sticky bas

#### ExerciseDetailPage
- `ScrollView`
- Image header `h-64`
- Section "Muscles ciblés" : grid 2 cols
- Section "Équipement" : liste avec icônes
- Section "Instructions" : texte numéroté
- Footer fixe : boutons Edit / Delete

#### ExerciseCreate / Edit
- `ScrollView` + `KeyboardAvoidingView`
- 4 sections : Infos / Anatomie / Métriques / Descriptions
- Chaque section : `SectionHeader` + `Card` containing fields
- `Select` pour catégorie/difficulté/muscle (`@react-native-picker/picker` ou bottom sheet)
- Multi-sélect équipement : grid `Checkbox`
- Bouton submit sticky bas (footer absolute)

#### ExercisesRecommendsIA
- Header avec icône `Sparkles` (animation pulse via `Animated`)
- `FlatList` verticale, items pleine largeur
- Item : Image gauche (40%), contenu droite (badges + titre + métriques + CTA)
- Badge "Meilleur Choix" sur premier item
- Empty state si pas de prédictions

#### FoodsMainPage
- Structure identique à ExercisesMainPage avec 2 colonnes
- Tabs catégories : Viandes & Poissons, Légumes, Fruits, Laitiers, Céréales, Snacks
- Card item : image + nom + 4 mini-métriques (calories/protéines/glucides/lipides)

#### FoodDetailPage
- Mobile = layout 1 colonne (pas de sidebar sticky)
- Image banner haut
- Section "Analyse Nutritionnelle" : 3 `ProgressBar` (protéines/glucides/lipides)
- Section "Micronutriments" : grid 2 cols
- `Card` calories en haut (équivalent sidebar)
- `DonutChart` macros
- Boutons Edit / Delete en bas

#### FoodCreate / Edit
- 3 sections : Infos / Macros / Micros
- Image : `expo-image-picker` (camera ou galerie) → base64 OU URL
- Champs numériques avec `keyboardType="numeric"`

#### FoodScanIA
- 3 onglets : Caméra / Galerie / Texte
- Caméra : `<CameraView>` (expo-camera 16) + bouton capture rond bas centre
- Galerie : `expo-image-picker` `launchImageLibraryAsync`
- Texte : `Textarea` description
- Preview image + bouton "Analyser"
- Progress bar animée pendant analyse → navigate `/foods/scan-result` avec params

#### FoodScanIAResult
- Layout = FoodDetailPage avec données IA
- Badge confiance (pulse animation)
- Warning sodium > 500mg
- Bouton sticky bas droit "Enregistrer" → POST mutate → redirect `/foods`

#### HealthMetrics CRUD
- Pattern identique aux Exercises/Foods : liste, détail, create, edit

### 2.6 Accessibilité — mapping web → RN

| Web | React Native |
|-----|--------------|
| `aria-label` | `accessibilityLabel` |
| `role="button"` | `accessibilityRole="button"` |
| `aria-invalid="true"` | `accessibilityState={{ invalid: true }}` |
| `aria-busy="true"` | `accessibilityState={{ busy: true }}` |
| `aria-selected` | `accessibilityState={{ selected: true }}` |
| `aria-describedby` | `accessibilityHint` ou `accessibilityLabelledBy` |
| `aria-required` | `accessibilityRequired` (Android) + label "obligatoire" |
| `aria-live` | `accessibilityLiveRegion="polite"` |
| Focus ring | `Pressable` + état `pressed`/`focused` style |
| `alt` | `accessibilityLabel` sur `Image` |
| Heading hierarchy | `accessibilityRole="header"` |

**Règles transverses :**
- Tous les `Pressable` ont `accessibilityRole` + `accessibilityLabel`
- `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}` sur icônes
- Contraste WCAG AA (déjà respecté côté palette)
- `KeyboardAvoidingView` sur tous les formulaires
- Support VoiceOver (iOS) / TalkBack (Android) testé

### 2.7 État, données, navigation

- **Auth** : `expo-secure-store` pour `auth_token`, lu dans `_layout.tsx` root, redirect groupe `(auth)` ou `(tabs)`
- **TanStack Query** : `QueryClient` provider root ; clés `['exercises', filters]`, `['foods', filters]`, etc. Mutations avec `invalidateQueries`
- **Toasts** : Provider `sonner-native` ou `burnt` au niveau root
- **Recherche** : debounce 500ms via `useDebounce` (créer hook maison)
- **Pagination** : `useInfiniteQuery` + `FlatList onEndReached`
- **Forms** : `react-hook-form` recommandé pour validation cohérente

### 2.8 Roadmap par phases

**Phase 0 — Fondations (1-2j)**
1. Lire docs Expo 56 (versions/v56.0.0)
2. Installer libs : `lucide-react-native`, `victory-native`, `react-native-svg`, `expo-image-picker`, `expo-camera`, `@react-native-picker/picker`, `react-hook-form`, `sonner-native`, `use-debounce`
3. Créer `theme/` (colors, spacing, typography, radii)
4. Créer composants UI primitifs (`Card`, `Badge`, `Input`, `PrimaryButton`, `SecondaryButton`, `Screen`, `SectionHeader`, `IconBox`)

**Phase 1 — Auth + Navigation (1-2j)**
1. Restyler `(auth)/login.tsx` avec design system
2. Créer `register`, `forgot-password`, `reset-password`
3. Auth gate dans `_layout.tsx` root
4. `(tabs)/_layout.tsx` avec 5 tabs

**Phase 2 — Dashboard + Statistics (2-3j)**
1. `MetricCard`, `LineChart`, `BarChart`, `SkeletonBlock`
2. Dashboard avec données réelles
3. Statistics avec sélecteur période

**Phase 3 — Exercices CRUD (3-4j)**
1. `Tabs`, `Checkbox`, `Select` (bottom-sheet)
2. ExercisesMain (liste + filtre + recherche + sélection)
3. ExerciseDetail
4. ExerciseCreate / ExerciseEdit (formulaire 4 sections)
5. RecommendsIA

**Phase 4 — Aliments CRUD + IA (3-4j)**
1. `ProgressBar`, `DonutChart`
2. FoodsMain, FoodDetail, FoodCreate, FoodEdit
3. FoodScanIA (caméra + galerie + texte)
4. FoodScanIAResult

**Phase 5 — Health Metrics CRUD (1-2j)**
1. Pages CRUD mesures (pattern identique)

**Phase 6 — Polish (2-3j)**
1. Profile / Settings écrans
2. Animations (Reanimated)
3. Tests accessibilité TalkBack / VoiceOver
4. Tests iOS + Android (Expo Go + builds dev)
5. Perf : `FlatList` `getItemLayout`, memoization

### 2.9 Points de vigilance Expo SDK 56

- API caméra : `CameraView` de `expo-camera` 16 (pas `Camera` legacy)
- `expo-router` 56 : nouveau pattern de typed routes
- React Native 0.85 : New Architecture activée par défaut → vérifier libs natives compatibles (`victory-native` v40+ OK)
- React 19 : pas de `forwardRef` obligatoire (ref as prop)
- `expo-image` recommandé sur `Image` standard pour caching

---

## Annexes

### Variables d'environnement (déjà en place)
```
EXPO_PUBLIC_BASE_URL=http://192.168.x.x:80
```
Lu via `process.env.EXPO_PUBLIC_BASE_URL` dans `lib/api.ts`.

### Conventions code
- Composants : PascalCase, 1 par fichier
- Hooks : `use*` dans `hooks/`
- Types : co-localisés ou dans `types/`
- API : tout dans `lib/api/<resource>.ts` retournant typed clients

### Tests
- `jest-expo` pour unit tests
- `Detox` ou `Maestro` pour E2E (optionnel)
- Manual : iOS simulator + Android emulator + 1 device physique chaque
