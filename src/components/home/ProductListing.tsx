import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Product } from '@/type/product';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

type ProductListingProps = {
  filteredData: Product[];
  LoadingProduct: boolean;
  refetch: () => void;
};

export default function ProductListing({
  filteredData,
  LoadingProduct,
  refetch,
}: ProductListingProps) {
  const renderProductCard = ({ item }: { item: Product }) => (
    <Pressable
      style={styles.productCard}
      onPress={() => router.push(`/products/${item.id}`)}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.img }}
          style={styles.productImage}
          contentFit='cover'
        />
      </View>
      <View style={styles.productInfo}>
        <View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productBrand}>{item.brand}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              TSh {item.price.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={filteredData}
      renderItem={renderProductCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      refreshControl={
        <RefreshControl
          refreshing={LoadingProduct}
          onRefresh={refetch}
          colors={[Colors.primary[700]]}
          tintColor={Colors.primary[700]}
        />
      }
      columnWrapperStyle={styles.columnWrapper}
      initialNumToRender={6}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  discountText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  productInfo: {
    padding: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary[50],
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.primary[800],
    fontWeight: '500',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[900],
    lineHeight: 18,
    marginBottom: 4,
  },

  productBrand: {
    ...Typography.caption,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary[700],
  },
});
