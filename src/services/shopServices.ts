import { supabase } from '@/utils/supabase';

export async function getShopAddress(userId: string) {
  const { data, error } = await supabase
    .from('shop_address')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

type ShopAddressType = {
  shopName: string;
  region: string;
  district: string;
  streetArea: string;
  shopType: string;
  shopSize: string;
  userId: string;
};

export async function addShopAddressWithAuth({
  district,
  region,
  shopName,
  shopSize,
  shopType,
  streetArea,
  userId,
}: ShopAddressType) {
  try {
    const { data: insertedData, error } = await supabase
      .from('shop_address')
      .insert([
        {
          user_id: userId, // If you have user authentication
          shop_name: shopName,
          region: region,
          district: district,
          street: streetArea,
          shop_type: shopType,
          shop_size: shopSize,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Failed to save shop details');
    }

    return {
      success: true,
      message: 'Shop details saved successfully',
      data: insertedData[0],
    };
  } catch (error) {
    console.error('Error saving shop details:', error);
    throw error;
  }
}

// Alternative: Insert with specific user ID if you have authentication
// export const saveShopDetailsWithAuth = async (
//   data: ShopFormData,
//   userId: string
// ): Promise<{ success: boolean; message: string }> => {
//   try {
//     const { data: insertedData, error } = await supabase
//       .from('shop_address')
//       .insert([
//         {
//           user_id: userId, // If you have user authentication
//           shop_name: data.shopName,
//           region: data.region,
//           district: data.district,
//           street_area: data.streetArea,
//           shop_type: data.shopType,
//           shop_size: data.shopSize,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         },
//       ])
//       .select();

//     if (error) {
//       console.error('Supabase error:', error);
//       throw new Error(error.message || 'Failed to save shop details');
//     }

//     return {
//       success: true,
//       message: 'Shop details saved successfully',
//       data: insertedData[0],
//     };
//   } catch (error) {
//     console.error('Error saving shop details:', error);
//     throw error;
//   }
// };

// Example table schema for reference
/*
CREATE TABLE shop_address (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  shop_name TEXT NOT NULL,
  region TEXT NOT NULL,
  district TEXT NOT NULL,
  street_area TEXT NOT NULL,
  shop_type TEXT NOT NULL,
  shop_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/
