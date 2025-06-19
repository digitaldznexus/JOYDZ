import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, isLoading } = useCart();
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

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast({
        title: "Panier vidé",
        description: "Tous les produits ont été retirés du panier.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg">
                    <div className="flex space-x-4">
                      <div className="w-24 h-24 bg-gray-200 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-lg h-fit">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuer mes achats
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-yellow-600" />
              <h1 className="text-2xl font-[Abril_Fatface] text-gray-900">Mon Panier</h1>
              {totalItems > 0 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {totalItems} article{totalItems !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearCart}>
              Vider le panier
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-medium text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez notre collection exclusive et ajoutez vos pièces favorites à votre panier.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Découvrir la collection
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    {item.product && (
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover bg-gray-50 rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                <Link 
                                  href={`/product/${item.product.id}`}
                                  className="hover:text-yellow-600 transition-colors"
                                >
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {item.product.category === 'hommes' && 'Homme'}
                                {item.product.category === 'femmes' && 'Femme'}
                                {item.product.category === 'enfants' && 'Enfant'}
                                {item.product.category === 'accessoires' && 'Accessoires'}
                              </p>
                              
                              {/* Variants */}
                              {(item.size || item.color) && (
                                <div className="flex space-x-2 mt-2">
                                  {item.size && (
                                    <Badge variant="outline" className="text-xs">
                                      Taille: {item.size}
                                    </Badge>
                                  )}
                                  {item.color && (
                                    <Badge variant="outline" className="text-xs">
                                      Couleur: {item.color}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(parseFloat(item.product.price))}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Unité
                              </p>
                            </div>
                          </div>
                          
                          {/* Quantity Controls and Remove */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-4 py-1 bg-gray-50 rounded text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <p className="font-medium text-yellow-600">
                                {formatPrice(parseFloat(item.product.price) * item.quantity)}
                              </p>
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
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Récapitulatif</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total ({totalItems} article{totalItems !== 1 ? 's' : ''})</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-medium text-green-600">
                      {totalPrice >= 100 ? 'Gratuite' : '9,90 €'}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span className="text-yellow-600">
                      {formatPrice(totalPrice + (totalPrice >= 100 ? 0 : 9.90))}
                    </span>
                  </div>
                  
                  {totalPrice < 100 && (
                    <p className="text-xs text-gray-500">
                      Ajoutez {formatPrice(100 - totalPrice)} pour bénéficier de la livraison gratuite
                    </p>
                  )}
                  
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white mt-6">
                    Procéder au Paiement
                  </Button>
                  
                  <div className="text-center text-xs text-gray-500 mt-4">
                    Paiement sécurisé • Livraison soignée • Retours gratuits
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
