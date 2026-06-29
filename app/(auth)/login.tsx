import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../../lib/api';
import { router } from "expo-router";

const colors = {
  primary: '#7B3FF2',
  secondary: '#4A6BF0',
  blue50: '#eff6ff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0f172a',
  red50: '#fef2f2',
  red100: '#fee2e2',
  red600: '#dc2626',
  white: '#ffffff',
};

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: [] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setGlobalError('');
    setErrors({});

    try {
      const response = await api.post('/api/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.status >= 200 && response.status < 300) {
        const token = response.data.access_token as string;
        await SecureStore.setItemAsync('auth_token', token);
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setGlobalError("Entée invalide");
      } else if (err.response?.status === 401) {
        setGlobalError('Identifiants incorrects. Veuillez réessayer.');
      } else if (!err.response) {
        setGlobalError(
          'Impossible de joindre le serveur. Vérifiez votre connexion internet.'
        );
      } else {
        setGlobalError('Une erreur inattendue est survenue. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.gradientSection}>
          <View style={styles.headerContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>⚡</Text>
            </View>

            <View>
              <Text style={styles.logoText}>Health AI Coach</Text>
              <Text style={styles.subtitle}>Welcome back</Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(val) => handleChange('email', val)}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={formData.password}
            onChangeText={(val) => handleChange('password', val)}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Connecting...' : 'Login'}
            </Text>
          </TouchableOpacity>
          {globalError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{globalError}</Text>
            </View>
          ) : null}
          {/* Register link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
              <Text style={styles.registerLink}> Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureCheckBox}>
        <Text style={styles.checkmarkIcon}>✓</Text>
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function SocialButton({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity
      style={styles.socialButton}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Se connecter avec ${label}`}
    >
      <Text style={styles.socialButtonIcon}>{icon}</Text>
      <Text style={styles.socialButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate50,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  gradientSection: {
    backgroundColor: colors.secondary,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.6,
  },
  featureCheckBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmarkIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  featureText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '500',
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: -16,
    marginBottom: 16,
    borderRadius: 24,
    padding: 24,
    shadowColor: colors.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate700,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: 'rgba(248, 250, 252, 0.5)',
    color: colors.slate900,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  socialButton: {
    flex: 1,
    minWidth: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 12,
    backgroundColor: colors.white,
    gap: 8,
  },
  socialButtonIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.slate700,
  },
  socialButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate700,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  registerText: {
    fontSize: 13,
    color: colors.slate600,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
});
