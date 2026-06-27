import { View, Text, StyleSheet } from 'react-native';

export default function FoodsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Foods (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
});
