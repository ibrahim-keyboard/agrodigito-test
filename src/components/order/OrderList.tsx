import {
  ColorValue,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { LocationIcon } from '@/constants/icons';
import { Order } from '@/type/ecommerce';
import { router } from 'expo-router';
import { Typography } from '@/constants/Typography';

type OrderListProps = {
  getStatusColor: (value: string) => ColorValue;
  getStatusIcon: (value: string) => React.ReactNode;
  filteredOrders: Order[];
  LoadingOrders: boolean;
  refetch: () => void;
};

export default function OrderList({
  getStatusColor,
  getStatusIcon,
  filteredOrders,
  LoadingOrders,
  refetch,
}: OrderListProps) {
  const renderOrder = ({ item }: { item: Order }) => (
    <Pressable
      style={styles.orderCard}
      // onPress={() => router.push(`/orders/${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order: #{item.orderNumber}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${String(getStatusColor(item.status))}20` },
          ]}>
          {getStatusIcon(item.status)}
          <Text
            style={[
              styles.statusLabel,
              { color: getStatusColor(item.status) },
            ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.orderBody}>
        <Text style={styles.itemsTitle}>Items ({item.items.length})</Text>
        {item.items.slice(0, 2).map((orderItem, index) => (
          <View key={`${item.id}-${index}`} style={styles.productItem}>
            {orderItem.imageUrl ? (
              <Image
                source={{ uri: orderItem?.imageUrl }}
                style={styles.productImage}
                contentFit='cover'
              />
            ) : (
              <View style={[styles.productImage, styles.placeholderImage]}>
                <Ionicons
                  name='image-outline'
                  size={24}
                  color={Colors.neutral[400]}
                />
              </View>
            )}
            <Text style={styles.productName} numberOfLines={2}>
              {orderItem.name}
            </Text>
          </View>
        ))}
        {item.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{item.items.length - 2} more items
          </Text>
        )}
      </View>
      <View style={styles.orderFooter}>
        <View style={styles.deliveryInfo}>
          <LocationIcon height={16} fill={Colors.neutral[500]} />
          <Text style={styles.deliveryText}>
            {/* Todo: fix date of delivering  */}
            {item.estimatedDelivery
              ? `Delivered on ${new Date(
                  item.estimatedDelivery!
                ).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}`
              : 'Pending... '}
          </Text>
        </View>
        <Text style={styles.orderTotal}>TSh {item.total.toLocaleString()}</Text>
      </View>
      <View style={styles.orderActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => router.push(`/orders/${item.id}`)}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </Pressable>
        {item.status === 'delivered' && (
          <Pressable
            style={[styles.actionButton, styles.reorderButton]}
            // onPress={() => handleReorder(order)}
          >
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={filteredOrders}
      renderItem={renderOrder}
      refreshControl={
        <RefreshControl
          refreshing={LoadingOrders}
          onRefresh={refetch}
          colors={[Colors.primary[700]]}
          tintColor={Colors.primary[700]}
        />
      }
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  orderDate: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: 4,
  },
  moreItems: {
    ...Typography.caption,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderBody: {
    marginBottom: 12,
  },
  itemsTitle: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    color: Colors.neutral[700],
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  deliveryText: {
    fontSize: 12,
    color: Colors.neutral[500],
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  reorderButton: {
    backgroundColor: Colors.success[700],
  },
  reorderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});
