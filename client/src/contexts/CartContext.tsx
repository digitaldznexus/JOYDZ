import { createContext, useContext, useEffect, useReducer, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Product, CartItem } from "@shared/schema";

interface CartContextType {
  items: CartItemWithProduct[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addItem: (product: Product, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

interface CartState {
  items: CartItemWithProduct[];
  isLoading: boolean;
}

type CartAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CartItemWithProduct[] }
  | { type: 'ADD_ITEM'; payload: CartItemWithProduct }
  | { type: 'UPDATE_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => 
        item.productId === action.payload.productId && 
        item.size === action.payload.size && 
        item.color === action.payload.color
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

function generateSessionId(): string {
  return `session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}

function getSessionId(): string {
  let sessionId = localStorage.getItem('joy_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('joy_session_id', sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
  });

  const sessionId = getSessionId();

  const fetchCartItems = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch(`/api/cart/${sessionId}`);
      const cartItems: CartItem[] = await response.json();
      
      // Fetch product details for each cart item
      const itemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const productResponse = await fetch(`/api/products/${item.productId}`);
            const product: Product = await productResponse.json();
            return { ...item, product };
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            return item;
          }
        })
      );
      
      dispatch({ type: 'SET_ITEMS', payload: itemsWithProducts });
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addItem = async (product: Product, size?: string, color?: string) => {
    try {
      const cartItemData = {
        productId: product.id,
        quantity: 1,
        size: size || null,
        color: color || null,
        sessionId,
      };

      const response = await apiRequest("POST", "/api/cart", cartItemData);
      const newItem: CartItem = await response.json();
      
      dispatch({ 
        type: 'ADD_ITEM', 
        payload: { ...newItem, product } 
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const response = await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      const updatedItem: CartItem = await response.json();
      
      dispatch({ 
        type: 'UPDATE_ITEM', 
        payload: { id: itemId, quantity: updatedItem.quantity } 
      });
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      throw error;
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await apiRequest("DELETE", `/api/cart/${itemId}`);
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await apiRequest("DELETE", `/api/cart/clear/${sessionId}`);
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const refreshCart = async () => {
    await fetchCartItems();
  };

  useEffect(() => {
    fetchCartItems();
  }, [sessionId]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => {
    const price = item.product ? parseFloat(item.product.price) : 0;
    return sum + (price * item.quantity);
  }, 0);

  const value: CartContextType = {
    items: state.items,
    totalItems,
    totalPrice,
    isLoading: state.isLoading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
