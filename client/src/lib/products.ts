import type { Product } from "@shared/schema";

/**
 * Format price to Algerian currency format
 */
export function formatPrice(price: string | number): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numericPrice.toLocaleString('fr-DZ') + ' DA';
}

/**
 * Get category display name in French
 */
export function getCategoryName(category: string): string {
  const categoryNames = {
    hommes: "Homme",
    femmes: "Femme",
    enfants: "Enfant",
    accessoires: "Accessoires",
  };
  return categoryNames[category as keyof typeof categoryNames] || category;
}

/**
 * Get category description in French
 */
export function getCategoryDescription(category: string): string {
  const descriptions = {
    hommes: "Collection masculine alliant élégance classique et modernité raffinée",
    femmes: "Créations féminines où grâce et sophistication se rencontrent",
    enfants: "Mode enfantine premium pour les petits avec un grand sens du style",
    accessoires: "Accessoires de luxe pour parfaire votre look avec distinction",
  };
  return descriptions[category as keyof typeof descriptions] || "Découvrez notre sélection";
}

/**
 * Check if product is in stock
 */
export function isProductInStock(product: Product): boolean {
  return product.inStock > 0;
}

/**
 * Check if product is featured
 */
export function isProductFeatured(product: Product): boolean {
  return product.featured === 1;
}

/**
 * Get product availability status text in French
 */
export function getAvailabilityText(product: Product): string {
  if (!isProductInStock(product)) {
    return "Épuisé";
  }
  
  if (product.inStock <= 5) {
    return `Plus que ${product.inStock} en stock`;
  }
  
  return "En stock";
}

/**
 * Filter products by category
 */
export function filterProductsByCategory(products: Product[], category: string): Product[] {
  if (category === 'all') {
    return products;
  }
  return products.filter(product => product.category === category);
}

/**
 * Sort products by various criteria
 */
export function sortProducts(products: Product[], sortBy: string): Product[] {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case 'price-desc':
      return sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    case 'featured':
      return sortedProducts.sort((a, b) => b.featured - a.featured);
    case 'stock':
      return sortedProducts.sort((a, b) => b.inStock - a.inStock);
    default:
      return sortedProducts;
  }
}

/**
 * Search products by name or description
 */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) {
    return products;
  }
  
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get related products based on category (excluding current product)
 */
export function getRelatedProducts(products: Product[], currentProduct: Product, limit: number = 4): Product[] {
  return products
    .filter(product => 
      product.category === currentProduct.category && 
      product.id !== currentProduct.id
    )
    .slice(0, limit);
}

/**
 * Calculate discount percentage if there's a sale price
 */
export function calculateDiscountPercentage(originalPrice: string, salePrice: string): number {
  const original = parseFloat(originalPrice);
  const sale = parseFloat(salePrice);
  
  if (original <= sale) return 0;
  
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Validate product data for forms
 */
export function validateProductData(data: Partial<Product>): string[] {
  const errors: string[] = [];
  
  if (!data.name?.trim()) {
    errors.push("Le nom du produit est requis");
  }
  
  if (!data.description?.trim()) {
    errors.push("La description du produit est requise");
  }
  
  if (!data.price || parseFloat(data.price) <= 0) {
    errors.push("Le prix doit être supérieur à 0");
  }
  
  if (!data.category?.trim()) {
    errors.push("La catégorie est requise");
  }
  
  if (!data.image?.trim()) {
    errors.push("L'image principale est requise");
  }
  
  return errors;
}

/**
 * Generate product URL slug from name
 */
export function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[àâäáã]/g, 'a')
    .replace(/[èêëé]/g, 'e')
    .replace(/[ìîïí]/g, 'i')
    .replace(/[òôöóõ]/g, 'o')
    .replace(/[ùûüú]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Get size display format (convert sizes to French format if needed)
 */
export function formatSize(size: string, category: string): string {
  // For clothing sizes, keep as is since they're already in the correct format
  // Could be extended to handle different size systems
  return size;
}

/**
 * Get color display name in French
 */
export function getColorDisplayName(color: string): string {
  const colorNames: Record<string, string> = {
    'black': 'Noir',
    'white': 'Blanc',
    'red': 'Rouge',
    'blue': 'Bleu',
    'green': 'Vert',
    'yellow': 'Jaune',
    'pink': 'Rose',
    'purple': 'Violet',
    'orange': 'Orange',
    'brown': 'Marron',
    'grey': 'Gris',
    'gray': 'Gris',
    'navy': 'Marine',
    'beige': 'Beige',
    'gold': 'Or',
    'silver': 'Argent',
  };
  
  return colorNames[color.toLowerCase()] || color;
}
