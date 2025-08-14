import { View, Text, StyleSheet } from 'react-native';

type OrderSummaryCardProps = {
  subtotal: number;
  shipping: number;
  total: number;
  formatPrice: (amount: number) => string;
};

export default function OrderSummaryCard({
  subtotal,
  shipping,
  total,
  formatPrice,
}: OrderSummaryCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Order Summary</Text>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping</Text>
            <Text style={styles.value}>
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </Text>
          </View>
          {shipping === 0 && (
            <Text style={styles.freeShipping}>
              ✓ Free shipping on orders over TSh 100,000
            </Text>
          )}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Equivalent to lg:col-span-1, takes available space
  },
  card: {
    backgroundColor: '#Ffff', // bg-gray-50
    borderRadius: 8, // rounded-lg
    padding: 16, // p-4 (sm:p-6)
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  title: {
    fontSize: 20, // text-lg (sm:text-xl)
    fontWeight: '600', // font-semibold
    color: '#111827', // text-gray-900
    marginBottom: 16, // mb-4
  },
  content: {
    gap: 12, // space-y-3
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // flex justify-between
  },
  label: {
    color: '#4B5563', // text-gray-600
    fontSize: 16,
  },
  value: {
    fontWeight: '500', // font-medium
    fontSize: 16,
  },
  freeShipping: {
    color: '#15803D', // text-green-600
    fontSize: 14, // text-sm
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB', // Equivalent to hr with gray border
    marginVertical: 16, // my-4
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // flex justify-between
  },
  totalLabel: {
    fontSize: 18, // text-lg
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
  },
  totalValue: {
    fontSize: 18, // text-lg
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
  },
});
