import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Colors configuration
const Colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    700: '#15803d',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
  },
  white: '#ffffff',
  black: '#000000',
};

const SHOP_TYPES = [
  'Agrovet Shop',
  'Agricultural Supplies Store',
  'Farm Input Dealer',
  'Veterinary Clinic',
  'Seed & Fertilizer Store',
  'Agricultural Equipment Dealer',
  'Other',
];

const SHOP_SIZE = ['Small', 'Medium', 'Large'];

const TANZANIA_REGIONS = [
  'Arusha',
  'Dar es Salaam',
  'Dodoma',
  'Geita',
  'Iringa',
  'Kagera',
  'Katavi',
  'Kigoma',
  'Kilimanjaro',
  'Lindi',
  'Manyara',
  'Mara',
  'Mbeya',
  'Morogoro',
  'Mtwara',
  'Mwanza',
  'Njombe',
  'Pemba North',
  'Pemba South',
  'Pwani',
  'Rukwa',
  'Ruvuma',
  'Shinyanga',
  'Simiyu',
  'Singida',
  'Songwe',
  'Tabora',
  'Tanga',
  'Unguja North',
  'Unguja South',
];

interface ValidationState {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface FormErrors {
  shopName: ValidationState;
  region: ValidationState;
  district: ValidationState;
  streetArea: ValidationState;
  shopType: ValidationState;
  shopSize: ValidationState;
}

interface ShopFormData {
  shopName: string;
  region: string;
  district: string;
  streetArea: string;
  shopType: string;
  shopSize: string;
}

export default function BeautifulShopForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const [formData, setFormData] = useState<ShopFormData>({
    shopName: '',
    region: '',
    district: '',
    streetArea: '',
    shopType: '',
    shopSize: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    shopName: { isValid: true, message: '', type: 'success' },
    region: { isValid: true, message: '', type: 'success' },
    district: { isValid: true, message: '', type: 'success' },
    streetArea: { isValid: true, message: '', type: 'success' },
    shopType: { isValid: true, message: '', type: 'success' },
    shopSize: { isValid: true, message: '', type: 'success' },
  });

