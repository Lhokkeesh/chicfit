export const VALID_CATEGORIES = ['men', 'women', 'accessories'] as const;
export type CategoryType = typeof VALID_CATEGORIES[number];

export const categoryTitles: Record<CategoryType, { title: string; description: string }> = {
  men: {
    title: "Men's Collection",
    description: "Discover our curated selection of men's fashion, from casual wear to formal attire.",
  },
  women: {
    title: "Women's Collection",
    description: "Explore our diverse range of women's fashion, featuring the latest trends and timeless classics.",
  },
  accessories: {
    title: 'Accessories',
    description: 'Complete your look with our stylish collection of accessories.',
  },
}; 