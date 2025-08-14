import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Product } from '@/type/product';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import EmptyState from '@/components/EmptyCart';
import LoadingState from '@/components/common/LoadingState';
import { useProducts } from '@/hooks/useProducts';
import { FlashList } from '@shopify/flash-list';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: products } = useProducts();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const filtered = products!.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [products, searchQuery]);

  const renderProduct = ({ item: product }: { item: Product }) => (
    <Pressable
      style={styles.productCard}
      onPress={() => {
        // Navigate to product details (implement as needed)
        router.push(`/products/${product.id}`);
      }}>
      <Image
        source={product.img}
        style={styles.productImage}
        contentFit='cover'
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productPrice}>
          {product.price.currency} {product.price.amount.toLocaleString()}
        </Text>
      </View>
      {/* <Pressable style={styles.addButton}>
        <Ionicons name='cart-outline' size={20} color={Colors.white} />
      </Pressable> */}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name='search-outline'
            size={20}
            color={Colors.neutral[400]}
            style={styles.searchIcon}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback>
              <TextInput
                style={styles.searchInput}
                placeholder='Search products, categories, or tags...'
                placeholderTextColor={Colors.neutral[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType='search'
              />
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <Ionicons
                name='close-circle'
                size={20}
                color={Colors.neutral[900]}
              />
            </Pressable>
          )}
        </View>
      </View>

      {isLoading ? (
        <LoadingState name='products' />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No Results Found' : 'Start Searching'}
          description={
            searchQuery
              ? `No products match "${searchQuery}". Try different keywords.`
              : 'Enter a product name, category, or tag to find what you need.'
          }
        />
      ) : (
        <FlashList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral[900],
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    lineHeight: 20,
  },
  productCategory: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[700],
    marginTop: 4,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.neutral[600],
  },
  addButton: {
    backgroundColor: Colors.primary[800],
    borderRadius: 8,
    padding: 8,
    alignSelf: 'flex-end',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.neutral[100],
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});

export default SearchScreen;
