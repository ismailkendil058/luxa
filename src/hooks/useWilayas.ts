import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Wilaya } from '@/types';

export const useWilayas = () => {
  return useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wilayas')
        .select('*')
        .eq('is_active', true)
        .order('code', { ascending: true });
      
      if (error) throw error;
      return data as Wilaya[];
    }
  });
};

export const useUpdateWilaya = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number; shipping_bureau?: number; shipping_domicile?: number }) => {
      const { data, error } = await supabase
        .from('wilayas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wilayas'] });
    }
  });
};