  const [showShopTypePicker, setShowShopTypePicker] = useState(false);
  const [showShopSizePicker, setShowShopSizePicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Validation functions
  const validateShopName = (name: string): ValidationState => {
    if (!name.trim()) {
      return {
        isValid: false,
        message: 'Shop name is required',
        type: 'error',
      };
    }
    if (name.trim().length < 2) {
      return {
        isValid: false,
        message: 'Shop name must be at least 2 characters',
        type: 'error',
      };
    }
    if (name.trim().length > 50) {
      return {
        isValid: false,
        message: 'Shop name must be less than 50 characters',
        type: 'error',
      };
    }
    return { isValid: true, message: 'Shop name looks good!', type: 'success' };
  };

  const validateRegion = (region: string): ValidationState => {
    if (!region) {
      return {
        isValid: false,
        message: 'Please select your region',
        type: 'error',
      };
    }
    return {
      isValid: true,
      message: 'Region selected successfully',
      type: 'success',
    };
  };

  const validateDistrict = (district: string): ValidationState => {
    if (!district.trim()) {
      return { isValid: false, message: 'District is required', type: 'error' };
    }
    if (district.trim().length < 2) {
      return {
        isValid: false,
        message: 'District name must be at least 2 characters',
        type: 'error',
      };
    }
    return {
      isValid: true,
      message: 'District name is valid',
      type: 'success',
    };
  };

  const validateStreetArea = (streetArea: string): ValidationState => {
    if (!streetArea.trim()) {
      return {
        isValid: false,
        message: 'Street/Area is required',
        type: 'error',
      };
    }
    if (streetArea.trim().length < 3) {
      return {
        isValid: false,
        message: 'Street/Area must be at least 3 characters',
        type: 'error',
      };
    }
    return { isValid: true, message: 'Street/Area is valid', type: 'success' };
  };

  const validateShopType = (shopType: string): ValidationState => {
    if (!shopType) {
      return {
        isValid: false,
        message: 'Please select your shop type',
        type: 'error',
      };
    }
    return {
      isValid: true,
      message: 'Shop type selected successfully',
      type: 'success',
    };
  };

  // Update form data with validation
  const updateFormData = (field: keyof ShopFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    let validation: ValidationState;
    switch (field) {
      case 'shopName':
        validation = validateShopName(value);
        break;
      case 'region':
        validation = validateRegion(value);
        break;
      case 'district':
        validation = validateDistrict(value);
        break;
      case 'streetArea':
        validation = validateStreetArea(value);
        break;
      case 'shopType':
        validation = validateShopType(value);
        break;
      default:
        validation = { isValid: true, message: '', type: 'success' };
    }

    setErrors((prev) => ({ ...prev, [field]: validation }));
  };

  // Validate all fields before submission
  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {
      shopName: validateShopName(formData.shopName),
      region: validateRegion(formData.region),
      district: validateDistrict(formData.district),
      streetArea: validateStreetArea(formData.streetArea),
      shopType: validateShopType(formData.shopType),
      shopSize: { isValid: true, message: '', type: 'success' },
    };

    setErrors(newErrors);

    const requiredFields = [
      'shopName',
      'region',
      'district',
      'streetArea',
      'shopType',
    ] as const;
    return requiredFields.every((field) => newErrors[field].isValid);
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors in the form before proceeding.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert('Success!', 'Shop details saved successfully!', [
        {
          text: 'Continue',
          onPress: () => {
            console.log('Shop setup completed with data:', formData);
            // router.replace('/dashboard');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save shop details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectFromPicker = (
    field: keyof ShopFormData,
    value: string,
    setShowPicker: (show: boolean) => void
  ) => {
    updateFormData(field, value);
    setShowPicker(false);
  };

  // Custom Input Component
  const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    icon,
    autoCapitalize = 'words',
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    error?: ValidationState;
    icon: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label} *</Text>
      <View
        style={[
          styles.inputContainer,
          error && !error.isValid && styles.inputError,
        ]}>
        <Ionicons name={icon as any} size={20} color={Colors.neutral[400]} />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={Colors.neutral[400]}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {error && error.message && (
        <View style={styles.statusMessage}>
          <Ionicons
            name={error.isValid ? 'checkmark-circle' : 'alert-circle'}
            size={16}
            color={error.isValid ? Colors.success[500] : Colors.error[500]}
            style={styles.statusIcon}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: error.isValid ? Colors.success[500] : Colors.error[500],
              },
            ]}>
            {error.message}
          </Text>
        </View>
      )}
    </View>
  );

  // Custom Picker Component
  const CustomPicker = ({
    label,
    value,
    placeholder,
    options,
    onSelect,
    showPicker,
    setShowPicker,
    error,
  }: {
    label: string;
    value: string;
    placeholder: string;
    options: string[];
    onSelect: (value: string) => void;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
    error?: ValidationState;
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label} *</Text>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          error && !error.isValid && styles.inputError,
        ]}
        onPress={() => setShowPicker(!showPicker)}>
        <Ionicons
          name='storefront-outline'
          size={20}
          color={Colors.neutral[400]}
        />
        <Text
          style={[styles.pickerButtonText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={showPicker ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.neutral[400]}
        />
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.pickerContainer}>
          <ScrollView style={styles.picker} nestedScrollEnabled>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.pickerItem}
                onPress={() => onSelect(option)}>
                <Text style={styles.pickerItemText}>{option}</Text>
                {value === option && (
                  <Ionicons
                    name='checkmark'
                    size={20}
                    color={Colors.primary[700]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {error && error.message && (
        <View style={styles.statusMessage}>
          <Ionicons
            name={error.isValid ? 'checkmark-circle' : 'alert-circle'}
            size={16}
            color={error.isValid ? Colors.success[500] : Colors.error[500]}
            style={styles.statusIcon}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: error.isValid ? Colors.success[500] : Colors.error[500],
              },
            ]}>
            {error.message}
          </Text>
        </View>
      )}
    </View>
  );

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
                <Text style={styles.headerTitle}>Shop Details</Text>
              </View>

              {/* Main Card */}
              <View style={styles.card}>
                {/* Success Icon */}
                <View style={styles.successContainer}>
                  <View style={styles.successIcon}>
                    <Ionicons
                      name='storefront'
                      size={60}
                      color={Colors.primary[700]}
                    />
                  </View>
                  <Text style={styles.successTitle}>Setup Your Shop</Text>
                  <Text style={styles.successSubtitle}>
                    Tell us about your agrovet shop to get personalized
                    recommendations and wholesale prices
                  </Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  <CustomInput
                    label='Shop Name'
                    value={formData.shopName}
                    onChangeText={(text) => updateFormData('shopName', text)}
                    placeholder='Enter your shop name'
                    error={errors.shopName}
                    icon='storefront-outline'
                  />

                  <CustomPicker
                    label='Region'
                    value={formData.region}
                    placeholder='Select your region'
                    options={TANZANIA_REGIONS}
                    onSelect={(value) =>
                      selectFromPicker('region', value, setShowRegionPicker)
                    }
                    showPicker={showRegionPicker}
                    setShowPicker={setShowRegionPicker}
                    error={errors.region}
                  />

                  <CustomInput
                    label='District'
                    value={formData.district}
                    onChangeText={(text) => updateFormData('district', text)}
                    placeholder='Enter your district'
                    error={errors.district}
                    icon='location-outline'
                  />

                  <CustomInput
                    label='Street/Area'
                    value={formData.streetArea}
                    onChangeText={(text) => updateFormData('streetArea', text)}
                    placeholder='Street name or area'
                    error={errors.streetArea}
                    icon='map-outline'
                  />

                  <CustomPicker
                    label='Shop Type'
                    value={formData.shopType}
                    placeholder='Select shop type'
                    options={SHOP_TYPES}
                    onSelect={(value) =>
                      selectFromPicker('shopType', value, setShowShopTypePicker)
                    }
                    showPicker={showShopTypePicker}
                    setShowPicker={setShowShopTypePicker}
                    error={errors.shopType}
                  />

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Shop Size (Optional)</Text>
                    <TouchableOpacity
                      style={styles.pickerButton}
                      onPress={() =>
                        setShowShopSizePicker(!showShopSizePicker)
                      }>
                      <Ionicons
                        name='resize-outline'
                        size={20}
                        color={Colors.neutral[400]}
                      />
                      <Text
                        style={[
                          styles.pickerButtonText,
                          !formData.shopSize && styles.placeholderText,
                        ]}>
                        {formData.shopSize || 'Select shop size'}
                      </Text>
                      <Ionicons
                        name={
                          showShopSizePicker ? 'chevron-up' : 'chevron-down'
                        }
                        size={20}
                        color={Colors.neutral[400]}
                      />
                    </TouchableOpacity>

                    {showShopSizePicker && (
                      <View style={styles.pickerContainer}>
                        <ScrollView style={styles.picker} nestedScrollEnabled>
                          {SHOP_SIZE.map((size) => (
                            <TouchableOpacity
                              key={size}
                              style={styles.pickerItem}
                              onPress={() =>
                                selectFromPicker(
                                  'shopSize',
                                  size,
                                  setShowShopSizePicker
                                )
                              }>
                              <Text style={styles.pickerItemText}>{size}</Text>
                              {formData.shopSize === size && (
                                <Ionicons
                                  name='checkmark'
                                  size={20}
                                  color={Colors.primary[700]}
                                />
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
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
                  disabled={isLoading}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.loadingDot} />
                      <Text style={styles.submitButtonText}>
                        Saving Shop Details...
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>
                        Complete Setup
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
                Your shop information is secure and will be used to provide
                personalized recommendations and wholesale pricing
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
    paddingHorizontal: 10,
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
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral[800],
    marginLeft: 10,
  },
  placeholderText: {
    color: Colors.neutral[400],
  },
  pickerContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    backgroundColor: Colors.white,
    maxHeight: 200,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  picker: {
    maxHeight: 200,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  pickerItemText: {
    fontSize: 16,
    color: Colors.neutral[800],
    flex: 1,
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
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
    paddingHorizontal: 20,
  },
});
