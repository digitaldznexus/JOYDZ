import { 
  products, 
  cartItems, 
  contactMessages,
  type Product, 
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart Items
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private contactMessages: Map<number, ContactMessage>;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentContactId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.contactMessages = new Map();
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentContactId = 1;

    // Initialize with luxury products
    this.initializeProducts();
  }

  private initializeProducts() {
    const luxuryProducts: InsertProduct[] = [
      // HOMMES - 4 produits
      {
        name: "Costume Prestige",
        description: "Costume trois pièces en laine vierge italienne, coupe moderne et finitions exceptionnelles. Idéal pour les occasions formelles.",
        price: "285000 DA",
        category: "hommes",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: [
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
        ],
        sizes: ["48", "50", "52", "54", "56"],
        colors: ["Noir", "Marine", "Charcoal"],
        inStock: 15,
        featured: 1
      },
      {
        name: "Chemise en Soie",
        description: "Chemise en soie pure avec détails nacrés. Coupe ajustée et confort exceptionnel pour un style raffiné.",
        price: "68000 DA",
        category: "hommes",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Blanc", "Bleu ciel", "Gris perle"],
        inStock: 25,
        featured: 0
      },
      {
        name: "Veste Blazer Premium",
        description: "Blazer en cachemire et laine mélangés. Coupe slim moderne avec revers crantés et doublure en soie.",
        price: "188000 DA",
        category: "hommes",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["46", "48", "50", "52", "54"],
        colors: ["Marine", "Anthracite", "Camel"],
        inStock: 18,
        featured: 0
      },
      {
        name: "Pantalon de Costume",
        description: "Pantalon de costume en laine super 150's. Coupe droite élégante avec pli permanent et finition impeccable.",
        price: "57000 DA",
        category: "hommes",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["44", "46", "48", "50", "52"],
        colors: ["Noir", "Marine", "Gris"],
        inStock: 30,
        featured: 0
      },
      
      // FEMMES - 4 produits
      {
        name: "Robe de Soirée Élégante",
        description: "Robe longue en soie avec détails brodés à la main. Coupe flatteuse et élégance intemporelle pour vos soirées prestigieuses.",
        price: "368000 DA",
        category: "femmes",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: [
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
        ],
        sizes: ["34", "36", "38", "40", "42", "44"],
        colors: ["Noir", "Bordeaux", "Marine"],
        inStock: 8,
        featured: 1
      },
      {
        name: "Tailleur Executive",
        description: "Tailleur deux pièces en laine stretch. Parfait équilibre entre féminité et autorité pour la femme moderne.",
        price: "252000 DA",
        category: "femmes",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["34", "36", "38", "40", "42", "44"],
        colors: ["Noir", "Marine", "Anthracite"],
        inStock: 10,
        featured: 0
      },
      {
        name: "Blouse en Dentelle",
        description: "Blouse en dentelle de Calais avec détails en soie. Transparence délicate et sophistication parisienne.",
        price: "78000 DA",
        category: "femmes",
        image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["34", "36", "38", "40", "42"],
        colors: ["Blanc", "Noir", "Nude"],
        inStock: 22,
        featured: 0
      },
      {
        name: "Jupe Plissée Haute Couture",
        description: "Jupe plissée mi-longue en crêpe de soie. Plissage permanent et taille haute pour une silhouette élégante.",
        price: "98000 DA",
        category: "femmes",
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["34", "36", "38", "40", "42"],
        colors: ["Noir", "Marine", "Camel"],
        inStock: 16,
        featured: 0
      },
      
      // ENFANTS - 4 produits
      {
        name: "Ensemble Enfant Chic",
        description: "Ensemble pantalon et veste pour enfant en coton bio premium. Confort et élégance pour les petits gentlemen.",
        price: "48000.00",
        category: "enfants",
        image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: [
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
          "https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
        ],
        sizes: ["4 ans", "6 ans", "8 ans", "10 ans", "12 ans"],
        colors: ["Marine", "Gris", "Beige"],
        inStock: 20,
        featured: 1
      },
      {
        name: "Robe Princesse Enfant",
        description: "Robe de cérémonie pour petite fille avec tulle et broderies délicates. Parfaite pour les occasions spéciales.",
        price: "42000 DA",
        category: "enfants",
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["3 ans", "4 ans", "6 ans", "8 ans", "10 ans"],
        colors: ["Rose poudré", "Blanc", "Ivoire"],
        inStock: 15,
        featured: 0
      },
      {
        name: "Manteau Enfant Luxury",
        description: "Manteau d'hiver en laine mérinos pour enfant. Doublure chaude et style intemporel pour les petits fashionistas.",
        price: "63000 DA",
        category: "enfants",
        image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["4 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans"],
        colors: ["Marine", "Camel", "Rouge"],
        inStock: 12,
        featured: 0
      },
      {
        name: "Polo Premium Enfant",
        description: "Polo en coton piqué premium avec broderie discrète. Confort quotidien et élégance décontractée.",
        price: "12800 DA",
        category: "enfants",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["4 ans", "6 ans", "8 ans", "10 ans", "12 ans"],
        colors: ["Blanc", "Marine", "Rouge"],
        inStock: 35,
        featured: 0
      },
      
      // ACCESSOIRES - 4 produits
      {
        name: "Sac à Main de Luxe",
        description: "Sac en cuir italien pleine fleur avec fermoir doré. Compartiments multiples et finitions artisanales de haute qualité.",
        price: "134000 DA",
        category: "accessoires",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"
        ],
        sizes: ["Unique"],
        colors: ["Noir", "Cognac", "Camel"],
        inStock: 12,
        featured: 1
      },
      {
        name: "Montre de Luxe",
        description: "Montre suisse avec mouvement automatique et bracelet en cuir véritable. Élégance horlogère intemporelle.",
        price: "435000 DA",
        category: "accessoires",
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["Unique"],
        colors: ["Or", "Argent", "Or rose"],
        inStock: 5,
        featured: 0
      },
      {
        name: "Foulard en Soie",
        description: "Foulard carré en soie twill avec motifs exclusifs. Accessoire polyvalent pour sublimer toutes vos tenues.",
        price: "27000 DA",
        category: "accessoires",
        image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["90x90cm"],
        colors: ["Marine et Or", "Rouge et Noir", "Beige et Marron"],
        inStock: 25,
        featured: 0
      },
      {
        name: "Ceinture Cuir Premium",
        description: "Ceinture en cuir de veau avec boucle en métal doré. Artisanat français et style intemporel.",
        price: "48000.00",
        category: "accessoires",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["80", "85", "90", "95", "100", "105"],
        colors: ["Noir", "Marron", "Cognac"],
        inStock: 18,
        featured: 0
      }
    ];

    luxuryProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured === 1);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      images: insertProduct.images || [],
      sizes: insertProduct.sizes || [],
      colors: insertProduct.colors || [],
      inStock: insertProduct.inStock || 0,
      featured: insertProduct.featured || 0,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  // Cart Items
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const cartItem: CartItem = {
      ...insertItem,
      id,
      quantity: insertItem.quantity || 1,
      size: insertItem.size || null,
      color: insertItem.color || null,
      createdAt: new Date(),
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
    
    itemsToRemove.forEach(item => {
      this.cartItems.delete(item.id);
    });
    
    return true;
  }

  // Contact Messages
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      telephone: insertMessage.telephone || null,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
