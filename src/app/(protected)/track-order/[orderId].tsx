import { router, useLocalSearchParams } from 'expo-router';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '@/hooks/useSupabaseOrders';

import {
  CalendarIcon,
  ClockIcon,
  ConfirmedIcon,
  FileDocIcon,
  HomeIcon,
  OrderBoxIcon,
  TruckDelivered,
  TruckIcon,
} from '@/constants/icons';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';
import RenderErrorState from '@/components/common/renderErrorState';
import Card from '@/components/Card';
import { formatCurrency } from '@/utils/currency';
import Button from '@/components/common/Button';
import LoadingState from '@/components/common/LoadingState';
import { formatTimestamp } from '@/utils/date';

const getStatusMessage = (status: string) => {
  const messages = {
    pending: {
      title: 'Order Awaiting Confirmation',
      message:
        'Your order is waiting to be confirmed by our team. You will receive an update once confirmed.',
      color: Colors.warning[500],
    },
    confirmed: {
      title: 'Order Confirmed',
      message:
        'Great! Your order has been confirmed and is now being prepared.',
      color: Colors.success[500],
    },
    processing: {
      title: 'Order Being Prepared',
      message:
        'Your order is currently being processed and will be ready for shipment soon.',
      color: Colors.blue[500],
    },
    shipped: {
      title: 'Order Out for Delivery',
      message: 'Your order is on its way! Track the delivery progress below.',
      color: Colors.accent[700],
    },
    delivered: {
      title: 'Order Delivered',
      message:
        'Your order has been successfully delivered. Thank you for shopping with us!',
      color: Colors.primary[500],
    },
    cancelled: {
      title: 'Order Cancelled',
      message:
        'This order has been cancelled. If you have any questions, please contact support.',
      color: Colors.error[500],
    },
  };

  return (
    messages[status] || {
      title: 'Order Status',
      message: 'Track your order progress below.',
      color: Colors.neutral[600],
    }
  );
};

