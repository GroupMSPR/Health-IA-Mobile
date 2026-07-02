import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import api from '../../lib/api';

const colors = { primary: '#7B3FF2', secondary: '#4A6BF0', blue50: '#eff6ff', slate50: '#f8fafc', slate100: '#f1f5f9', slate200: '#e2e8f0', slate600: '#475569', slate700: '#334155', slate900: '#0f172a', red50: '#fef2f2', red600: '#dc2626', white: '#ffffff' };

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', password: '', password_confirmation: '', birthdate: '', gender: 'Femme', weight: '', height: '', body_fat_pct: '', physical_activity_level: 'active', daily_caloric_intake: '2000', favorite_exercise_category: 'Cardio' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: [] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setGlobalError('');
    setErrors({});
    try {
      const response = await api.post('/api/register', { first_name: formData.first_name, last_name: formData.last_name, email: formData.email, password: formData.password, password_confirmation: formData.password_confirmation, birthdate: formData.birthdate, gender: formData.gender, weight: parseFloat(formData.weight), height: parseInt(formData.height), body_fat_pct: parseFloat(formData.body_fat_pct), physical_activity_level: formData.physical_activity_level, daily_caloric_intake: parseInt(formData.daily_caloric_intake), favorite_exercise_category: formData.favorite_exercise_category });
      if (response.status >= 200 && response.status < 300) {
        router.replace('/(auth)/login');
      }
    } catch (err: any) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
      else if (!err.response) setGlobalError('Impossible de joindre le serveur. Vérifiez votre connexion internet.');
      else setGlobalError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.gradientSection}>
        <View style={styles.headerContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <Text style={styles.logoText}>Health AI Coach</Text>
        </View>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Create an account</Text>
          <Text style={styles.heroSubtitle}>Your personalised health profil </Text>
        </View>
      </View>
      <View style={styles.formCard}>
        {globalError &&
          <View style={styles.errorAlert} accessible={true} accessibilityRole="alert" accessibilityLiveRegion="assertive">
            <Text style={styles.errorText}>{globalError}</Text>
          </View>}
        <Text style={styles.sectionTitle}>Identity and Connection</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput style={[styles.input, errors.first_name && styles.inputError]} placeholder="Jean" placeholderTextColor={colors.slate600} value={formData.first_name} onChangeText={(val) => handleChange('first_name', val)} editable={!loading} />
          {errors.first_name &&
            <Text style={styles.fieldError}>{errors.first_name[0]}</Text>}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Family Name</Text>
          <TextInput style={[styles.input, errors.last_name && styles.inputError]} placeholder="Dupont" placeholderTextColor={colors.slate600} value={formData.last_name} onChangeText={(val) => handleChange('last_name', val)} editable={!loading} />
          {errors.last_name &&
            <Text style={styles.fieldError}>{errors.last_name[0]}</Text>}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={[styles.input, errors.email && styles.inputError]} placeholder="alex@example.com" placeholderTextColor={colors.slate600} value={formData.email} onChangeText={(val) => handleChange('email', val)} keyboardType="email-address" autoCapitalize="none" editable={!loading} />
          {errors.email &&
            <Text style={styles.fieldError}>{errors.email[0]}</Text>}
        </View><View style={styles.fieldContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={[styles.input, errors.password && styles.inputError]} placeholder="••••••••" placeholderTextColor={colors.slate600} value={formData.password} onChangeText={(val) => handleChange('password', val)} secureTextEntry editable={!loading} />
          {errors.password &&
            <Text style={styles.fieldError}>{errors.password[0]}</Text>}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput style={[styles.input, errors.password_confirmation && styles.inputError]} placeholder="••••••••" placeholderTextColor={colors.slate600} value={formData.password_confirmation} onChangeText={(val) => handleChange('password_confirmation', val)} secureTextEntry editable={!loading} />
          {errors.password_confirmation &&
            <Text style={styles.fieldError}>{errors.password_confirmation[0]}</Text>}
        </View>
        <Text style={styles.sectionTitle}>Health Metric</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date de naissance</Text>
          <TextInput style={[styles.input, errors.birthdate && styles.inputError]} placeholder="YYYY-MM-DD" placeholderTextColor={colors.slate600} value={formData.birthdate} onChangeText={(val) => handleChange('birthdate', val)} editable={!loading} />
          {errors.birthdate &&
            <Text style={styles.fieldError}>{errors.birthdate[0]}</Text>}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Genre</Text>
          <View style={[styles.pickerBox, errors.gender && styles.inputError]}>
            <Picker selectedValue={formData.gender} onValueChange={(val) => handleChange('gender', val)} enabled={!loading}>
              <Picker.Item label="Homme" value="Homme" />
              <Picker.Item label="Femme" value="Femme" />
              <Picker.Item label="Autres" value="Autres" />
            </Picker>
          </View>
          {errors.gender &&
            <Text style={styles.fieldError}>{errors.gender[0]}</Text>}
        </View><View style={styles.rowContainer}>
          <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Taille (cm)</Text>
            <TextInput style={[styles.input, errors.height && styles.inputError]} placeholder="180" placeholderTextColor={colors.slate600} value={formData.height} onChangeText={(val) => handleChange('height', val)} keyboardType="numeric" editable={!loading} />
            {errors.height &&
              <Text style={styles.fieldError}>{errors.height[0]}</Text>}
          </View>
          <View style={[styles.fieldContainer, { flex: 1 }]}>
            <Text style={styles.label}>Poids (kg)</Text>
            <TextInput style={[styles.input, errors.weight && styles.inputError]} placeholder="75.5" placeholderTextColor={colors.slate600} value={formData.weight} onChangeText={(val) => handleChange('weight', val)} keyboardType="decimal-pad" editable={!loading} />
            {errors.weight &&
              <Text style={styles.fieldError}>{errors.weight[0]}</Text>}
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Masse Grasse (%)</Text>
          <TextInput style={[styles.input, errors.body_fat_pct && styles.inputError]} placeholder="18.5" placeholderTextColor={colors.slate600} value={formData.body_fat_pct} onChangeText={(val) => handleChange('body_fat_pct', val)} keyboardType="decimal-pad" editable={!loading} />
          {errors.body_fat_pct &&
            <Text style={styles.fieldError}>{errors.body_fat_pct[0]}</Text>}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Niveau d'activité</Text>
          <View style={[styles.pickerBox, errors.physical_activity_level && styles.inputError]}>
            <Picker selectedValue={formData.physical_activity_level} onValueChange={(val) => handleChange('physical_activity_level', val)} enabled={!loading}>
              <Picker.Item label="Sédentaire" value="sedentary" />
              <Picker.Item label="Moyennement Actif" value="moderate" />
              <Picker.Item label="Actif" value="active" /></Picker>
          </View>{errors.physical_activity_level &&
            <Text style={styles.fieldError}>{errors.physical_activity_level[0]}</Text>}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Catégorie d'exercice préférée</Text>
          <View style={[styles.pickerBox, errors.favorite_exercise_category && styles.inputError]}>
            <Picker selectedValue={formData.favorite_exercise_category} onValueChange={(val) => handleChange('favorite_exercise_category', val)} enabled={!loading}>
              <Picker.Item label="Cardio" value="Cardio" />
              <Picker.Item label="Poids du corps" value="Poids du corps" />
              <Picker.Item label="Musculation" value="Musculation" />
            </Picker>
          </View>{errors.favorite_exercise_category &&
            <Text style={styles.fieldError}>{errors.favorite_exercise_category[0]}</Text>}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Apport calorique cible (kcal)</Text>
          <TextInput style={[styles.input, errors.daily_caloric_intake && styles.inputError]} placeholder="2000" placeholderTextColor={colors.slate600} value={formData.daily_caloric_intake} onChangeText={(val) => handleChange('daily_caloric_intake', val)} keyboardType="numeric" editable={!loading} />
          {errors.daily_caloric_intake &&
            <Text style={styles.fieldError}>{errors.daily_caloric_intake[0]}</Text>}
        </View>
        <TouchableOpacity style={[styles.submitButton, loading && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={loading} accessible={true} accessibilityRole="button" accessibilityLabel={loading ? 'Inscription en cours' : 'Créer mon compte'} accessibilityState={{ disabled: loading, busy: loading }}>
          {loading ?
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.white} />
              <Text style={styles.submitButtonText}>Inscription en cours...</Text>
            </View> : <Text style={styles.submitButtonText}>Créer mon compte</Text>}
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Déjà un compte? </Text>
          <TouchableOpacity onPress={() => router.push('/login')} accessible={true} accessibilityRole="link">
            <Text style={styles.loginLink}>Connectez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.slate50 },
  scrollContent: { paddingBottom: 32 },
  gradientSection: { backgroundColor: colors.secondary, paddingTop: 16, paddingHorizontal: 16, paddingBottom: 24 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 8 },
  logoBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logoIcon: { fontSize: 24 },
  logoText: { fontSize: 18, fontWeight: '700', color: colors.white, letterSpacing: 0.5 },
  heroSection: { marginBottom: 8 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: colors.white, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: colors.blue50 },
  formCard: { backgroundColor: colors.white, marginHorizontal: 16, marginTop: -16, marginBottom: 16, borderRadius: 24, padding: 24, shadowColor: colors.slate900, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  errorAlert: { backgroundColor: colors.red50, borderLeftWidth: 4, borderLeftColor: colors.red600, padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { fontSize: 13, color: colors.red600, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.slate900, marginTop: 16, marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.slate200 },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.slate700, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.slate200, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, backgroundColor: 'rgba(248, 250, 252, 0.5)', color: colors.slate900 },
  inputError: { borderColor: colors.red600, backgroundColor: colors.red50 },
  fieldError: { fontSize: 12, color: colors.red600, fontWeight: '600', marginTop: 6 },
  pickerBox: { borderWidth: 1, borderColor: colors.slate200, borderRadius: 12, backgroundColor: 'rgba(248, 250, 252, 0.5)', overflow: 'hidden' },
  rowContainer: { flexDirection: 'row' },
  submitButton: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { fontSize: 14, fontWeight: '700', color: colors.white },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  loginText: { fontSize: 13, color: colors.slate600 },
  loginLink: { fontSize: 13, fontWeight: '600', color: colors.secondary },
});
