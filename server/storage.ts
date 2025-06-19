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
      {
        name: "Costume Prestige",
        description: "Costume trois pièces en laine vierge italienne, coupe moderne et finitions exceptionnelles. Idéal pour les occasions formelles.",
        price: "1890.00",
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
        name: "Robe de Soirée Élégante",
        description: "Robe longue en soie avec détails brodés à la main. Coupe flatteuse et élégance intemporelle pour vos soirées prestigieuses.",
        price: "2450.00",
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
        name: "Sac à Main de Luxe",
        description: "Sac en cuir italien pleine fleur avec fermoir doré. Compartiments multiples et finitions artisanales de haute qualité.",
        price: "890.00",
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
        name: "Ensemble Enfant Chic",
        description: "Ensemble pantalon et veste pour enfant en coton bio premium. Confort et élégance pour les petits gentlemen.",
        price: "320.00",
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
      // Additional luxury items
      {
        name: "Chemise en Soie",
        description: "Chemise en soie pure avec détails nacrés. Coupe ajustée et confort exceptionnel pour un style raffiné.",
        price: "450.00",
        category: "hommes",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Blanc", "Bleu ciel", "Gris perle"],
        inStock: 25,
        featured: 0
      },
      {
        name: "Tailleur Executive",
        description: "Tailleur deux pièces en laine stretch. Parfait équilibre entre féminité et autorité pour la femme moderne.",
        price: "1680.00",
        category: "femmes",
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["34", "36", "38", "40", "42", "44"],
        colors: ["Noir", "Marine", "Anthracite"],
        inStock: 10,
        featured: 0
      },
      {
        name: "Montre de Luxe",
        description: "Montre suisse avec mouvement automatique et bracelet en cuir véritable. Élégance horlogère intemporelle.",
        price: "2890.00",
        category: "accessoires",
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["Unique"],
        colors: ["Or", "Argent", "Or rose"],
        inStock: 5,
        featured: 0
      },
      {
        name: "Robe Princesse Enfant",
        description: "Robe de cérémonie pour petite fille avec tulle et broderies délicates. Parfaite pour les occasions spéciales.",
        price: "280.00",
        category: "enfants",
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
        images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000"],
        sizes: ["3 ans", "4 ans", "6 ans", "8 ans", "10 ans"],
        colors: ["Rose poudré", "Blanc", "Ivoire"],
        inStock: 15,
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
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
