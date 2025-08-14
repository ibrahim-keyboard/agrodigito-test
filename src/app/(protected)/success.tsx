import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils/currency';
import { useOrder } from '@/hooks/useSupabaseOrders';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingState from '@/components/common/LoadingState';
import { formatTimestamp } from '@/utils/date';
import { OrderTick } from '@/constants/icons';

type Id = { id: string };

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<Id>();

  const { data: params, isLoading: LoadingOrder } = useOrder(id);

  const handleTrackOrder = () => {
    // Navigate to track order with the order details
    router.push(`/track-order/${params?.id}`);
  };

  const handleContinueShopping = () => {
    router.replace('/(protected)/(tabs)');
  };

  if (LoadingOrder && !params) {
    return <LoadingState name='success' />;
  }

  if (!params) {
    return (
      <SafeAreaView>
        <Text>Order is not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.checkCircle}>
          <OrderTick
            height={80}
            width={80}
            color={Colors.white}
            fill={Colors.white}
            fill-rule={Colors.white}
            stroke={Colors.white}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Order Placed Successfully!</Text>
          <Text style={styles.message}>
            Thank you for your order. Your order #{params?.orderNumber} has been
            placed successfully and is awaiting confirmation.
          </Text>

          <View style={styles.orderDetails}>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Order Number:</Text>
              <Text style={styles.orderDetailValue}>
                #{params?.orderNumber}
              </Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Order Date:</Text>
              <Text style={styles.orderDetailValue}>
                {formatTimestamp(params?.createdAt)}
              </Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Total Amount:</Text>
              <Text style={styles.orderDetailValue}>
                {formatCurrency(params?.total || 0)}
              </Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Payment Method:</Text>
              <Text style={styles.orderDetailValue}>
                {String(params?.paymentMethod?.name)}
              </Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Delivery Method:</Text>
              <Text style={styles.orderDetailValue}>
                {params?.shippingMethod.name}
              </Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailLabel}>Status:</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending Confirmation</Text>
              </View>
            </View>
          </View>

          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryTitle}>
              *Delivery will begin after order confirmation
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            title='Track Order'
            onPress={handleTrackOrder}
            style={styles.trackButton}
          />
          <Button
            title='Continue Shopping'
            onPress={handleContinueShopping}
            variant='outline'
            style={styles.continueButton}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.neutral[600],
    marginBottom: 32,
    lineHeight: 22,
  },
  orderDetails: {
    width: '100%',
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDetailLabel: {
    ...Typography.body,
    color: Colors.neutral[600],
  },
  orderDetailValue: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
  },
  statusBadge: {
    backgroundColor: Colors.warning[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.warning[700],
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  deliveryInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  deliveryTitle: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  deliveryDate: {
    ...Typography.h5,
    color: Colors.primary[700],
    marginBottom: 4,
  },
  deliveryNote: {
    ...Typography.caption,
    color: Colors.neutral[500],
    lineHeight: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttons: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  trackButton: {
    marginBottom: 12,
  },
  continueButton: {},
});
