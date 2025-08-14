import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatCurrency } from '@/utils/currency';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  CalendarIcon,
  ClockIcon,
  ConfirmedIcon,
  LocationIcon,
  MailIcon,
  OrderBoxIcon,
  PhoneIcon,
  ShopIcon,
  TruckDelivered,
  TruckIcon,
  UserIcon,
} from '@/constants/icons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { router, useLocalSearchParams } from 'expo-router';
import { useOrder } from '@/hooks/useSupabaseOrders';
import { JSX, useCallback } from 'react';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/common/Button';
import LoadingState from '@/components/common/LoadingState';

export default function OrderDetailPage() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { data: selectedOrder, refetch, isLoading } = useOrder(orderId);

  console.log('Selected Order:', selectedOrder);
  console.log('Selected id:', orderId);

  const getStatusColor = useCallback((status: string): string => {
    const colors: Record<string, string> = {
      pending: Colors.warning[500],
      confirmed: Colors.success[500],
      processing: Colors.blue[500],
      shipped: Colors.accent[500],
      delivered: Colors.primary[500],
      cancelled: Colors.error[500],
    };
    return colors[status] || Colors.neutral[500];
  }, []);

  const getStatusIcon = useCallback(
    (status: string) => {
      const icons: Record<string, JSX.Element> = {
        pending: <ClockIcon height={16} fill={getStatusColor(status)} />,
        confirmed: <ConfirmedIcon height={20} fill={Colors.success[500]} />,
        processing: <OrderBoxIcon height={16} fill={getStatusColor(status)} />,
        shipped: <TruckIcon height={16} fill={getStatusColor(status)} />,
        delivered: <TruckDelivered height={16} fill={getStatusColor(status)} />,
        cancelled: (
          <MaterialCommunityIcons
            name='cancel'
            size={16}
            color={getStatusColor(status)}
          />
        ),
      };
      return (
        icons[status] || (
          <OrderBoxIcon height={16} fill={getStatusColor(status)} />
        )
      );
    },
    [getStatusColor]
  );

  return (
    <SafeAreaView style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Order Details</Text>
      </View>
      {isLoading ? (
        <LoadingState name='order...' />
      ) : (
        selectedOrder && (
          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                colors={[Colors.primary[700]]}
                tintColor={Colors.primary[700]}
              />
            }>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Order Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Order Number:</Text>
                <Text style={styles.detailValue}>
                  #{selectedOrder.orderNumber}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={styles.statusContainer}>
                  {getStatusIcon(selectedOrder.status)}
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(selectedOrder.status) },
                    ]}>
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.paymentMethod.name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(selectedOrder.total)}
                </Text>
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                Customer Information
              </Text>
              <View style={styles.detailRow}>
                <UserIcon height={16} fill={Colors.neutral[600]} />
                <Text style={styles.detailValue}>
                  {selectedOrder.customerName ||
                    `Customer ${selectedOrder.orderNumber.slice(-3)}`}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <ShopIcon height={16} fill={Colors.neutral[600]} />
                <Text style={styles.detailValue}>
                  {selectedOrder.customerEmail || `Agrilink shop`}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <PhoneIcon height={16} fill={Colors.neutral[600]} />
                <Text style={styles.detailValue}>
                  {selectedOrder.customerPhone || '+255 712 345 678'}
                </Text>
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Shipping Address</Text>
              <View style={styles.addressContainer}>
                <LocationIcon height={16} fill={Colors.neutral[600]} />
                <View style={styles.addressText}>
                  <Text style={styles.detailValue}>
                    {selectedOrder.shippingAddress.address}
                  </Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.region}
                  </Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.shippingAddress.postalCode}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Order Items</Text>
              {selectedOrder.items.map((item, index) => (
                <View key={index} style={styles.detailItemRow}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.detailItemImage}
                  />
                  <View style={styles.detailItemInfo}>
                    <Text style={styles.detailItemName}>{item.name}</Text>
                    <Text style={styles.detailItemSupplier}>
                      {item.supplier}
                    </Text>
                    <Text style={styles.detailItemQuantity}>
                      Quantity: {item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.detailItemPrice}>
                    {formatCurrency(item.price)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )
      )}

      <View style={styles.footer}>
        <Button
          title='Track your Order'
          onPress={() =>
            router.push(`/(protected)/track-order/${selectedOrder?.id}`)
          }
          leftIcon={<CalendarIcon height={20} fill={Colors.white} />}
          style={styles.homeButton}
        />
        <Button
          variant='outline'
          title='View Order Details'
          onPress={() => router.push('/(protected)/(tabs)/order')}
          leftIcon={<OrderBoxIcon height={20} fill={Colors.primary[700]} />}
          style={styles.orderButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  modalTitle: {
    ...Typography.h2,
    flex: 1,
    textAlign: 'center',
  },

  modalBody: {
    padding: 24,
    paddingBottom: 120,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    ...Typography.caption,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },

  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    ...Typography.h5,
    marginBottom: 12,
    color: Colors.neutral[900],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 24,
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.neutral[600],
    width: 100,
    marginRight: 12,
  },
  detailValue: {
    ...Typography.body,
    fontFamily: 'Inter-Medium',
    flex: 1,
    marginLeft: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    marginLeft: 8,
    flex: 1,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  detailItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  detailItemInfo: {
    flex: 1,
  },
  detailItemName: {
    ...Typography.body,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  detailItemSupplier: {
    ...Typography.caption,
    color: Colors.primary[700],
    marginBottom: 2,
  },
  detailItemQuantity: {
    ...Typography.caption,
    color: Colors.neutral[600],
  },
  detailItemPrice: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    padding: 16,
    gap: 10,
    paddingBottom: 32,
  },
  orderButton: {
    marginBottom: 12,
  },
  homeButton: {
    marginBottom: 0,
  },
});
