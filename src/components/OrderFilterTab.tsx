import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface OrderStatus {
  id: string;
  name: string;
}

interface OrderStatusListProps {
  orderStatuses: OrderStatus[];
  activeStatus: string;
  setActiveStatus: (id: string) => void;
}

const OrderStatusList = ({
  orderStatuses,
  activeStatus,
  setActiveStatus,
}: OrderStatusListProps) => {
  return (
    <FlatList
      data={orderStatuses}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.statusButton,
            activeStatus === item.id && styles.activeStatusButton,
          ]}
          onPress={() => setActiveStatus(item.id)}>
          <Text
            style={[
              styles.statusText,
              activeStatus === item.id && styles.activeStatusText,
            ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeStatusButton: {
    backgroundColor: '#10501E',
  },
  statusText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  activeStatusText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default OrderStatusList;
