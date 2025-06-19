import { useState } from "react";
import { Link } from "wouter";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addItem(product);
      toast({
        title: "Produit ajouté",
        description: `${product.name} a été ajouté à votre panier.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const getCategoryName = (category: string) => {
    const categoryNames = {
      hommes: "Homme",
      femmes: "Femme",
      enfants: "Enfant",
      accessoires: "Accessoires",
    };
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  return (
    <div 
      className={`group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-gray-50 mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 hover:bg-white shadow-lg"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary" 
                className="bg-white/90 hover:bg-white shadow-lg"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 hover:bg-white shadow-lg"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Featured Badge */}
          {product.featured === 1 && (
            <Badge className="absolute top-4 left-4 bg-yellow-600 text-white">
              Sélection
            </Badge>
          )}

          {/* Stock Status */}
          {product.inStock === 0 && (
            <Badge variant="destructive" className="absolute top-4 right-4">
              Épuisé
            </Badge>
          )}
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-medium text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {getCategoryName(product.category)}
          </p>
          <p className="font-[Abril_Fatface] text-yellow-600 text-lg">
            {formatPrice(product.price)}
          </p>
          
          {/* Size Options Preview */}
          {product.sizes.length > 0 && (
            <div className="flex justify-center space-x-1 mt-2">
              {product.sizes.slice(0, 4).map((size) => (
                <span 
                  key={size} 
                  className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-600"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs px-2 py-1 text-gray-400">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
