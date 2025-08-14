import React, { useState, useEffect, useCallback, useMemo, JSX } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { formatCurrency } from '@/utils/currency';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';
import Card from '@/components/Card';
import {
  ClockIcon,
  ConfirmedIcon,
  LocationIcon,
  MailIcon,
  OrderBoxIcon,
  PhoneIcon,
  TruckDelivered,
  TruckIcon,
  UserIcon,
} from '@/constants/icons';

// Types
interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status: string;
  priority?: string;
  createdAt: string;
  total: number;
  paymentMethod: { name: string };
  shippingAddress: {
    address: string;
    city: string;
    region: string;
    postalCode: string;
  };
  items: Array<{
    name: string;
    supplier: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
}

interface StatusFilter {
  id: string;
  label: string;
  count: number;
}

const { width } = Dimensions.get('window');

const AdminScreen: React.FC = () => {
  const { orders, isLoading, error, updateOrderStatus, deleteOrder, refetch } =
    useSupabaseOrders();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] =
    useState<boolean>(false);
  const [actionModalVisible, setActionModalVisible] = useState<boolean>(false);

  useEffect(() => {
    console.log('Admin screen mounted, total orders:', orders.length);
  }, [orders.length]);

  const statusFilters = useMemo<StatusFilter[]>(
    () => [
      { id: 'all', label: 'All', count: orders.length },
      {
        id: 'pending',
        label: 'Pending',
        count: orders.filter((o) => o.status === 'pending').length,
      },
      {
        id: 'confirmed',
        label: 'Confirmed',
        count: orders.filter((o) => o.status === 'confirmed').length,
      },
      {
        id: 'processing',
        label: 'Processing',
        count: orders.filter((o) => o.status === 'processing').length,
      },
      {
        id: 'shipped',
        label: 'Shipped',
        count: orders.filter((o) => o.status === 'shipped').length,
      },
      {
        id: 'delivered',
        label: 'Delivered',
        count: orders.filter((o) => o.status === 'delivered').length,
      },
    ],
    [orders]
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) => statusFilter === 'all' || order.status === statusFilter
      ),
    [orders, statusFilter]
  );

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

  const getPriorityColor = useCallback(
    (priority: string = 'normal'): string => {
      const colors: Record<string, string> = {
        high: Colors.error[500],
        normal: Colors.primary[500],
        low: Colors.neutral[500],
      };
      return colors[priority] || Colors.neutral[500];
    },
    []
  );

  const handleUpdateOrderStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      try {
        await updateOrderStatus({ orderId, status: newStatus });
        setActionModalVisible(false);
        Alert.alert('Success', `Order status updated to ${newStatus}`);
      } catch {
        Alert.alert('Error', 'Failed to update order status');
      }
    },
    [updateOrderStatus]
  );

  const handleDeleteOrder = useCallback(
    (orderId: string) => {
      Alert.alert(
        'Delete Order',
        'Are you sure you want to delete this order? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteOrder(orderId);
                setActionModalVisible(false);
                Alert.alert('Success', 'Order deleted successfully');
              } catch {
                Alert.alert('Error', 'Failed to delete order');
              }
            },
          },
        ]
      );
    },
    [deleteOrder]
  );

  const renderStatusFilter = useCallback(
    ({ item }: { item: StatusFilter }) => (
      <TouchableOpacity
        style={[
          styles.filterChip,
          statusFilter === item.id && styles.activeFilterChip,
        ]}
        onPress={() => setStatusFilter(item.id)}>
        <Text
          style={[
            styles.filterChipText,
            statusFilter === item.id && styles.activeFilterChipText,
          ]}>
          {item.label}
        </Text>
        <View
          style={[
            styles.filterCount,
            statusFilter === item.id && styles.activeFilterCount,
          ]}>
          <Text
            style={[
              styles.filterCountText,
              statusFilter === item.id && styles.activeFilterCountText,
            ]}>
            {item.count}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [statusFilter]
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
            <View style={styles.statusContainer}>
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
                setActionModalVisible(true);
              }}>
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
                setDetailsModalVisible(true);
              }}>
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

  const renderDetailsModal = useCallback(
    () => (
      <Modal
        visible={detailsModalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setDetailsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setDetailsModalVisible(false)}>
                <Feather name='x' size={24} color={Colors.neutral[800]} />
              </TouchableOpacity>
            </View>
            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>
                    Order Information
                  </Text>
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
                    <MailIcon height={16} fill={Colors.neutral[600]} />
                    <Text style={styles.detailValue}>
                      {selectedOrder.customerEmail ||
                        `customer${selectedOrder.orderNumber.slice(
                          -3
                        )}@email.com`}
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
                  <Text style={styles.detailSectionTitle}>
                    Shipping Address
                  </Text>
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
            )}
          </View>
        </View>
      </Modal>
    ),
    [detailsModalVisible, selectedOrder, getStatusIcon, getStatusColor]
  );

  const renderActionModal = useCallback(
    () => (
      <Modal
        visible={actionModalVisible}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setActionModalVisible(false)}>
        <View style={styles.actionModalOverlay}>
          <View style={styles.actionModalContent}>
            <Text style={styles.actionModalTitle}>Order Actions</Text>
            <Text style={styles.actionModalSubtitle}>
              {selectedOrder?.orderNumber} -{' '}
              {selectedOrder?.customerName ||
                `Customer ${selectedOrder?.orderNumber.slice(-3)}`}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setActionModalVisible(false);
                  setDetailsModalVisible(true);
                }}>
                <Ionicons
                  name='eye-outline'
                  size={20}
                  color={Colors.primary[700]}
                />
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              {selectedOrder?.status === 'pending' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleUpdateOrderStatus(selectedOrder.id, 'confirmed')
                  }>
                  <Ionicons
                    name='checkbox'
                    size={20}
                    color={Colors.success[700]}
                  />
                  <Text style={styles.actionButtonText}>Confirm Order</Text>
                </TouchableOpacity>
              )}
              {selectedOrder?.status === 'confirmed' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleUpdateOrderStatus(selectedOrder.id, 'processing')
                  }
                  // Current file ended abruptly at line 441. I'll continue with the remaining content and complete the file properly.
                >
                  <OrderBoxIcon height={20} fill={Colors.blue[600]} />
                  <Text style={styles.actionButtonText}>Start Processing</Text>
                </TouchableOpacity>
              )}
              {selectedOrder?.status === 'processing' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleUpdateOrderStatus(selectedOrder.id, 'shipped')
                  }>
                  <TruckIcon height={20} fill={Colors.accent[600]} />
                  <Text style={styles.actionButtonText}>Mark as Shipped</Text>
                </TouchableOpacity>
              )}
              {selectedOrder?.status === 'shipped' && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleUpdateOrderStatus(selectedOrder.id, 'delivered')
                  }>
                  <TruckDelivered height={20} fill={Colors.primary[700]} />
                  <Text style={styles.actionButtonText}>Mark as Delivered</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteOrder(selectedOrder?.id)}>
                <Ionicons name='trash' size={20} color={Colors.error[700]} />
                <Text
                  style={[styles.actionButtonText, styles.deleteButtonText]}>
                  Delete Order
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() =>
                  handleUpdateOrderStatus(selectedOrder?.id, 'cancelled')
                }>
                <MaterialCommunityIcons
                  name='cancel'
                  size={20}
                  color={Colors.error[700]}
                />
                <Text
                  style={[styles.actionButtonText, styles.deleteButtonText]}>
                  Cancel Order
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setActionModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    ),
    [
      actionModalVisible,
      selectedOrder,
      handleUpdateOrderStatus,
      handleDeleteOrder,
    ]
  );

  const renderLoadingState = useCallback(
    () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.primary[700]} />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    ),
    []
  );

  const renderErrorState = useCallback(
    () => (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    ),
    [error, refetch]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statsText}>{filteredOrders.length} orders</Text>
        </View>
      </View>
      <FlatList
        data={statusFilters}
        renderItem={renderStatusFilter}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      />
      {isLoading && orders.length === 0 ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
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
              <OrderBoxIcon height={64} fill={Colors.neutral[400]} />
              <Text style={styles.emptyStateTitle}>No Orders Found</Text>
              <Text style={styles.emptyStateText}>
                No orders available for the selected filter
              </Text>
            </View>
          )}
        />
      )}
      {renderDetailsModal()}
      {renderActionModal()}
    </View>
  );
};

