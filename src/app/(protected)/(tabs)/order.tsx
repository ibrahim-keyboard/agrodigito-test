import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import EmptyState from '@/components/EmptyCart';
import {
  ClockIcon,
  ConfirmedIcon,
  OrderBoxIcon,
  OrderTick,
  TruckIcon,
} from '@/constants/icons';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';
import OrderTabNav from '@/components/order/OrderTabNav';
import RenderErrorState from '@/components/common/renderErrorState';
import OrderList from '@/components/order/OrderList';
import LoadingState from '@/components/common/LoadingState';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const orderStatuses = [
  { id: 'all', name: 'All Orders', active: true },
  { id: 'pending', name: 'Pending', active: false },
  { id: 'confirmed', name: 'Confirmed', active: false },
  { id: 'processing', name: 'Processing', active: false },
  { id: 'shipped', name: 'Shipped', active: false },
  { id: 'delivered', name: 'Delivered', active: false },
];

const OrdersScreen = () => {
  const [activeStatus, setActiveStatus] = useState('all');
  const router = useRouter();

  const { orders, isLoading, error, refetch } = useSupabaseOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon height={20} fill={Colors.secondary[500]} />;
      case 'confirmed':
        return <ConfirmedIcon height={20} fill={Colors.success[500]} />;
      case 'processing':
        return <OrderBoxIcon height={20} fill={'#0096c7'} />;
      case 'shipped':
        return <TruckIcon height={20} fill={Colors.accent[500]} />;
      case 'delivered':
        return <OrderTick height={20} fill={Colors.primary[700]} />;
      default:
        return (
          <MaterialCommunityIcons
            name='cancel'
            size={24}
            color={Colors.error[700]}
          />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.secondary[500];
      case 'confirmed':
        return Colors.success[500];
      case 'processing':
        return '#0096c7';
      case 'shipped':
        return Colors.accent[500];
      case 'delivered':
        return Colors.primary[700];
      default:
        return Colors.error[500];
    }
  };

  const filteredOrders =
    activeStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === activeStatus);

  return (
    <SafeAreaView style={styles.container}>
      <OrderTabNav
        activeStatus={activeStatus}
        orderStatuses={orderStatuses}
        setActiveStatus={setActiveStatus}
      />
      {isLoading ? (
        <LoadingState name='orders...' />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          iconName='cube-outline'
          title='No Orders Found'
          description={
            activeStatus === 'all'
              ? "You haven't placed any orders yet. Start shopping now!"
              : `No ${activeStatus} orders found.`
          }
          actionLabel='Shop Now'
          onAction={() => router.push('/')}
        />
      ) : error ? (
        <RenderErrorState error={error} onRefresh={refetch} />
      ) : (
        <OrderList
          LoadingOrders={isLoading}
          filteredOrders={filteredOrders}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          refetch={refetch}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
});

export default OrdersScreen;
