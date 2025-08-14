import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { mockCategories } from '@/data/mockdata-v2';
import EmptyState from '@/components/EmptyCart';
import { useProducts } from '@/hooks/useProducts';
import NavigationCategories from '@/components/home/Navigation';
import ProductListing from '@/components/home/ProductListing';
import RenderErrorState from '@/components/common/renderErrorState';
import LoadingState from '@/components/common/LoadingState';
import { Image } from 'expo-image';
import { images } from '@/constants/images';
import HeaderRightComponent from '@/components/HeaderRightComponent';

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: products, isLoading, refetch, error } = useProducts();

  if (isLoading && !products) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState name='products' />
      </SafeAreaView>
    );
  }

  const filteredData =
    selectedCategory === 'all'
      ? products
      : products?.filter((item) => item.categoryId === selectedCategory);

  return (
    <SafeAreaView>
      <View className='flex-row justify-between mt-2 items-center'>
        <Image
          source={images.logo2}
          contentFit='cover'
          style={{ width: 150, height: 50 }}
        />

        <HeaderRightComponent />
      </View>
      <NavigationCategories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {products?.length === 0 ? (
        <EmptyState
          iconName='cube-outline'
          title='No Products Available'
          description={
            selectedCategory === 'all'
              ? "We're currently out of stock. Check back soon for new products!"
              : `No products found in ${
                  mockCategories.find((c) => c.id === selectedCategory)?.name ||
                  'this category'
                }.`
          }
          actionLabel='Browse All'
          onAction={() => setSelectedCategory('all')}
        />
      ) : error ? (
        <RenderErrorState error={error} onRefresh={refetch} />
      ) : (
        <ProductListing
          LoadingProduct={isLoading}
          refetch={refetch}
          filteredData={filteredData!}
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

  cartBadge: {
    backgroundColor: Colors.primary[800],
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
});

export default HomeScreen;
