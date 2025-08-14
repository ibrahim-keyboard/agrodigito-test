import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CartItem } from '@/store/cartStore';
import { Image } from 'expo-image';

type CartItemProps = {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  formatPrice: (amount: number) => string;
  removeItem: (id: string) => void;
};

export default function CartItemCard({
  item,
  formatPrice,
  removeItem,
  updateQuantity,
}: CartItemProps) {
  return (
    <View className='bg-white rounded-lg p-4 shadow-md mb-4'>
      <View style={styles.container}>
        <View style={styles.itemRow}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            contentFit='cover'
          />
          <View style={styles.details}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            style={styles.removeButton}>
            <Feather name='trash-2' size={16} color='#EF4444' />
          </TouchableOpacity>
        </View>

        <View style={styles.quantityRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.quantityButton}>
              <Feather name='minus' size={12} color='#111827' />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.quantityButton}>
              <Feather name='plus' size={12} color='#111827' />
            </TouchableOpacity>
          </View>
          <Text style={styles.totalPrice}>
            {formatPrice(item.price * item.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12, // gap-3
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12, // gap-3
  },
  image: {
    width: 64, // w-16
    height: 64, // h-16
    borderRadius: 8, // rounded-lg
    flexShrink: 0,
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14, // text-sm
    fontWeight: '600', // font-semibold
    color: '#111827', // text-gray-900
    lineHeight: 16, // leading-tight
    marginBottom: 4, // mb-1
  },
  category: {
    fontSize: 12, // text-xs
    color: '#6B7280', // text-gray-500
    marginBottom: 8, // mb-2
  },
  price: {
    fontSize: 16, // text-base
    fontWeight: '700', // font-bold
    color: '#15803D', // text-agro-600 (assumed green)
  },
  removeButton: {
    padding: 4, // p-1
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
  },
  quantityButton: {
    width: 32, // w-8
    height: 32, // h-8
    borderWidth: 1,
    borderColor: '#D1D5DB', // border for outline variant
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    width: 32, // w-8
    textAlign: 'center',
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    color: '#111827',
  },
  totalPrice: {
    fontSize: 18, // text-lg
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
  },
});
