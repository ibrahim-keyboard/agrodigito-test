import { supabase } from '@/utils/supabase';
import { Order, ShippingAddress, ShippingMethod } from '@/type/ecommerce';
import { CartItem } from '@/store/cartStore';
import { User } from '@supabase/supabase-js';

type PaymentMethod = {
  id: string;
  name: string;
};

// Database types
interface OrderDB {
  id: string;
  order_number: string;
  status: string;
  customer_name?: string;
  customer_phone?: string;
  user_id?: string; // Add user_id field
  items: any; // JSONB array
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  shipping_address: any;
  payment_method: any;
  shipping_method: any;
  discount_code?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  notes?: string;
  priority?: string;
  created_at: string;
  updated_at: string;
}

// Transform database order to app order format
const transformOrder = (dbOrder: OrderDB): Order => {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    status: dbOrder.status as Order['status'],
    items: dbOrder.items || [],
    subtotal: dbOrder.subtotal,
    tax: dbOrder.tax,
    shippingCost: dbOrder.shipping_cost,
    discountAmount: dbOrder.discount_amount,
    total: dbOrder.total,
    shippingAddress: dbOrder.shipping_address,
    paymentMethod: dbOrder.payment_method,
    shippingMethod: dbOrder.shipping_method,
    discountCode: dbOrder.discount_code,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    estimatedDelivery: dbOrder.estimated_delivery,
    trackingNumber: dbOrder.tracking_number,
    notes: dbOrder.notes,
    customerName: dbOrder.customer_name,
    customerPhone: dbOrder.customer_phone,
    priority: dbOrder.priority as Order['priority'],
    userId: dbOrder.user_id, // Add userId to Order type
  };
};

// Create a new order
export async function createOrder(
  items: CartItem[],
  paymentMethod: PaymentMethod,
  shippingAddress: ShippingAddress,
  shippingMethod: ShippingMethod,
  user: User | null,
  summary: {
    subtotal: number;
    tax?: number;
    shippingCost: number;
    discountAmount?: number;
    total: number;
  },
  discountCode?: string
): Promise<Order> {
  try {
    // Generate order number
    const { data: orderNumberData, error: orderNumberError } =
      await supabase.rpc('generate_order_number');

    if (orderNumberError) {
      throw orderNumberError;
    }

    const orderNumber = orderNumberData;

    // Get user info from auth store
    if (!user) {
      throw new Error('User must be authenticated to place an order');
    }

    const customerName = shippingAddress.fullName;

    const customerPhone = shippingAddress.phone;

    // Calculate estimated delivery
    const estimatedDays = parseInt(
      shippingMethod.estimatedDays.split('-')[1] ||
        shippingMethod.estimatedDays.split(' ')[0]
    );
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays);

    // Create order with user_id
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: 'pending',
        user_id: user.id, // ✅ Associate order with user
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items,
        subtotal: summary.subtotal,
        tax: summary.tax,
        shipping_cost: summary.shippingCost,
        discount_amount: summary.discountAmount,
        total: summary.total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        discount_code: discountCode,
        estimated_delivery: null,
        priority: 'normal',
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    return transformOrder(orderData);
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order> {
  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      throw orderError;
    }

    return transformOrder(orderData);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    throw error;
  }
}

// Get all orders (for admin)
export async function getAllOrders(): Promise<Order[]> {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    return ordersData.map(transformOrder);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
}

// Get orders for current user only
export async function getUserOrders(): Promise<Order[]> {
  try {
    const user = await (await supabase.auth.getUser()).data.user;
    if (!user) {
      throw new Error('User must be authenticated to view orders');
    }

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id) // ✅ Filter by user_id
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    return ordersData.map(transformOrder);
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  note?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}

// Delete order
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete order:', error);
    throw error;
  }
}

// Get orders by status
export async function getOrdersByStatus(
  status: Order['status']
): Promise<Order[]> {
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    return ordersData.map(transformOrder);
  } catch (error) {
    console.error('Failed to fetch orders by status:', error);
    throw error;
  }
}

// Get orders by status for current user
export async function getUserOrdersByStatus(
  status: Order['status']
): Promise<Order[]> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      throw new Error('User must be authenticated to view orders');
    }

    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id) // ✅ Filter by user_id
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    return ordersData.map(transformOrder);
  } catch (error) {
    console.error('Failed to fetch user orders by status:', error);
    throw error;
  }
}
