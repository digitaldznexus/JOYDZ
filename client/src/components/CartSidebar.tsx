import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface CartSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CartSidebar({ isOpen = false, onClose }: CartSidebarProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, isLoading } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré du panier.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de retirer le produit.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-5 w-5 text-yellow-600" />
          <h3 className="text-xl font-[Abril_Fatface] text-gray-900">Panier</h3>
          {totalItems > 0 && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {totalItems}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Chargement...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Votre panier est vide</p>
            <Button onClick={onClose} className="bg-yellow-600 hover:bg-yellow-700">
              Continuer mes achats
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-start space-x-4 py-4 border-b border-gray-100">
                {item.product && (
                  <>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover bg-gray-50 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-yellow-600 font-medium mt-1">
                        {formatPrice(parseFloat(item.product.price))}
                      </p>
                      {(item.size || item.color) && (
                        <div className="flex space-x-2 mt-1">
                          {item.size && (
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {item.color}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 bg-gray-50 rounded text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="p-6 border-t border-gray-100 space-y-4">
          <div className="flex justify-between text-lg font-medium">
            <span>Total:</span>
            <span className="text-yellow-600">{formatPrice(totalPrice)}</span>
          </div>
          <div className="space-y-2">
            <Link href="/cart" onClick={onClose}>
              <Button variant="outline" className="w-full">
                Voir le Panier
              </Button>
            </Link>
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
              Procéder au Paiement
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
