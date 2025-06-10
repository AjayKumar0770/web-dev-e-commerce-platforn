"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { mockProducts, categories as allCategories } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

const MAX_PRICE_DEFAULT = 500; // Default max price if no products

export default function ProductShowcasePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE_DEFAULT]);
  const [sortOption, setSortOption] = useState<string>('popularity');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      const maxProductPrice = mockProducts.length > 0 ? Math.max(...mockProducts.map(p => p.price)) : MAX_PRICE_DEFAULT;
      setPriceRange([0, Math.ceil(maxProductPrice)]);
      setIsLoading(false);
    }, 500);
  }, []);
  
  const maxPrice = useMemo(() => {
    return products.length > 0 ? Math.max(...products.map(p => p.price)) : MAX_PRICE_DEFAULT;
  }, [products]);

  useEffect(() => {
    // Update price range slider's max value when products load
    if (products.length > 0) {
        const currentMax = priceRange[1];
        const newMaxProductPrice = Math.ceil(maxPrice);
        // Only update if current max is default or less than new max product price
        if (currentMax === MAX_PRICE_DEFAULT || currentMax < newMaxProductPrice) {
            setPriceRange(prev => [prev[0], newMaxProductPrice]);
        } else if (currentMax > newMaxProductPrice) {
            // If current selection is higher than the new max, cap it
            setPriceRange(prev => [prev[0], newMaxProductPrice]);
        }
    }
  }, [products, maxPrice, priceRange]);


  const filteredAndSortedProducts = useMemo(() => {
    let tempProducts = [...products];

    if (selectedCategory !== 'all') {
      tempProducts = tempProducts.filter(p => p.category === selectedCategory);
    }

    tempProducts = tempProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortOption) {
      case 'popularity':
        tempProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        tempProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return tempProducts;
  }, [products, selectedCategory, priceRange, sortOption]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-1/4 lg:w-1/5">
        {isLoading ? (
            <Card className="shadow-md">
                <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                <CardContent className="space-y-6">
                    <div><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-10 w-full" /></div>
                    <div><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-10 w-full" /></div>
                    <div><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-10 w-full" /></div>
                </CardContent>
            </Card>
        ) : (
        <ProductFilters
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          maxPrice={Math.ceil(maxPrice)}
          sortOption={sortOption}
          onSortChange={setSortOption}
        />
        )}
      </aside>
      <section className="md:w-3/4 lg:w-4/5">
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="shadow-lg">
                        <Skeleton className="aspect-square w-full" />
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-8 w-1/2" />
                        </CardContent>
                        <CardFooter className="p-4 border-t">
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-headline mb-2">No Products Found</h2>
            <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </section>
    </div>
  );
}
