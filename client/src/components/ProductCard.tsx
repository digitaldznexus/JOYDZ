import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingBag, Heart, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimation();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Animation d'entrée avec intersection observer
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      await addItem(product);
      await controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3 }
      });
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string | number) => {
    let priceNumber: number;
    
    if (typeof price === 'string') {
      if (price.includes('DA')) {
        priceNumber = parseFloat(price.replace(/[^0-9,]/g, '').replace(',', '.'));
      } else {
        priceNumber = parseFloat(price);
      }
    } else {
      priceNumber = price;
    }
    
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(priceNumber).replace('DZD', 'DA');
  };

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'hommes': 'Homme',
      'femmes': 'Femme',
      'enfants': 'Enfant',
      'accessoires': 'Accessoire'
    };
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="relative group"
    >
      <Link href={`/products/${product.id}`} className={`block ${className}`}>
        <div 
          className="relative overflow-hidden bg-gray-100 rounded-lg aspect-[3/4] mb-4 shadow-md hover:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            initial={false}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {product.featured && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="absolute top-2 left-2 bg-yellow-600 hover:bg-yellow-700">
                En vedette
              </Badge>
            </motion.div>
          )}
          
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center gap-3 p-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4">
          <motion.h3 
            className="text-sm font-medium text-gray-900 mb-1 hover:text-yellow-600 transition-colors"
            whileHover={{ x: 3 }}
          >
            {product.name}
          </motion.h3>
          <p className="text-xs text-gray-500 mb-2">
            {getCategoryName(product.category)}
          </p>
          <div className="flex items-center justify-between">
            <motion.span 
              className="text-sm font-medium text-gray-900"
              initial={{ opacity: 0.8 }}
              whileHover={{ scale: 1.05, opacity: 1 }}
            >
              {formatPrice(product.price)}
            </motion.span>
            {product.inStock > 0 ? (
              <motion.span 
                className="text-xs text-green-600"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                En stock
              </motion.span>
            ) : (
              <span className="text-xs text-red-600">Épuisé</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
