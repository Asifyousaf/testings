
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, XIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user is admin
        if (currentUser.email === 'asif1@gmail.com') {
          setIsAdmin(true);
        }
        
        // Fetch subscription data if available
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('active', true)
          .maybeSingle();
          
        if (data && !error) {
          setUserSubscription(data);
        }
      }
      setLoading(false);
    };
    
    getUser();
  }, []);

  const handleSubscribe = async (planId: number, price: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      // Mock payment process - in a real app, redirect to payment gateway
      const today = new Date();
      const expiryDate = new Date();
      expiryDate.setMonth(today.getMonth() + 1); // 1 month subscription
      
      const subscriptionData = {
        user_id: user.id,
        tier: `plan-${planId}`,
        active: true,
        expires_at: expiryDate.toISOString(),
      };
      
      // Check if subscription already exists for this user
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (existingSub) {
        // Update existing subscription
        await supabase
          .from('subscriptions')
          .update(subscriptionData)
          .eq('id', existingSub.id);
      } else {
        // Create new subscription
        await supabase
          .from('subscriptions')
          .insert(subscriptionData);
      }
      
      // Update local state
      setUserSubscription({
        ...subscriptionData,
        id: existingSub?.id || null,
      });
      
      toast({
        title: "Subscription Successful",
        description: "You have successfully subscribed to the plan",
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const cancelSubscription = async () => {
    try {
      await supabase
        .from('subscriptions')
        .update({ active: false })
        .eq('user_id', user.id);
        
      setUserSubscription({...userSubscription, active: false});
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled",
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const renderFeatureCheck = (included: boolean) => (
    <span className={`flex items-center ${included ? 'text-green-600' : 'text-gray-400'}`}>
      {included ? (
        <CheckIcon className="h-5 w-5 mr-1" />
      ) : (
        <XIcon className="h-5 w-5 mr-1" />
      )}
    </span>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">WellnessAI Subscription Plans</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to enhance your wellness journey with premium AI workout plans and nutrition advice.
          </p>
        </div>
        
        {isAdmin && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-800">Admin Access</h3>
                <p className="text-blue-600 text-sm">You have admin privileges with full access to all features</p>
              </div>
              <Badge className="bg-blue-600">Admin</Badge>
            </div>
          </div>
        )}
        
        {userSubscription && userSubscription.active && !isAdmin && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-800">Active Subscription</h3>
                <p className="text-green-600 text-sm">
                  Your subscription is active until {new Date(userSubscription.expires_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={cancelSubscription}>
                Cancel Subscription
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Basic access with limited AI features</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">0</span>
                <span className="text-gray-500 ml-1">AED</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>AI Chat Assistance</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>AI Requests</span>
                <span className="text-gray-500">4 per month</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Basic Workouts</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Basic Recipes</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Community Access</span>
                {renderFeatureCheck(true)}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Current Plan</Button>
            </CardFooter>
          </Card>

          {/* Basic Plan */}
          <Card className="border-2 border-purple-400 hover:shadow-lg transition-all duration-300 relative">
            <div className="absolute -top-3 left-0 right-0 flex justify-center">
              <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600">MOST POPULAR</Badge>
            </div>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>Enhanced features for regular users</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">20.99</span>
                <span className="text-gray-500 ml-1">AED/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>AI Chat Assistance</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>AI Requests</span>
                <span className="text-gray-500">20 per month</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Custom Workout Plans</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Premium Recipe Collection</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Progress Tracking</span>
                {renderFeatureCheck(true)}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                onClick={() => handleSubscribe(2, 20.99)}
                disabled={loading || (userSubscription?.active) || isAdmin}
              >
                {loading ? 'Processing...' : ((userSubscription?.active) || isAdmin) ? 'Active' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <CardDescription>Full access to all premium features</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">50.99</span>
                <span className="text-gray-500 ml-1">AED/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>AI Chat Assistance</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>AI Requests</span>
                <span className="text-green-500 font-medium">Unlimited</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Custom Workout Generation</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Premium Recipe Collection</span>
                {renderFeatureCheck(true)}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Advanced Analytics</span>
                {renderFeatureCheck(true)}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => handleSubscribe(3, 50.99)}
                disabled={loading || (userSubscription?.active) || isAdmin}
              >
                {loading ? 'Processing...' : ((userSubscription?.active) || isAdmin) ? 'Active' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Subscription Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-600 mr-2 mt-1" />
              <div>
                <h4 className="font-medium">Unlimited AI-Generated Workout Plans</h4>
                <p className="text-gray-600 text-sm">Create personalized workout plans tailored to your goals without limits</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-600 mr-2 mt-1" />
              <div>
                <h4 className="font-medium">Premium Nutrition Recipes</h4>
                <p className="text-gray-600 text-sm">Access our complete database of nutritionist-approved recipes</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-600 mr-2 mt-1" />
              <div>
                <h4 className="font-medium">Advanced Progress Tracking</h4>
                <p className="text-gray-600 text-sm">Track your fitness journey with detailed analytics and insights</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-600 mr-2 mt-1" />
              <div>
                <h4 className="font-medium">Priority AI Chat Support</h4>
                <p className="text-gray-600 text-sm">Get faster responses and more detailed guidance from our AI assistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
