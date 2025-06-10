"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getProductById } from '@/lib/products';
import type { Product, Review } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Star, PlusCircle, MinusCircle } from 'lucide-react';
import Link from 'next/link';
import { AiRecommendations } from '@/components/AiRecommendations'; // Placeholder, will create next

function StarRating({ rating, totalStars = 5 }: { rating: number; totalStars?: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: totalStars }, (_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const fetchedProduct = getProductById(params.id as string);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setMainImage(fetchedProduct.imageUrl);
      }
      setIsLoading(false);
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
            <div className="flex gap-2 mt-4">
              <div className="w-1/4 aspect-square bg-muted rounded animate-pulse"></div>
              <div className="w-1/4 aspect-square bg-muted rounded animate-pulse"></div>
              <div className="w-1/4 aspect-square bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse"></div>
            <div className="h-6 w-1/4 bg-muted rounded animate-pulse"></div>
            <div className="h-20 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-1/2 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
        <div className="text-center py-20">
            <h1 className="text-3xl font-headline mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">We couldn't find the product you're looking for.</p>
            <Button asChild variant="outline">
                <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" />Back to Products</Link>
            </Button>
        </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="space-y-12">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Products</Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square relative w-full rounded-lg overflow-hidden shadow-lg mb-4">
            <Image
              src={mainImage || product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              data-ai-hint={product.dataAiHint}
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {[product.imageUrl, ...product.images].slice(0,4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-1/4 aspect-square relative rounded-md overflow-hidden border-2 transition-all ${mainImage === img ? 'border-primary shadow-md' : 'border-transparent hover:border-muted'}`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" sizes="25vw" data-ai-hint={product.dataAiHint}/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-headline font-bold">{product.name}</h1>
          {product.rating && <StarRating rating={product.rating} />}
          <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          <p className="text-foreground/80 leading-relaxed">{product.description}</p>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <=1}>
              <MinusCircle className="h-5 w-5" />
            </Button>
            <Input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 text-center" />
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          <Button size="lg" onClick={handleAddToCart} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            Add to Cart
          </Button>

          {product.specifications && (
            <div className="pt-6">
              <h3 className="text-xl font-headline mb-3">Specifications</h3>
              <ul className="space-y-1 text-sm text-foreground/70">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Customer Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <section>
          <h2 className="text-2xl font-headline mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review: Review) => (
              <Card key={review.id} className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md font-headline">{review.author}</CardTitle>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      <Separator />
      
      {/* AI Recommendations */}
      <AiRecommendations currentProductId={product.id} currentProductCategory={product.category} />

    </div>
  );
}
