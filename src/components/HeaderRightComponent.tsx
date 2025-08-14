import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useCartStore } from '@/store/cartStore';
import { CartIcon, SearchIcon } from '@/constants/icons';
import { router } from 'expo-router';

export default function HeaderRightComponent() {
  const totalItems = useCartStore((state) => state.items.length);

  return (
    <View className='flex-row items-center gap-4 px-4'>
      <Pressable onPress={() => router.push('/search')}>
        <SearchIcon height={24} fill={'#1F2937'} />
      </Pressable>
      <TouchableOpacity
        className='relative'
        onPress={() => router.push('/cart')}>
        <CartIcon height={24} fill={'#1F2937'} />

        {totalItems > 0 ? (
          <View className='absolute -top-3 -right-2 bg-secondary-300 rounded-full h-6 w-6 justify-center items-center'>
            <Text className=' text-primary-700 text-nowrap font-extrabold text-sm '>
              {totalItems}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}
