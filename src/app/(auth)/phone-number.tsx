import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { useAuth, useAuthStore } from '@/store/authStore';

export default function PhoneVerificationScreen() {
  const {
    signInWithOTP,
    verifyOTP,
    loading,
    verifyingOtp,
    otpSent,
    error,
    clearError,
    canResendOTP,
    getResendCooldownTime,
  } = useAuth();

  const { savedPhoneNumber, resetOTPState } = useAuthStore();

  const [phone, setPhone] = useState(savedPhoneNumber || '');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [cooldownTime, setCooldownTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Load saved phone number on component mount
  useEffect(() => {
    if (savedPhoneNumber && !phone) {
      setPhone(savedPhoneNumber);
    }
  }, [savedPhoneNumber, phone]);

  // Update cooldown timer
  useEffect(() => {
    if (otpSent && !canResendOTP()) {
      const updateCooldown = () => {
        const remaining = getResendCooldownTime();
        setCooldownTime(Math.ceil(remaining / 1000));

        if (remaining <= 0) {
          setCooldownTime(0);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      };

      updateCooldown();
      intervalRef.current = setInterval(updateCooldown, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [otpSent, canResendOTP, getResendCooldownTime]);

  // Move to OTP step when OTP is sent
  useEffect(() => {
    if (otpSent) {
      setStep('otp');
    }
  }, [otpSent]);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!isPhoneValid()) {
      Alert.alert(
        'Error',
        'Please enter a valid phone number starting with 07 or 06'
      );
      return;
    }

    // Convert to international format for API
    const normalizedPhone = '+255' + phone.slice(1);

    clearError();
    await signInWithOTP(normalizedPhone);
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      Alert.alert('Error', 'Please enter the OTP code');
      return;
    }

    if (otpCode.length !== 6) {
      Alert.alert('Error', 'OTP code must be 6 digits');
      return;
    }

    // Convert to international format for API
    const normalizedPhone = '+255' + phone.slice(1);

    clearError();
    await verifyOTP(normalizedPhone, otpCode);

    Alert.alert('Success', 'Phone number verified successfully!', [
      { text: 'Continue', onPress: () => router.replace('/user-profile') },
    ]);

    router.replace('/callback');
  };

  const handleResendOTP = async () => {
    // Convert to international format for API
    const normalizedPhone = '+255' + phone.slice(1);

    clearError();
    await signInWithOTP(normalizedPhone);
  };

  const formatCooldownTime = (seconds: number) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}m ${secs}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handlePhoneChange = (text: string) => {
    // Remove all non-numeric characters and spaces from formatted input
    const numericText = text.replace(/\D/g, '');

    // Limit to 10 digits and update phone
    if (numericText.length <= 10) {
      setPhone(numericText);
    }

    if (error) clearError();
  };

  const handleOTPChange = (text: string) => {
    // Only allow numbers, limit to 6 digits
    const numericText = text.replace(/\D/g, '').slice(0, 6);
    setOtpCode(numericText);
    if (error) clearError();
  };

  const isPhoneValid = () => {
    // Check if phone number is exactly 10 digits and starts with 07 or 06
    return (
      phone.length === 10 && (phone.startsWith('07') || phone.startsWith('06'))
    );
  };

  const formatPhoneNumber = (phoneNum: string) => {
    // Only format for display if we have digits
    if (!phoneNum) return '';

    // Format: XXXX XXX XXX
    if (phoneNum.length <= 4) {
      return phoneNum;
    } else if (phoneNum.length <= 7) {
      return `${phoneNum.slice(0, 4)} ${phoneNum.slice(4)}`;
    } else {
      return `${phoneNum.slice(0, 4)} ${phoneNum.slice(4, 7)} ${phoneNum.slice(
        7
      )}`;
    }
  };

  const isLoading = loading || verifyingOtp;

  return (
    <LinearGradient
      colors={[Colors.success[700], Colors.primary[800]]}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    if (step === 'otp') {
                      setStep('phone');
                      resetOTPState();
                    } else {
                      router.back();
                    }
                  }}>
                  <Ionicons name='arrow-back' size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                  {step === 'phone' ? 'Phone Verification' : 'Enter OTP'}
                </Text>
              </View>

              {/* Main Card */}
              <View style={styles.card}>
                {step === 'phone' ? (
                  <>
                    {/* Phone Number Step */}
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name='phone-portrait'
                        size={60}
                        color={Colors.primary[600]}
                      />
                    </View>

                    <Text style={styles.title}>Add Your Phone Number</Text>
                    <Text style={styles.subtitle}>
                      We&lsquo;ll send you a verification code to confirm your
                      number
                    </Text>

                    <View style={styles.inputContainer}>
                      <View style={styles.countryCode}>
                        <Text style={styles.countryCodeText}>🇹🇿 +255</Text>
                      </View>
                      <TextInput
                        style={[styles.phoneInput, error && styles.inputError]}
                        value={formatPhoneNumber(phone)}
                        onChangeText={handlePhoneChange}
                        placeholder='712 345 678'
                        placeholderTextColor={Colors.neutral[400]}
                        keyboardType='numeric'
                        maxLength={12} // Account for spaces in formatting
                        autoFocus
                      />
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.validationInfo}>
                      <View style={styles.validationItem}>
                        <Ionicons
                          name={
                            phone.length === 10
                              ? 'checkmark-circle'
                              : 'ellipse-outline'
                          }
                          size={16}
                          color={
                            phone.length === 10
                              ? Colors.success[500]
                              : Colors.neutral[400]
                          }
                        />
                        <Text
                          style={[
                            styles.validationText,
                            phone.length === 10 && styles.validationTextValid,
                          ]}>
                          Must be exactly 10 digits
                        </Text>
                      </View>
                      <View style={styles.validationItem}>
                        <Ionicons
                          name={
                            phone.startsWith('07') || phone.startsWith('06')
                              ? 'checkmark-circle'
                              : 'ellipse-outline'
                          }
                          size={16}
                          color={
                            phone.startsWith('07') || phone.startsWith('06')
                              ? Colors.success[500]
                              : Colors.neutral[400]
                          }
                        />
                        <Text
                          style={[
                            styles.validationText,
                            (phone.startsWith('07') ||
                              phone.startsWith('06')) &&
                              styles.validationTextValid,
                          ]}>
                          Must start with 07 or 06
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        (!isPhoneValid() || isLoading) &&
                          styles.submitButtonDisabled,
                      ]}
                      onPress={handleSendOTP}
                      disabled={!isPhoneValid() || isLoading}>
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View style={styles.loadingDot} />
                          <Text style={styles.submitButtonText}>
                            Sending OTP...
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.submitButtonText}>Send OTP</Text>
                          <Ionicons
                            name='arrow-forward'
                            size={20}
                            color={Colors.white}
                          />
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* OTP Step */}
                    <View style={styles.iconContainer}>
                      <Ionicons
                        name='chatbubble-ellipses'
                        size={60}
                        color={Colors.primary[600]}
                      />
                    </View>

                    <Text style={styles.title}>Enter Verification Code</Text>
                    <Text style={styles.subtitle}>
                      We sent a 6-digit code to {formatPhoneNumber(phone)}
                    </Text>

                    <TextInput
                      style={[styles.otpInput, error && styles.inputError]}
                      value={otpCode}
                      onChangeText={handleOTPChange}
                      placeholder='000000'
                      placeholderTextColor={Colors.neutral[400]}
                      keyboardType='numeric'
                      maxLength={6}
                      autoFocus
                      textAlign='center'
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    {/* Resend Button */}
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={handleResendOTP}
                      disabled={!canResendOTP() || isLoading}>
                      <Text
                        style={[
                          styles.resendButtonText,
                          (!canResendOTP() || isLoading) &&
                            styles.resendButtonTextDisabled,
                        ]}>
                        {isLoading
                          ? 'Resending...'
                          : canResendOTP()
                          ? 'Resend OTP'
                          : `Resend in ${formatCooldownTime(cooldownTime)}`}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        (otpCode.length !== 6 || isLoading) &&
                          styles.submitButtonDisabled,
                      ]}
                      onPress={handleVerifyOTP}
                      disabled={otpCode.length !== 6 || isLoading}>
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View style={styles.loadingDot} />
                          <Text style={styles.submitButtonText}>
                            Verifying...
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Text style={styles.submitButtonText}>
                            Verify & Continue
                          </Text>
                          <Ionicons
                            name='checkmark'
                            size={20}
                            color={Colors.white}
                          />
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Footer */}
              <Link href='/(auth)/privacy' style={styles.footerText}>
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </Link>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.white,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
  },
  countryCode: {
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRightWidth: 0,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: Colors.white,
    borderLeftWidth: 0,
  },
  otpInput: {
    width: '100%',
    height: 60,
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    backgroundColor: Colors.white,
    marginBottom: 20,
  },
  inputError: {
    borderColor: Colors.error[500],
  },
  errorText: {
    color: Colors.error[500],
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  validationInfo: {
    width: '100%',
    marginBottom: 20,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  validationText: {
    fontSize: 14,
    color: Colors.neutral[400],
    marginLeft: 8,
  },
  validationTextValid: {
    color: Colors.success[500],
  },
  resendButton: {
    marginBottom: 20,
  },
  resendButtonText: {
    color: Colors.primary[600],
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendButtonTextDisabled: {
    color: Colors.neutral[400],
    textDecorationLine: 'none',
  },
  submitButton: {
    backgroundColor: Colors.primary[800],
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: Colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.neutral[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 10,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
});
