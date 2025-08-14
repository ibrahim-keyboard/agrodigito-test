import { supabase } from '@/utils/supabase';

// Phone number validation
export const validatePhoneNumber = (
  phone: string
): { isValid: boolean; error?: string } => {
  // Remove any spaces, dashes, or other formatting
  const cleanPhone = phone.replace(/\D/g, '');

  // Check if it has exactly 10 digits
  if (cleanPhone.length !== 10) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits' };
  }

  // Check if it starts with 07 or 06
  if (!cleanPhone.startsWith('07') && !cleanPhone.startsWith('06')) {
    return { isValid: false, error: 'Phone number must start with 07 or 06' };
  }

  return { isValid: true };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(
      3,
      6
    )} ${cleanPhone.slice(6)}`;
  }
  return phone;
};

// Phone number API functions
export const phoneNumberAPI = {
  // Add phone number to user profile

  addPhoneNumber: async (phoneNumber: string) => {
    console.log('helloooooo');
    console.log(phoneNumber);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.auth.updateUser({
      phone: `+255${phoneNumber.slice(1)}`,
    });

    if (error) throw error;
    return data;
  },

  // Send OTP to phone number
  sendOTP: async (phoneNumber: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+255${phoneNumber.slice(1)}`, // Convert 07/06 to +255 format
    });

    if (error) throw error;
    return data;
  },

  // Verify OTP
  verifyOTP: async (phoneNumber: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+255${phoneNumber.slice(1)}`,
      token,
      type: 'sms',
    });

    if (error) throw error;
    return data;
  },

  // Get user phone number
  getUserPhone: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('phone_number, phone_verified')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
};
