import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7B3FF2',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Accueil',
          tabBarLabel: 'Accueil',
        }}
      />
      <Tabs.Screen
        name="exercises/index"
        options={{
          title: 'Exercices',
          tabBarLabel: 'Exercices',
        }}
      />
      <Tabs.Screen
        name="foods/index"
        options={{
          title: 'Aliments',
          tabBarLabel: 'Aliments',
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistiques',
          tabBarLabel: 'Stats',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
        }}
      />
    </Tabs>
  );
}
