import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, CartItem } from '@/types';

interface CreateOrderData {
  customer_name: string;
  phone: string;
  wilaya_id: number;
  delivery_method: string;
  shipping_cost: number;
  items: CartItem[];
  total_amount: number;
}

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const items = orderData.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        variant: item.variant
      }));

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          phone: orderData.phone,
          wilaya_id: orderData.wilaya_id,
          delivery_method: orderData.delivery_method,
          shipping_cost: orderData.shipping_cost,
          items: items as any,
          total_amount: orderData.total_amount,
          order_number: `LUX-${Date.now()}`
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          wilaya:wilayas(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    }
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(error.message || 'Erreur lors de la suppression de la commande');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};
