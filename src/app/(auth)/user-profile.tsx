import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/store/authStore';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { supabase } from '@/utils/supabase';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function AddPersonInfo() {
  const { user } = useAuth();

  const { data: userProfile, isLoading: profileLoading } = useUserProfile();

  const [formData, setFormData] = useState({
    fullName: userProfile?.full_name || '',
    profileImage: userProfile?.profile_image_url || '',
  });

  const [errors, setErrors] = useState<{ fullName?: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

  const validateForm = () => {
    const newErrors: { fullName?: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = async () => {
    try {
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required!'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setIsUploading(true);

        try {
          // Generate unique filename
          const fileExt = asset.uri.split('.').pop();
          const fileName = `${user?.id || 'user'}-${Date.now()}.${fileExt}`;

          // Method 1: Using ArrayBuffer (recommended for React Native)
          const response = await fetch(asset.uri);
          const arrayBuffer = await response.arrayBuffer();

          const imagUrl = `https://xeubklnzrysyxolndwzf.supabase.co/storage/v1/object/public/user-avartar/${fileName}`;

          const { data, error } = await supabase.storage
            .from('user-avartar') // Note: consider renaming to 'user-avatar' for correct spelling
            .upload(fileName, arrayBuffer, {
              contentType: asset.type || `image/${fileExt}`,
              cacheControl: '3600',
              upsert: false,
            });

          setFormData({ ...formData, profileImage: imagUrl });

          console.log('✅ Image uploaded successfully:', imagUrl);

          if (error) {
            throw error;
          }

          Alert.alert('Success', 'Profile picture uploaded successfully!');
        } catch (error) {
          console.error('Upload error:', error);
          Alert.alert(
            'Upload Failed',
            'Failed to upload image. Please try again.'
          );
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to open image picker. Please try again.');
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: user?.id,
        full_name: formData.fullName,
        phone: user?.phone,
        profile_image_url: formData.profileImage,
      });

    const updateField = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  };

  return (
    <LinearGradient
      colors={[Colors.success[700], Colors.primary[900]]}
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
                  onPress={() => router.back()}>
                  <Ionicons name='arrow-back' size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Complete Your Profile</Text>
              </View>

              {/* Main Card */}
              <View style={styles.card}>
                {/* Success Icon */}
                <View style={styles.successContainer}>
                  <View style={styles.successIcon}>
                    <Ionicons
                      name='checkmark-circle'
                      size={60}
                      color={Colors.success[500]}
                    />
                  </View>
                  <Text style={styles.successTitle}>Phone Verified!</Text>
                  <Text style={styles.successSubtitle}>
                    Complete your profile to get started with Agrodigito
                  </Text>
                </View>

                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                  <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={handleImagePicker}
                    disabled={isUploading}>
                    {formData.profileImage ? (
                      <Image
                        source={{ uri: formData.profileImage }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Ionicons
                          name='person'
                          size={40}
                          color={Colors.neutral[400]}
                        />
                      </View>
                    )}

                    <View style={styles.avatarOverlay}>
                      {isUploading ? (
                        <Animated.View style={styles.uploadingIndicator}>
                          <Ionicons
                            name='cloud-upload'
                            size={20}
                            color={Colors.white}
                          />
                        </Animated.View>
                      ) : (
                        <View style={styles.cameraIcon}>
                          <Ionicons
                            name='camera'
                            size={20}
                            color={Colors.white}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.avatarLabel}>
                    {isUploading ? 'Uploading...' : 'Tap to add photo'}
                  </Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name *</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name='person-outline'
                        size={20}
                        color={Colors.neutral[400]}
                      />
                      <TextInput
                        style={[
                          styles.textInput,
                          errors.fullName && styles.inputError,
                        ]}
                        placeholder='Enter your full name'
                        value={formData.fullName}
                        onChangeText={(value) => updateField('fullName', value)}
                        placeholderTextColor={Colors.neutral[400]}
                        autoCapitalize='words'
                      />
                    </View>
                    {errors.fullName && (
                      <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isLoading && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={isLoading || isUploading}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.loadingDot} />
                      <Text style={styles.submitButtonText}>
                        Updating Profile...
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>
                        Complete Profile
                      </Text>
                      <Ionicons
                        name='arrow-forward'
                        size={20}
                        color={Colors.white}
                      />
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <Text style={styles.footerText}>
                Your information is secure and will only be used to personalize
                your Agrodigito experience
              </Text>
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
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary[900],
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary[900],
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  uploadingIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral[800],
    marginLeft: 10,
  },
  inputError: {
    borderColor: Colors.error[500],
    backgroundColor: Colors.error[50],
  },
  errorText: {
    color: Colors.error[500],
    fontSize: 14,
    marginTop: 5,
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
    shadowColor: Colors.primary[700],
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
