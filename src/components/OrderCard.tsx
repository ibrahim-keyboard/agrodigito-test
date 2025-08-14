import { View, Text } from 'react-native';
import {Colors} from '@/constants/Colors';

export default function OrderCard() {
  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  itemsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  totalPrice: {
    marginTop: 4,
  },
  totalPriceText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    minWidth: 40,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 16,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  checkoutButton: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  continueShoppingButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueShoppingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  bottomSpacing: {
    height: 32,
  },

  card: {
    backgroundColor: '#F7FAFC', // bg-gray-50
    borderRadius: 8, // rounded-lg
    padding: 16, // p-4 (sm:p-6)
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  cardtitle: {
    fontSize: 20, // text-lg (sm:text-xl)
    fontWeight: '600', // font-semibold
    color: '#111827', // text-gray-900
    marginBottom: 16, // mb-4
  },
  cardcontent: {
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
  cardtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // flex justify-between
  },
  cardtotalLabel: {
    fontSize: 18, // text-lg
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
  },
  cardtotalValue: {
    fontSize: 18, // text-lg
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
  },
});
