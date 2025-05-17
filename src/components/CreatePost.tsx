import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Image, Smile, MapPin, User, X, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface CreatePostProps {
  onPost: (content: string, image?: string) => void;
  userAvatar?: string;
}

const CreatePost = ({ onPost, userAvatar }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    avatar: string | null;
  } | null>(null);

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', data.session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
          }
              
          setCurrentUser({
            id: data.session.user.id,
            name: profileData?.full_name || data.session.user.email?.split('@')[0] || 'User',
            avatar: profileData?.avatar_url || null
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handlePost = async () => {
    if (content.trim() === '') {
      toast({
        title: "Cannot post",
        description: "Please write something before posting",
        variant: "destructive"
      });
      return;
    }
    
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      toast({
        title: "Login Required",
        description: "Please sign in to create posts",
        variant: "destructive",
      });
      return;
    }
    
    setIsPosting(true);
    
    try {
      console.log("Creating new post...");
      let imageUrl = selectedImage;
      
      // If it's a base64 image, upload it to Supabase storage
      if (selectedImage && selectedImage.startsWith('data:image')) {
        try {
          console.log("Converting base64 image and uploading to storage");
          // Convert base64 to blob
          const base64Response = await fetch(selectedImage);
          const blob = await base64Response.blob();
          
          const fileName = `post_image_${Date.now()}.${blob.type.split('/')[1] || 'png'}`;
          const filePath = `posts/${sessionData.session.user.id}/${fileName}`;
          
          // Upload the image
          const { error: uploadError } = await supabase.storage
            .from('community')
            .upload(filePath, blob);
            
          if (uploadError) {
            console.error("Failed to upload image:", uploadError);
            throw uploadError;
          }
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('community')
            .getPublicUrl(filePath);
            
          imageUrl = publicUrlData.publicUrl;
          console.log("Image uploaded successfully:", imageUrl);
        } catch (imageError) {
          console.error("Error processing image:", imageError);
          toast({
            title: "Image Error",
            description: "Failed to upload image. Creating post without image.",
            variant: "destructive"
          });
          imageUrl = null;
        }
      }
      
      // Create post in the database
      console.log("Calling community-posts edge function...");
      const { data, error } = await supabase.functions.invoke('community-posts', {
        body: {
          action: 'create',
          post: {
            content: content,
            image_url: imageUrl || null,
            title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            category: 'general'
          }
        }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }
      
      console.log("Post created successfully:", data);
      onPost(content, imageUrl || undefined);
      setContent('');
      setSelectedImage(null);
      
      toast({
        title: "Post created",
        description: "Your post has been published to the community"
      });
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPosting(false);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            {(userAvatar || currentUser?.avatar) ? (
              <AvatarImage src={userAvatar || currentUser?.avatar || ''} alt="User avatar" />
            ) : (
              <AvatarFallback>
                {currentUser ? currentUser.name.charAt(0) : <User className="h-5 w-5" />}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your fitness journey?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 border-gray-200"
              rows={3}
            />
            
            {selectedImage && (
              <div className="relative mt-2 rounded-md overflow-hidden border">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="max-h-64 w-full object-contain"
                />
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white text-gray-600 hover:bg-gray-200"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex space-x-2">
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={isPosting}
            />
            <div className="flex items-center text-gray-500 hover:text-purple-500 hover:bg-purple-50 p-2 rounded-md">
              <Image className="h-4 w-4 mr-1" />
              <span className="text-sm">Photo</span>
            </div>
          </label>
          
          <div className="flex items-center text-gray-500 hover:text-purple-500 hover:bg-purple-50 p-2 rounded-md cursor-pointer">
            <Smile className="h-4 w-4 mr-1" />
            <span className="text-sm">Feeling</span>
          </div>
          
          <div className="flex items-center text-gray-500 hover:text-purple-500 hover:bg-purple-50 p-2 rounded-md cursor-pointer">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Location</span>
          </div>
        </div>
        
        <Button 
          onClick={handlePost}
          disabled={content.trim() === '' || isPosting}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isPosting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : 'Post'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
