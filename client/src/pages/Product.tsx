import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { ShoppingBag, Heart, Share2, Star, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductPage() {
  const { id } = useParams() as { id: string };
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const getCategoryName = (category: string) => {
    const names = {
      hommes: "Homme",
      femmes: "Femme",
      enfants: "Enfant", 
      accessoires: "Accessoires"
    };
    return names[category as keyof typeof names] || category;
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner une taille.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        await addItem(product, selectedSize || undefined, selectedColor || undefined);
      }
      
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

  const nextImage = () => {
    if (!product) return;
    const images = product.images.length > 0 ? product.images : [product.image];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!product) return;
    const images = product.images.length > 0 ? product.images : [product.image];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="bg-gray-200 h-96 rounded" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Produit non trouvé</h2>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.image];
  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-yellow-600">Accueil</Link>
            <span>/</span>
            <Link href={`/category/${product.category}`} className="hover:text-yellow-600">
              {getCategoryName(product.category)}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {product.featured === 1 && (
                  <Badge className="bg-yellow-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Sélection
                  </Badge>
                )}
                {product.inStock === 0 && (
                  <Badge variant="destructive">Épuisé</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-50 rounded overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-yellow-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <Badge variant="outline" className="mb-4">
                {getCategoryName(product.category)}
              </Badge>
              <h1 className="font-[Abril_Fatface] text-3xl md:text-4xl text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-yellow-600 mb-6">
                {formatPrice(product.price)}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Taille {product.sizes.length > 0 && "*"}
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une taille" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Couleur
                </label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une couleur" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Quantité
              </label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(Math.min(10, product.inStock))].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={handleAddToCart}
                disabled={product.inStock === 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.inStock === 0 ? "Produit épuisé" : "Ajouter au panier"}
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Favoris
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5 mr-2" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3 text-gray-700">
                <Truck className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Livraison gratuite dès 100€</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <RotateCcw className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Retours gratuits sous 30 jours</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Shield className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Garantie qualité premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-24">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="care">Entretien</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Cette pièce exceptionnelle de la collection JOY allie savoir-faire traditionnel et design contemporain. 
                  Confectionnée avec les plus beaux matériaux, elle incarne l'excellence à la française et accompagnera 
                  vos moments les plus précieux avec élégance et raffinement.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Composition</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Matériaux premium sélectionnés</li>
                    <li>• Finitions artisanales</li>
                    <li>• Conception française</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Disponibilité</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Stock disponible:</span>
                      <span className="font-medium">{product.inStock} pièces</span>
                    </div>
                    {product.sizes.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Tailles disponibles:</span>
                        <span className="font-medium">{product.sizes.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="care" className="mt-8">
              <div className="prose max-w-none">
                <h4 className="font-medium text-gray-900 mb-4">Instructions d'entretien</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Nettoyage à sec recommandé pour préserver la qualité</li>
                  <li>• Éviter l'exposition directe au soleil</li>
                  <li>• Ranger sur cintre dans un endroit sec</li>
                  <li>• Consulter l'étiquette pour les instructions spécifiques</li>
                </ul>
                <p className="text-gray-600 text-sm mt-6">
                  Pour maintenir l'excellence de votre pièce JOY, nous recommandons de suivre ces conseils d'entretien.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
