"use client";

import React, { useState, useEffect } from 'react';
import { getProductRecommendations, type ProductRecommendationsInput } from '@/ai/flows/product-recommendations';
import { ProductCard } from '@/components/ProductCard';
import { mockProducts, getProductById } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AiRecommendationsProps {
  currentProductId: string;
  currentProductCategory: string;
}

export function AiRecommendations({ currentProductId, currentProductCategory }: AiRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate browsing history and purchase patterns for demo
        // In a real app, this would come from user data
        const browsingHistory = `Viewed ${getProductById(currentProductId)?.name || 'current product'}, similar items in ${currentProductCategory}.`;
        const purchasePatterns = `Often buys items from ${currentProductCategory}, prefers minimalist style.`;

        const input: ProductRecommendationsInput = {
          browsingHistory,
          purchasePatterns,
        };
        
        const result = await getProductRecommendations(input);
        
        if (result && result.recommendations) {
          // Map AI string recommendations to actual product objects
          // This is a simplified mapping; a real app might use fuzzy search or SKU matching
          const recommendedProducts = result.recommendations
            .map(name => mockProducts.find(p => p.name.toLowerCase().includes(name.toLowerCase()) && p.id !== currentProductId))
            .filter(Boolean) as Product[];
          
          // If AI returns too few, supplement with category-based or popular items
          if (recommendedProducts.length < 3) {
            const categoryProducts = mockProducts
              .filter(p => p.category === currentProductCategory && p.id !== currentProductId && !recommendedProducts.find(rec => rec.id === p.id))
              .sort((a,b) => (b.popularity || 0) - (a.popularity || 0));
            recommendedProducts.push(...categoryProducts.slice(0, 3 - recommendedProducts.length));
          }
          
          // Ensure unique products and limit to 3
          const uniqueRecs = Array.from(new Set(recommendedProducts.map(p => p.id)))
            .map(id => recommendedProducts.find(p => p.id === id) as Product)
            .slice(0, 3);

          setRecommendations(uniqueRecs);
        } else {
          setRecommendations(getFallbackRecommendations());
        }
      } catch (e) {
        console.error("AI Recommendation Error:", e);
        setError("Could not fetch recommendations at this time.");
        setRecommendations(getFallbackRecommendations());
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [currentProductId, currentProductCategory]);

  const getFallbackRecommendations = () => {
    // Fallback: 3 random products from the same category, excluding current product
    return mockProducts
      .filter(p => p.category === currentProductCategory && p.id !== currentProductId)
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 3);
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-headline mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length: 3}).map((_, i) => (
            <Card key={i} className="shadow-lg animate-pulse">
                <div className="aspect-square w-full bg-muted" />
                <CardContent className="p-4">
                    <div className="h-6 w-3/4 mb-2 bg-muted rounded" />
                    <div className="h-4 w-full mb-1 bg-muted rounded" />
                    <div className="h-4 w-2/3 mb-2 bg-muted rounded" />
                    <div className="h-8 w-1/2 bg-muted rounded" />
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <div className="h-10 w-full bg-muted rounded" />
                </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
       <section>
        <h2 className="text-2xl font-headline mb-6">You Might Also Like</h2>
        <p className="text-muted-foreground">{error}</p>
        {recommendations.length > 0 && ( // Show fallback if error occurred but fallback is available
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
             {recommendations.map(product => (
               <ProductCard key={product.id} product={product} />
             ))}
           </div>
        )}
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show section if no recommendations and no error
  }

  return (
    <section>
      <h2 className="text-2xl font-headline mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
