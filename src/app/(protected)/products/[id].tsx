import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useCartStore } from '@/store/cartStore';
import { CartIcon } from '@/constants/icons';
import { Image } from 'expo-image';
import { useProduct } from '@/hooks/useProducts';
import LoadingState from '@/components/common/LoadingState';
import CustomAlert from '@/components/CustomAlert';

// Custom Alert Component

type Id = {
  id: string;
};

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<Id>();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>(
    'description'
  );

  // Alert states
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    cancelText: 'Cancel',
    confirmText: 'OK',
    onConfirm: () => {},
    showCancel: true,
  });

  const { data: product, isLoading } = useProduct(id);

  const { addItem } = useCartStore();
  const totalItems = useCartStore((state) => state.items.length);

  const showAlert = (config: {
    title: string;
    message: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
    showCancel?: boolean;
  }) => {
    setAlertConfig({
      visible: true,
      title: config.title,
      message: config.message,
      cancelText: config.cancelText || 'Cancel',
      confirmText: config.confirmText || 'OK',
      onConfirm: config.onConfirm,
      showCancel: config.showCancel !== false,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  // Simulate loading to handle async data fetching
  if (isLoading && !product) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState name='product' />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons
            name='alert-circle-outline'
            size={48}
            color={Colors.neutral[400]}
          />
          <Text style={styles.emptyTitle}>Product Not Found</Text>
          <Text style={styles.emptySubtitle}>
            The requested product is not available.
          </Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const updateQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product.quantityInStock || 0)) {
      setQuantity(newQuantity);
    }
  };

  // Handle direct text input for quantity
  const handleQuantityChange = (text: string) => {
    const numericValue = parseInt(text, 10);

    // If the input is empty or not a number, set to 1
    if (isNaN(numericValue) || text === '') {
      setQuantity(1);
      return;
    }

    // Ensure the quantity is within valid bounds
    if (numericValue >= 1 && numericValue <= (product.quantityInStock || 0)) {
      setQuantity(numericValue);
    } else if (numericValue > (product.quantityInStock || 0)) {
      setQuantity(product.quantityInStock || 1);
    } else if (numericValue < 1) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (!product.stockStatus || product.quantityInStock <= 0) {
      showAlert({
        title: 'Out of Stock',
        message: 'This product is currently out of stock.',
        confirmText: 'OK',
        onConfirm: hideAlert,
        showCancel: false,
      });
      return;
    }

    if (quantity > product.quantityInStock) {
      showAlert({
        title: 'Insufficient Stock',
        message: `Only ${product.quantityInStock} items available. You already have ${quantity} in your cart.`,
        confirmText: 'OK',
        onConfirm: hideAlert,
        showCancel: false,
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price.amount,
      imageUrl: product.img,
      category: product.category,
      quantity,
    });

    showAlert({
      title: 'Added to Cart!',
      message: `${product.name} (Qty: ${quantity}) has been added to your cart.`,
      cancelText: 'Continue Shopping',
      confirmText: 'View Cart',
      onConfirm: () => {
        hideAlert();
        router.push('/cart');
      },
      showCancel: true,
    });

    setQuantity(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color={Colors.neutral[900]} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/cart')}>
            <CartIcon height={24} fill={Colors.neutral[900]} />

            {totalItems > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {/* Product Image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.img }}
            style={styles.productImage}
            contentFit='cover'
          />
          {product.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.brand}>{product.brand}</Text>
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.sku}>SKU: {product.sku}</Text>

          {/* Price and Stock */}
          <View style={styles.priceStockContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {product?.price?.currency}{' '}
                {product.price?.amount.toLocaleString()}
              </Text>
              {product?.discount > 0 && (
                <Text style={styles.originalPrice}>
                  TSh{' '}
                  {(
                    product.price.amount /
                    (1 - product.discount / 100)
                  ).toLocaleString()}
                </Text>
              )}
            </View>
            <View style={styles.stockContainer}>
              <View
                style={[
                  styles.stockDot,
                  {
                    backgroundColor:
                      product.stockStatus === 'In Stock'
                        ? Colors.success[700]
                        : Colors.error[500],
                  },
                ]}
              />
              <Text style={styles.stockText}>
                {product.stockStatus === 'In Stock'
                  ? `In Stock (${product.quantityInStock} available)`
                  : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Size/Weight/Volume */}
          {(product.weight || product.volume || product.capacity) && (
            <View style={styles.sizeContainer}>
              {product.weight && (
                <Text style={styles.sizeText}>Weight: {product.weight}</Text>
              )}
              {product.volume && (
                <Text style={styles.sizeText}>Volume: {product.volume}</Text>
              )}
              {product.capacity && (
                <Text style={styles.sizeText}>
                  Capacity: {product.capacity}
                </Text>
              )}
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <Pressable
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.disabledButton,
                ]}
                onPress={() => updateQuantity(-1)}
                disabled={quantity <= 1}>
                <Ionicons
                  name='remove'
                  size={20}
                  color={
                    quantity <= 1 ? Colors.neutral[400] : Colors.neutral[700]
                  }
                />
              </Pressable>
              <TextInput
                style={styles.quantityText}
                keyboardType='numeric'
                value={quantity.toString()}
                onChangeText={handleQuantityChange}
                onEndEditing={() => {
                  // Ensure we have a valid quantity when user finishes editing
                  if (quantity < 1) {
                    setQuantity(1);
                  } else if (quantity > (product.quantityInStock || 0)) {
                    setQuantity(product.quantityInStock || 1);
                  }
                }}
                selectTextOnFocus={true}
                maxLength={3}
              />
              <Pressable
                style={[
                  styles.quantityButton,
                  quantity >= (product.quantityInStock || 0) &&
                    styles.disabledButton,
                ]}
                onPress={() => updateQuantity(1)}
                disabled={quantity >= (product.quantityInStock || 0)}>
                <Ionicons
                  name='add'
                  size={20}
                  color={
                    quantity >= (product.quantityInStock || 0)
                      ? Colors.neutral[400]
                      : Colors.neutral[700]
                  }
                />
              </Pressable>
            </View>
          </View>

          {/* Key Features */}
          <View style={styles.keyFeaturesSection}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            {product.key_features?.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons
                  name='checkmark-circle-outline'
                  size={16}
                  color={Colors.primary[800]}
                />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <Pressable
              style={[
                styles.tab,
                activeTab === 'description' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('description')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'description' && styles.activeTabText,
                ]}>
                Description
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tab,
                activeTab === 'specifications' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('specifications')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'specifications' && styles.activeTabText,
                ]}>
                Specifications
              </Text>
            </Pressable>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'description' && (
              <View>
                <Text style={styles.description}>{product.description}</Text>
                <Text style={styles.subSectionTitle}>Benefits</Text>
                {product.benefits?.map((benefit, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {benefit}
                  </Text>
                ))}
                <Text style={styles.subSectionTitle}>Usage Instructions</Text>
                {product.usage_instructions?.map((instruction, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {instruction}
                  </Text>
                ))}
              </View>
            )}
            {activeTab === 'specifications' && (
              <View>
                {Object.entries(product.specifications)?.map(([key, value]) => (
                  <View key={key} style={styles.specRow}>
                    <Text style={styles.specKey}>
                      {key
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Text>
                    <Text style={styles.specValue}>
                      {Array.isArray(value) ? value.join(', ') : value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={[
            styles.addToCartButton,
            !product.quantityInStock && styles.disabledAddToCartButton,
          ]}
          onPress={handleAddToCart}
          disabled={!product.quantityInStock}>
          <CartIcon height={20} fill={Colors.white} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
      </View>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        cancelText={alertConfig.cancelText}
        confirmText={alertConfig.confirmText}
        onCancel={hideAlert}
        onConfirm={alertConfig.onConfirm}
        showCancel={alertConfig.showCancel}
        confirmButtonStyle={{ backgroundColor: Colors.primary[800] }}
        cancelButtonStyle={{ backgroundColor: Colors.neutral[100] }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },

  cartBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: Colors.primary[700],
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },

  scrollView: {
    flex: 1,
  },
  imageSection: {
    position: 'relative',
    backgroundColor: Colors.white,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: Colors.error[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  productInfo: {
    padding: 16,
    backgroundColor: Colors.white,
    marginTop: 12,
    borderRadius: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary[700],
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  brand: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
    lineHeight: 32,
    marginBottom: 8,
  },
  sku: {
    fontSize: 12,
    color: Colors.neutral[500],
    marginBottom: 12,
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary[700],
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.neutral[400],
    textDecorationLine: 'line-through',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral[600],
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sizeText: {
    fontSize: 14,
    color: Colors.neutral[600],
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: 12,
  },
  disabledButton: {
    backgroundColor: Colors.neutral[200],
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    paddingHorizontal: 20,
    textAlign: 'center',
    minWidth: 60,
  },
  keyFeaturesSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.neutral[700],
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
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
  tabContent: {
    padding: 16,
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: Colors.neutral[700],
    lineHeight: 24,
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginVertical: 12,
  },
  listItem: {
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
    marginBottom: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  specKey: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[900],
    flex: 1,
    textAlign: 'right',
  },
  bottomBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[800],
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledAddToCartButton: {
    backgroundColor: Colors.neutral[400],
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary[800],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default ProductDetailScreen;
