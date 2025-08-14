import Card from '@/components/Card';
import { Colors } from '@/constants/Colors';
import {
  ClockIcon,
  ConfirmedIcon,
  OrderBoxIcon,
  TruckDelivered,
  TruckIcon,
} from '@/constants/icons';
import { Typography } from '@/constants/Typography';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';
import { Order } from '@/type/ecommerce';
import { formatCurrency } from '@/utils/currency';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { JSX, useCallback, useMemo, useState, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface StatusFilter {
  id: string;
  label: string;
  count: number;
  color: string;
}

const { width } = Dimensions.get('window');

export default function AdminScreen() {
  const { orders, isLoading, error, updateOrderStatus, deleteOrder, refetch } =
    useSupabaseOrders();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const filterScrollRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Enhanced status filters with colors
  const statusFilters = useMemo<StatusFilter[]>(
    () => [
      {
        id: 'all',
        label: 'All Orders',
        count: orders.length,
        color: Colors.neutral[700],
      },
      {
        id: 'pending',
        label: 'Pending',
        count: orders.filter((o) => o.status === 'pending').length,
        color: Colors.warning[600],
      },
      {
        id: 'confirmed',
        label: 'Confirmed',
        count: orders.filter((o) => o.status === 'confirmed').length,
        color: Colors.success[600],
      },
      {
        id: 'processing',
        label: 'Processing',
        count: orders.filter((o) => o.status === 'processing').length,
        color: Colors.blue[600],
      },
      {
        id: 'shipped',
        label: 'Shipped',
        count: orders.filter((o) => o.status === 'shipped').length,
        color: Colors.accent[600],
      },
      {
        id: 'delivered',
        label: 'Delivered',
        count: orders.filter((o) => o.status === 'delivered').length,
        color: Colors.primary[600],
      },
    ],
    [orders]
  );

  // Enhanced filter selection with scroll animation
  const handleFilterSelect = useCallback(
    (filterId: string) => {
      setStatusFilter(filterId);

      // Find the index of the selected filter
      const selectedIndex = statusFilters.findIndex(
        (filter) => filter.id === filterId
      );

      // Scroll to the selected filter with smooth animation
      if (filterScrollRef.current && selectedIndex !== -1) {
        setTimeout(() => {
          filterScrollRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: true,
            viewPosition: 0.5, // Center the item
          });
        }, 100);
      }
    },
    [statusFilters]
  );

  const renderStatusFilter = useCallback(
    ({ item, index }: { item: StatusFilter; index: number }) => {
      const isActive = statusFilter === item.id;

      return (
        <TouchableOpacity
          style={[
            styles.filterChip,
            isActive && [
              styles.activeFilterChip,
              { backgroundColor: item.color },
            ],
          ]}
          onPress={() => handleFilterSelect(item.id)}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.filterChipText,
              isActive && styles.activeFilterChipText,
            ]}>
            {item.label}
          </Text>
          <View
            style={[styles.filterCount, isActive && styles.activeFilterCount]}>
            <Text
              style={[
                styles.filterCountText,
                isActive && styles.activeFilterCountText,
              ]}>
              {item.count}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [statusFilter, handleFilterSelect]
  );

  const getStatusColor = useCallback((status: string): string => {
    const colors: Record<string, string> = {
      pending: Colors.warning[600],
      confirmed: Colors.success[600],
      processing: Colors.blue[600],
      shipped: Colors.accent[600],
      delivered: Colors.primary[600],
      cancelled: Colors.error[600],
    };
    return colors[status] || Colors.neutral[500];
  }, []);

  const getStatusIcon = useCallback(
    (status: string) => {
      const statusColor = getStatusColor(status);
      const icons: Record<string, JSX.Element> = {
        pending: <ClockIcon height={16} fill={statusColor} />,
        confirmed: <ConfirmedIcon height={20} fill={statusColor} />,
        processing: <OrderBoxIcon height={16} fill={statusColor} />,
        shipped: <TruckIcon height={16} fill={statusColor} />,
        delivered: <TruckDelivered height={16} fill={statusColor} />,
        cancelled: (
          <MaterialCommunityIcons name='cancel' size={16} color={statusColor} />
        ),
      };
      return icons[status] || <OrderBoxIcon height={16} fill={statusColor} />;
    },
    [getStatusColor]
  );

  const getPriorityColor = useCallback(
    (priority: string = 'normal'): string => {
      const colors: Record<string, string> = {
        high: Colors.error[600],
        normal: Colors.primary[600],
        low: Colors.neutral[500],
      };
      return colors[priority] || Colors.neutral[500];
    },
    []
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) => statusFilter === 'all' || order.status === statusFilter
      ),
    [orders, statusFilter]
  );

  const renderOrderCard = useCallback(
    ({ item }: { item: Order }) => (
      <Card style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <View style={styles.orderNumberRow}>
              <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor(item.priority) },
                ]}
              />
            </View>
            <Text style={styles.customerName}>
              {item.customerName || `Customer ${item.orderNumber.slice(-3)}`}
            </Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.orderActions}>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: `${getStatusColor(item.status)}15` },
              ]}>
              {getStatusIcon(item.status)}
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => {
                setSelectedOrder(item);
                // setActionModalVisible(true);
              }}
              activeOpacity={0.7}>
              <Feather
                name='more-vertical'
                size={20}
                color={Colors.neutral[600]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.orderItems}>
          <Text style={styles.itemsTitle}>Items ({item.items.length})</Text>
          {item.items.slice(0, 2).map((orderItem, index) => (
            <View key={index} style={styles.orderItemRow}>
              <Image
                source={{ uri: orderItem.imageUrl }}
                style={styles.itemImage}
                contentFit='cover'
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {orderItem.name}
                </Text>
                <Text style={styles.itemSupplier}>{orderItem.supplier}</Text>
                <Text style={styles.itemQuantity}>
                  Qty: {orderItem.quantity}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatCurrency(orderItem.price)}
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
          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>{formatCurrency(item.total)}</Text>
          </View>
          <View style={styles.orderFooterActions}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => {
                setSelectedOrder(item);
                // setDetailsModalVisible(true);
              }}
              activeOpacity={0.8}>
              <Ionicons
                name='eye-outline'
                size={16}
                color={Colors.primary[700]}
              />
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    ),
    [getStatusIcon, getStatusColor, getPriorityColor]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <View style={styles.headerStats}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{filteredOrders.length}</Text>
            <Text style={styles.statsLabel}>
              {statusFilter === 'all' ? 'Total Orders' : 'Filtered Orders'}
            </Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>
              {orders.filter((o) => o.status === 'pending').length}
            </Text>
            <Text style={styles.statsLabel}>Pending</Text>
          </View>
        </View>
      </View>
    ),
    [filteredOrders.length, statusFilter, orders]
  );

  const renderFilterHeader = useCallback(
    () => (
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Order Status</Text>
        <FlatList
          ref={filterScrollRef}
          data={statusFilters}
          renderItem={renderStatusFilter}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          getItemLayout={(data, index) => ({
            length: width < 400 ? 108 : 128, // item width + separator
            offset: (width < 400 ? 108 : 128) * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              filterScrollRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5,
              });
            });
          }}
        />
      </View>
    ),
    [statusFilters, renderStatusFilter]
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <View style={styles.content}>
        <FlatList
          ListHeaderComponent={renderFilterHeader}
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={[
            styles.ordersList,
            filteredOrders.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[Colors.primary[700]]}
              tintColor={Colors.primary[700]}
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIconContainer}>
                <OrderBoxIcon
                  height={80}
                  width={80}
                  fill={Colors.neutral[300]}
                />
              </View>
              <Text style={styles.emptyStateTitle}>No Orders Found</Text>
              <Text style={styles.emptyStateText}>
                {statusFilter === 'all'
                  ? 'No orders have been placed yet.'
                  : `No ${statusFilter} orders at the moment.`}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[25],
  },

  headerContainer: {
    backgroundColor: Colors.white,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    ...Typography.h2,
    marginBottom: 16,
    color: Colors.neutral[900],
  },

  headerStats: {
    flexDirection: 'row',
    gap: 16,
  },

  statsCard: {
    flex: 1,
    backgroundColor: Colors.primary[50],
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  statsNumber: {
    ...Typography.h3,
    color: Colors.primary[700],
    marginBottom: 4,
  },

  statsLabel: {
    ...Typography.caption,
    color: Colors.primary[600],
    textAlign: 'center',
  },

  content: {
    flex: 1,
  },

  filterSection: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    marginBottom: 4,
  },

  filterSectionTitle: {
    ...Typography.h5,
    color: Colors.neutral[900],
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  filtersContainer: {
    maxHeight: 50,
  },

  filtersContent: {
    paddingHorizontal: 20,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    minWidth: width < 400 ? 100 : 120,
    justifyContent: 'center',
  },

  activeFilterChip: {
    backgroundColor: Colors.primary[700],
    borderColor: Colors.primary[700],
    shadowColor: Colors.primary[700],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  filterChipText: {
    ...Typography.bodySmall,
    color: Colors.neutral[700],
    fontFamily: 'Inter-Medium',
    marginRight: 8,
    fontSize: width < 400 ? 11 : 12,
  },

  activeFilterChipText: {
    color: Colors.white,
  },

  filterCount: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  activeFilterCount: {
    backgroundColor: Colors.white,
  },

  filterCountText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[700],
  },

  activeFilterCountText: {
    color: Colors.primary[700],
  },

  ordersList: {
    padding: 20,
    paddingBottom: 40,
  },

  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },

  orderCard: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  orderInfo: {
    flex: 1,
  },

  orderNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  orderNumber: {
    ...Typography.h5,
    marginRight: 12,
    color: Colors.neutral[900],
  },

  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  customerName: {
    ...Typography.body,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
    color: Colors.neutral[800],
  },

  orderDate: {
    ...Typography.caption,
    color: Colors.neutral[600],
  },

  orderActions: {
    alignItems: 'flex-end',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  statusText: {
    ...Typography.caption,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },

  moreButton: {
    padding: 8,
    borderRadius: 8,
  },

  orderItems: {
    marginBottom: 20,
  },

  itemsTitle: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    color: Colors.neutral[900],
  },

  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },

  itemDetails: {
    flex: 1,
  },

  itemName: {
    ...Typography.bodySmall,
    fontFamily: 'Inter-Medium',
    marginBottom: 3,
    color: Colors.neutral[900],
  },

  itemSupplier: {
    ...Typography.caption,
    color: Colors.primary[700],
    marginBottom: 2,
  },

  itemQuantity: {
    ...Typography.caption,
    color: Colors.neutral[600],
  },

  itemPrice: {
    ...Typography.bodySmall,
    fontFamily: 'Inter-SemiBold',
    color: Colors.neutral[900],
  },

  moreItems: {
    ...Typography.caption,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },

  orderTotal: {
    flex: 1,
  },

  totalLabel: {
    ...Typography.caption,
    color: Colors.neutral[600],
    marginBottom: 2,
  },

  totalAmount: {
    ...Typography.h5,
    color: Colors.primary[700],
  },

  orderFooterActions: {
    flexDirection: 'row',
  },

  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },

  viewButtonText: {
    ...Typography.bodySmall,
    color: Colors.primary[700],
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },

  emptyStateIconContainer: {
    backgroundColor: Colors.neutral[50],
    padding: 24,
    borderRadius: 50,
    marginBottom: 24,
  },

  emptyStateTitle: {
    ...Typography.h4,
    marginBottom: 12,
    color: Colors.neutral[900],
  },

  emptyStateText: {
    ...Typography.body,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
});