// Styles remain unchanged for brevity
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    backgroundColor: Colors.white,
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  title: {
    ...Typography.h3,
    marginBottom: 4,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    ...Typography.body,
    color: Colors.neutral[600],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error[700],
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary[700],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    ...Typography.button,
    fontSize: 14,
  },
  filtersContainer: {
    paddingVertical: 12,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width < 400 ? 8 : 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    // minWidth: width < 400
    height: 40,
    justifyContent: 'center',
  },
  activeFilterChip: {
    backgroundColor: Colors.primary[700],
  },
  filterChipText: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    fontFamily: 'Inter-Medium',
    marginRight: 6,
    fontSize: width < 400 ? 10 : 12,
  },
  activeFilterChipText: {
    color: Colors.white,
  },
  filterCount: {
    backgroundColor: Colors.neutral[200],
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  activeFilterCount: {
    backgroundColor: Colors.white,
  },
  filterCountText: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
    color: Colors.neutral[600],
  },
  activeFilterCountText: {
    color: Colors.primary[700],
  },
  ordersList: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderNumber: {
    ...Typography.h5,
    marginRight: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  customerName: {
    ...Typography.body,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
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
  moreButton: {
    padding: 4,
  },
  orderItems: {
    marginBottom: 16,
  },
  itemsTitle: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    ...Typography.bodySmall,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  itemSupplier: {
    ...Typography.caption,
    color: Colors.primary[700],
    marginBottom: 1,
  },
  itemQuantity: {
    ...Typography.caption,
    color: Colors.neutral[600],
  },
  itemPrice: {
    ...Typography.bodySmall,
    fontFamily: 'Inter-SemiBold',
  },
  moreItems: {
    ...Typography.caption,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  orderTotal: {
    flex: 1,
  },
  totalLabel: {
    ...Typography.caption,
    color: Colors.neutral[600],
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 6,
  },
  viewButtonText: {
    ...Typography.bodySmall,
    color: Colors.primary[700],
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    ...Typography.h4,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    ...Typography.body,
    color: Colors.neutral[600],
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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
    ...Typography.h4,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  modalBody: {
    padding: 24,
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
  actionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  actionModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  actionModalTitle: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: 8,
  },
  actionModalSubtitle: {
    ...Typography.body,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButtons: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.neutral[50],
  },
  actionButtonText: {
    ...Typography.body,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
  },
  deleteButton: {
    backgroundColor: Colors.error[50],
  },
  deleteButtonText: {
    color: Colors.error[700],
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.body,
    color: Colors.neutral[600],
  },
});

export default AdminScreen;
