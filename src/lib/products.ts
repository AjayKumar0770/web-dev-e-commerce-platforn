import type { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Minimalist Ceramic Vase',
    description: 'A beautifully crafted ceramic vase with a minimalist design, perfect for modern homes. Adds a touch of elegance to any space.',
    price: 45.99,
    category: 'Home Decor',
    imageUrl: 'https://placehold.co/600x600.png',
    dataAiHint: 'ceramic vase',
    images: ['https://placehold.co/800x800.png', 'https://placehold.co/800x800.png', 'https://placehold.co/800x800.png'],
    specifications: {
      Material: 'Ceramic',
      Dimensions: '10" H x 4" W',
      Color: 'Off-white',
    },
    reviews: [
      { id: 'r1', author: 'Jane D.', rating: 5, comment: 'Absolutely stunning!', date: new Date().toISOString() },
      { id: 'r2', author: 'John S.', rating: 4, comment: 'Very good quality, looks great.', date: new Date().toISOString() },
    ],
    popularity: 8,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Linen Throw Pillow',
    description: 'Soft and comfortable linen throw pillow. Its neutral tone complements various decor styles, providing both comfort and style.',
    price: 29.50,
    category: 'Textiles',
    imageUrl: 'https://placehold.co/600x600.png',
    dataAiHint: 'linen pillow',
    images: ['https://placehold.co/800x800.png'],
    specifications: { Material: '100% Linen', Dimensions: '18" x 18"', Color: 'Natural Beige' },
    popularity: 10,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Artisan Wooden Bowl',
    description: 'Handcrafted wooden bowl, ideal for serving or as a decorative centerpiece. Each piece is unique due to its handmade nature.',
    price: 62.00,
    category: 'Kitchenware',
    imageUrl: 'https://placehold.co/600x600.png',
    dataAiHint: 'wooden bowl',
    images: ['https://placehold.co/800x800.png', 'https://placehold.co/800x800.png'],
    specifications: { Material: 'Teak Wood', Dimensions: '12" Diameter x 3" H', Finish: 'Food-safe oil' },
    reviews: [
      { id: 'r3', author: 'Alice B.', rating: 5, comment: 'Beautiful craftsmanship.', date: new Date().toISOString() },
    ],
    popularity: 6,
    rating: 5,
  },
  {
    id: '4',
    name: 'Copper Desk Lamp',
    description: 'Elegant copper desk lamp with an adjustable arm. Provides warm lighting and a sophisticated touch to your workspace.',
    price: 89.99,
    category: 'Lighting',
    imageUrl: 'https://placehold.co/600x600.png',
    dataAiHint: 'copper lamp',
    popularity: 7,
    rating: 4.2,
  },
  {
    id: '5',
    name: 'Minimalist Wall Clock',
    description: 'A sleek and silent wall clock with a minimalist face. Perfect for maintaining a serene and uncluttered environment.',
    price: 55.00,
    category: 'Home Decor',
    imageUrl: 'https://placehold.co/600x600.png',
    dataAiHint: 'wall clock',
    specifications: { Material: 'Metal, Glass', Dimensions: '12" Diameter', Movement: 'Silent Quartz' },
    popularity: 9,
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Organic Cotton Hand Towels',
    description: 'Set of two luxurious organic cotton hand towels. Soft, absorbent, and eco-friendly choice for your bathroom.',
    price: 34.99,
    category: 'Textiles',
    imageUrl: 'https://placehold.co/600x600.png',
    dataAiHint: 'cotton towels',
    popularity: 5,
    rating: 4.0,
  },
];

export const categories = Array.from(new Set(mockProducts.map(p => p.category)));

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};
