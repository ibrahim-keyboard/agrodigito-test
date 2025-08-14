import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useCartStore } from '@/store/cartStore';
import { Colors } from '@/constants/Colors';
import {
  CallCallingIcon,
  CreditCardIcon,
  LocationIcon,
  TruckIcon,
} from '@/constants/icons';
import { useAuth } from '@/store/authStore';
import { createOrder } from '@/services/orderService';
import { ShippingAddress } from '@/type/ecommerce';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function CheckoutScreen() {
  const [deliveryMethod] = useState('standard');

  const { user } = useAuth();

  const { data: profile } = useUserProfile();

  const [isProcessing, setIsProcessing] = useState(false);

  const { items: cartItems, getTotalPrice, clearCart } = useCartStore();

  const calculateDeliveryFee = () => {
    // return deliveryMethod === 'express' ? 15000 : 10000; // TZS
    return 15000; // TZS
  };

  const subtotal = getTotalPrice();

  const calculateTotal = () => subtotal + calculateDeliveryFee();

  const formatPrice = (price: number) => {
    return price < 1000
      ? `$${price.toFixed(2)}`
      : `TSh ${price.toLocaleString()}`;
  };

  // if (cartItems.length === 0) {
  //   router.replace('/(protected)/(tabs)');
  // }

  const handlePlaceOrder = async () => {
    if (isProcessing) return;

    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add items to proceed.', [
        { text: 'Shop Now', onPress: () => router.push('/(protected)/(tabs)') },
      ]);
      return;
    }

    try {
      setIsProcessing(true);

      const shippingMethodObj = {
        id: deliveryMethod,
        name:
          deliveryMethod === 'express'
            ? 'Express Delivery'
            : 'Standard Delivery',
        description:
          deliveryMethod === 'express'
            ? 'Delivery in 1-2 business days'
            : 'Delivery in 3-5 business days',
        price: calculateDeliveryFee(),
        estimatedDays: deliveryMethod === 'express' ? '1-2 days' : '3-5 days',
        regions: ['Dar es Salaam'],
      };

      const shippingAddress: ShippingAddress = {
        fullName: profile?.full_name!,
        address: profile?.street_area!,
        postalCode: '23000',
        city: profile?.district!,
        region: profile?.region!,
        phone: profile?.phone!,
      };

      const orderSummary = {
        subtotal,
        shippingCost: calculateDeliveryFee(),
        discountAmount: 0,
        total: calculateTotal(),
      };

      const payment = { id: 'cod', name: 'Cash on Delivery' };

      const newOrder = await createOrder(
        cartItems,
        payment,
        shippingAddress,
        shippingMethodObj,
        user,
        orderSummary
      );

      if (newOrder.id) {
        router.replace({
          pathname: '/success',
          params: {
            id: newOrder.id,
          },
        });
        clearCart();
      }

      if (newOrder.id) {
        clearCart();
      }
    } catch (error) {
      console.log(error);

      alert(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name='arrow-back' color={Colors.neutral[900]} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Start shopping to fill your cart with amazing products!
          </Text>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => router.push('/(protected)/(tabs)')}>
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name='arrow-back' color={Colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LocationIcon fill={Colors.primary[800]} height={20} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{profile?.full_name}</Text>
            <Text style={styles.addressText}>{profile?.street_area}</Text>
            <Text style={styles.addressText}>{profile?.region}</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <CallCallingIcon fill={Colors.neutral[600]} height={16} />
                <Text style={styles.contactText}>+{profile?.phone}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCardIcon fill={Colors.primary[700]} height={20} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          <View style={styles.codForm}>
            <View style={styles.codInfoCard}>
              <View style={styles.codHeader}>
                <TruckIcon fill={Colors.success[700]} height={24} />
                <Text style={styles.codTitle}>Pay on Delivery</Text>
              </View>
              <Text style={styles.codDescription}>
                Pay for your order when it&rsquo;s delivered to your address.
                Our delivery agent will collect payment upon successful
                delivery.
              </Text>
              <View style={styles.codDetails}>
                <Text style={styles.codDetailsTitle}>Accepted Payments:</Text>
                <View style={styles.codPaymentMethods}>
                  <View style={styles.codPaymentMethod}>
                    <Text
                      style={{
                        color: Colors.primary[700],
                        fontSize: 16,
                      }}>
                      Tsh
                    </Text>
                    <Text style={styles.codPaymentMethodText}>Cash</Text>
                  </View>
                  <View style={styles.codPaymentMethod}>
                    <CreditCardIcon fill={Colors.primary[700]} height={16} />
                    <Text style={styles.codPaymentMethodText}>Card (POS)</Text>
                  </View>
                  <View style={styles.codPaymentMethod}>
                    <Ionicons
                      name='phone-portrait-sharp'
                      color={Colors.primary[700]}
                      size={16}
                    />
                    <Text style={styles.codPaymentMethodText}>
                      Mobile Money
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(calculateDeliveryFee())}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatPrice(calculateTotal())}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            isProcessing && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
          activeOpacity={0.8}>
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Text style={styles.placeOrderAmount}>
            {formatPrice(calculateTotal())}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  continueShoppingButton: {
    backgroundColor: Colors.primary[800],
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueShoppingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  addressCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  addressName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  contactInfo: {
    marginTop: 12,
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  changeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.primary[800],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  paymentMethods: {
    gap: 12,
    marginBottom: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    borderColor: Colors.primary[700],
    backgroundColor: '#F0FDF4',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#22C55E',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  paymentMethodText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  codBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  codBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  cardForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  halfWidth: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
    flex: 1,
  },
  mobileMoneyForm: {
    gap: 16,
  },
  mobileMoneyNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  bankTransferForm: {
    gap: 16,
  },
  bankTransferNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    lineHeight: 20,
  },
  codForm: {
    gap: 16,
  },
  codInfoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  codHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  codTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  codDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  codDetails: {
    marginBottom: 16,
  },
  codDetailsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  codPaymentMethods: {
    gap: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  codPaymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codPaymentMethodText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  codFeeInfo: {
    marginBottom: 16,
  },
  codFeeTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  codFeeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  codTermsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  codTermsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    flex: 1,
  },
  orderItems: {
    gap: 16,
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  orderItemPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  codPaymentNote: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  codPaymentNoteText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 32,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  placeOrderButton: {
    backgroundColor: Colors.primary[800],
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  placeOrderText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  placeOrderAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});
