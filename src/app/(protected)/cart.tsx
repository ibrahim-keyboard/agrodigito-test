import { CartItem, useCartStore } from '@/store/cartStore';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import CartItemCard from '@/components/ShoppingCartCard';
import OrderSummaryCard from '@/components/OrderSummaryCard';
import EmptyState from '@/components/EmptyCart';
import { Colors } from '@/constants/Colors';

export default function CartScreen() {
  const {
    items,
    updateQuantity,
    getTotalPrice,
    formatPrice,
    removeItem,
    clearCart,
  } = useCartStore();
  const subtotal = getTotalPrice();

  //const shipping = subtotal > 100000 ? 0 : 15000; // Free shipping over TSh 100,000
  const shipping = 15000;
  const total = subtotal + shipping;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.itemCount}>{items.length} items</Text>
      </View>

      {items.length === 0 ? (
        <EmptyState
          title='Your Cart is Empty'
          description="Looks like you haven't added any items to your cart yet. Start shopping now!"
          actionLabel='Shop Now'
          onAction={() => router.push('/')}
        />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.itemsContainer}>
            {items.map((item: CartItem) => (
              <CartItemCard
                item={item}
                formatPrice={formatPrice}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
                key={item.id}
              />
            ))}
          </View>

          <OrderSummaryCard
            formatPrice={formatPrice}
            shipping={shipping}
            subtotal={subtotal}
            total={total}
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push('/checkout')}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => router.push('/')}>
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
            {items.length > 0 && (
              <TouchableOpacity
                style={styles.clearCartButton}
                onPress={clearCart}>
                <Text style={styles.clearCartText}>Clear Cart</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
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
    backgroundColor: Colors.primary[800],
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
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[900],
    borderWidth: 1,
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

  clearCartButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  clearCartText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
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
