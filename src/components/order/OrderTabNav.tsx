import { Colors } from '@/constants/Colors';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type OrderStatusType = { id: string; name: string; active: boolean };

type OrderTabProps = {
  orderStatuses: OrderStatusType[];
  activeStatus: string;
  setActiveStatus: (value: string) => void;
};

export default function OrderTabNav({
  orderStatuses,
  activeStatus,
  setActiveStatus,
}: OrderTabProps) {
  const renderItem = ({ item }: { item: OrderStatusType }) => (
    <Pressable
      style={[styles.tab, activeStatus === item.id && styles.activeTab]}
      onPress={() => setActiveStatus(item.id)}>
      <Text
        style={[
          styles.tabText,
          activeStatus === item.id && styles.activeTabText,
        ]}>
        {item.name}
      </Text>
    </Pressable>
  );
  return (
    <View style={styles.statusContainer}>
      <FlatList
        data={orderStatuses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  tabContainer: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    justifyContent: 'space-between',

    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    padding: 16,

    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary[800],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
