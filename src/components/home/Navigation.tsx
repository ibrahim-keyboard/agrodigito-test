import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { mockCategories } from '@/data/mockdata-v2';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

type NavigationProps = {
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
};

export default function NavigationCategories({
  selectedCategory,
  setSelectedCategory,
}: NavigationProps) {
  const renderCategoryTab = ({
    item,
  }: {
    item: { id: string; name: string };
  }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item.id && styles.activeCategoryTab,
      ]}
      onPress={() => setSelectedCategory(item.id)}>
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === item.id && styles.activeCategoryTabText,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.categoryContainer}>
      <FlatList
        data={[{ id: 'all', name: 'All' }, ...mockCategories]}
        renderItem={renderCategoryTab}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    // backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 12,

    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCategoryTab: {
    backgroundColor: Colors.neutral[800],
  },
  categoryTabText: {
    ...Typography.body,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
    fontFamily: 'Inter-Medium',
  },
  activeCategoryTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
