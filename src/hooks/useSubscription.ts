
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'none';

export interface Subscription {
  id: string;
  plan_id: number;
  amount_paid: number;
  currency: string;
  started_at: string;
  expires_at: string;
  status: SubscriptionStatus;
  payment_method?: string;
}

export interface SubscriptionHook {
  subscription: Subscription | null;
  isLoading: boolean;
  isSubscribed: boolean;
  isAdmin: boolean;
  error: Error | null;
  refreshSubscription: () => Promise<void>;
}

export const useSubscription = (): SubscriptionHook => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the current user
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setSubscription(null);
        setIsAdmin(false);
        return;
      }

      // Check if user is admin
      if (user.email === 'asif1@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      // Fetch subscription data from the subscriptions table directly
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        // Check if subscription is expired
        const expiryDate = new Date(data.expires_at);
        const now = new Date();
        
        if (expiryDate < now && data.active) {
          // Subscription has expired, update status
          await supabase
            .from('subscriptions')
            .update({ active: false })
            .eq('id', data.id);
          
          // Format as our internal subscription type
          setSubscription({
            id: data.id,
            plan_id: parseInt(data.tier.split('-')[1] || '1'), // Extract plan ID from tier
            amount_paid: 0, // Default value
            currency: 'AED', // Default value
            started_at: data.created_at,
            expires_at: data.expires_at,
            status: 'expired',
            payment_method: 'card' // Default value
          });
        } else {
          // Format as our internal subscription type
          setSubscription({
            id: data.id,
            plan_id: parseInt(data.tier.split('-')[1] || '1'), // Extract plan ID from tier
            amount_paid: 0, // Default value
            currency: 'AED', // Default value
            started_at: data.created_at,
            expires_at: data.expires_at,
            status: data.active ? 'active' : 'expired',
            payment_method: 'card' // Default value
          });
        }
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();

    // Subscribe to auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(() => {
      fetchSubscription();
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, []);

  return {
    subscription,
    isLoading,
    isSubscribed: isAdmin || (subscription?.status === 'active'),
    isAdmin,
    error,
    refreshSubscription: fetchSubscription
  };
};