export default function TrackOrderByIDScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const { data: order, isLoading, error, refetch } = useOrder(orderId);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return formatTimestamp(timestamp);
  };

  const getStepData = (step) => {
    const statusOrder = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
    ];
    const currentStatusIndex = statusOrder!.indexOf(order?.status);
    const stepIndex = statusOrder!.indexOf(step.status);

    let completed = false;
    let current = false;
    let timestamp = '';
    let relativeTime = '';

    if (step.cancelled) {
      // Cancelled step
      completed = true;
      timestamp = order ? formatTimestamp(order!.updatedAt) : 'Recently';
      relativeTime = order ? getRelativeTime(order!.updatedAt) : '';
    } else if (stepIndex <= currentStatusIndex) {
      // Step has been completed
      completed = true;
      if (stepIndex === currentStatusIndex) {
        current = true;
        timestamp = order ? formatTimestamp(order!.updatedAt) : 'In progress';
        relativeTime = order
          ? getRelativeTime(order!.updatedAt)
          : 'Current step';
      } else {
        // Previous completed step
        timestamp = order ? formatTimestamp(order!.createdAt) : 'Completed';
        relativeTime = order ? getRelativeTime(order!.createdAt) : '';
      }
    } else {
      // Future step
      timestamp = 'Pending';
      relativeTime = '';
    }

    return {
      ...step,
      completed,
      current,
      timestamp,
      relativeTime,
    };
  };

  const generateTimelineSteps = () => {
    const baseSteps = [
      {
        status: 'pending',
        title: 'Order Placed',
        description:
          'Your order has been received and is awaiting confirmation',
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and approved',
      },
      {
        status: 'processing',
        title: 'Order Processing',
        description: 'Your order is being prepared and packed',
      },
      {
        status: 'shipped',
        title: 'Out for Delivery',
        description: 'Your order is on its way to you',
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been successfully delivered',
      },
    ];

    // If order is cancelled, show only the steps up to cancellation
    if (order?.status === 'cancelled') {
      const cancelledStep = {
        status: 'cancelled',
        title: 'Order Cancelled',
        description: 'Your order has been cancelled',
        // icon: AlertCircle,
        cancelled: true,
      };

      return [
        baseSteps[0], // Always show order placed
        cancelledStep,
      ];
    }

    return baseSteps;
  };

  const statusInfo = getStatusMessage(order?.status);
  const timelineSteps = generateTimelineSteps();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <CalendarIcon height={24} fill={Colors.neutral[700]} />
        </TouchableOpacity>
        <Text style={styles.title}>Track Order</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <LoadingState name='track order' />
      ) : error ? (
        <RenderErrorState error={error} onRefresh={refetch} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={[Colors.primary[700]]}
              tintColor={Colors.primary[700]}
            />
          }>
          <Card style={styles.orderInfo}>
            <Text style={styles.orderNumber}>Order #{order?.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {formatTimestamp(order!.createdAt)}
            </Text>

            <Text style={styles.orderTotal}>
              Total: {formatCurrency(order!.total)}
            </Text>
          </Card>

          <Card
            style={[styles.statusCard, { borderLeftColor: statusInfo.color }]}>
            <View style={styles.statusHeader}>
              <View
                style={[
                  styles.statusIcon,
                  { backgroundColor: statusInfo.color },
                ]}>
                {order!.status === 'cancelled' ? (
                  <Feather name='alert-circle' size={20} color={Colors.white} />
                ) : order!.status === 'delivered' ? (
                  <Feather name='check-circle' size={20} color={Colors.white} />
                ) : (
                  <ClockIcon height={20} fill={Colors.white} />
                )}
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>{statusInfo.title}</Text>
                <Text style={styles.statusMessage}>{statusInfo.message}</Text>
                {order && (
                  <Text style={styles.lastUpdated}>
                    Last updated: {getRelativeTime(order!.updatedAt)}
                  </Text>
                )}
              </View>
            </View>
          </Card>

          <View style={styles.timeline}>
            <Text style={styles.timelineTitle}>Order Progress</Text>
          </View>
          {timelineSteps.map((step, index) => {
            const stepData = getStepData(step);

            return (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineIcon,
                      stepData.completed && styles.timelineIconCompleted,
                      stepData.current && styles.timelineIconCurrent,
                      step.cancelled && styles.timelineIconCancelled,
                    ]}>
                    {step.status === 'pending' ? (
                      <FileDocIcon
                        height={20}
                        fill={
                          stepData.completed || stepData.current
                            ? Colors.white
                            : Colors.neutral[400]
                        }
                      />
                    ) : step.status === 'confirmed' ? (
                      <ConfirmedIcon
                        height={20}
                        fill={
                          stepData.completed || stepData.current
                            ? Colors.white
                            : Colors.neutral[400]
                        }
                      />
                    ) : step.status === 'processing' ? (
                      <OrderBoxIcon
                        height={20}
                        fill={
                          stepData.completed || stepData.current
                            ? Colors.white
                            : Colors.neutral[400]
                        }
                      />
                    ) : step.status === 'shipped' ? (
                      <TruckIcon
                        height={20}
                        fill={
                          stepData.completed || stepData.current
                            ? Colors.white
                            : Colors.neutral[400]
                        }
                      />
                    ) : step.status === 'delivered' ? (
                      <TruckDelivered
                        height={20}
                        fill={
                          stepData.completed || stepData.current
                            ? Colors.white
                            : Colors.neutral[400]
                        }
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name='cancel'
                        size={20}
                        color={Colors.error[100]}
                      />
                    )}
                  </View>
                  {index < timelineSteps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        stepData.completed &&
                          !step.cancelled &&
                          styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineStepTitle,
                      stepData.current && styles.currentStepTitle,
                      step.cancelled && styles.cancelledStepTitle,
                      stepData.completed &&
                        !stepData.current &&
                        !step.cancelled &&
                        styles.completedStepTitle,
                    ]}>
                    {stepData.title}
                  </Text>
                  <Text
                    style={[
                      styles.timelineDescription,
                      stepData.current && styles.currentStepDescription,
                      stepData.completed &&
                        !stepData.current &&
                        !step.cancelled &&
                        styles.completedStepDescription,
                    ]}>
                    {stepData.description}
                  </Text>
                  <View style={styles.timelineTimestamps}>
                    <Text
                      style={[
                        styles.timelineDate,
                        stepData.completed && styles.completedTimelineDate,
                      ]}>
                      {stepData.timestamp}
                    </Text>
                    {stepData.relativeTime && (
                      <Text
                        style={[
                          styles.timelineRelative,
                          stepData.completed &&
                            styles.completedTimelineRelative,
                        ]}>
                        ({stepData.relativeTime})
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <Button
          title='View Order Details'
          onPress={() => router.push('/(protected)/(tabs)/order')}
          leftIcon={<OrderBoxIcon height={20} fill={Colors.white} />}
          style={styles.orderButton}
        />
        <Button
          title='Continue Shopping'
          onPress={() => router.push('/(protected)/(tabs)')}
          variant='outline'
          leftIcon={<HomeIcon height={20} fill={Colors.primary[700]} />}
          style={styles.homeButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },

  retryButton: {
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    padding: 4,
  },
  title: {
    ...Typography.h4,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  orderInfo: {
    marginBottom: 16,
  },
  orderNumber: {
    ...Typography.h5,
    marginBottom: 4,
  },
  orderDate: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginBottom: 4,
  },
  orderTotal: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary[700],
  },
  statusCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    paddingLeft: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    ...Typography.h5,
    marginBottom: 4,
  },
  statusMessage: {
    ...Typography.body,
    color: Colors.neutral[600],
    lineHeight: 20,
    marginBottom: 4,
  },
  lastUpdated: {
    ...Typography.caption,
    color: Colors.neutral[500],
    fontStyle: 'italic',
  },
  deliveryInfo: {
    marginBottom: 24,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryTitle: {
    ...Typography.h5,
    marginLeft: 8,
  },
  addressName: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  address: {
    ...Typography.body,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  timeline: {
    paddingTop: 8,
    marginBottom: 24,
  },
  timelineTitle: {
    ...Typography.h5,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: Colors.primary[700],
  },
  timelineIconCurrent: {
    backgroundColor: Colors.primary[600],
  },
  timelineIconCancelled: {
    backgroundColor: Colors.error[500],
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.neutral[200],
    marginVertical: 8,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.primary[700],
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 24,
  },
  timelineStepTitle: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    color: Colors.neutral[500],
  },
  currentStepTitle: {
    color: Colors.primary[600],
  },
  cancelledStepTitle: {
    color: Colors.error[700],
  },
  completedStepTitle: {
    color: Colors.primary[700],
  },
  timelineDescription: {
    ...Typography.body,
    color: Colors.neutral[500],
    marginBottom: 6,
    lineHeight: 20,
  },
  currentStepDescription: {
    color: Colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
  completedStepDescription: {
    color: Colors.neutral[600],
  },
  timelineTimestamps: {
    flexDirection: 'column',
  },
  timelineDate: {
    ...Typography.caption,
    color: Colors.neutral[500],
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  completedTimelineDate: {
    color: Colors.neutral[700],
  },
  timelineRelative: {
    ...Typography.caption,
    color: Colors.neutral[400],
    fontSize: 10,
  },
  completedTimelineRelative: {
    color: Colors.neutral[500],
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
    paddingBottom: 32,
  },
  orderButton: {
    marginBottom: 12,
  },
  homeButton: {
    marginBottom: 0,
  },
});
