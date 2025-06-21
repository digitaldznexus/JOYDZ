import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@shared/schema";

// Fonction utilitaire pour obtenir le nom formaté d'une catégorie
const getCategoryName = (cat: string) => {
  const names = {
    hommes: "Homme",
    femmes: "Femme", 
    enfants: "Enfant",
    accessoires: "Accessoires",
    collections: "Toutes les Collections",
    all: "Toutes les Collections"
  };
  return names[cat as keyof typeof names] || cat;
};

export default function Category() {
  const { category } = useParams() as { category: string };
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const isCollectionsPage = category === 'collections';
  
  // Configuration des images d'en-tête par catégorie
  const categoryHeaders = {
    hommes: {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&h=600",
      title: "HOMMES",
      description: "Collection masculine alliant élégance classique et modernité raffinée"
    },
    femmes: {
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&h=600",
      title: "FEMMES",
      description: "Créations féminines où grâce et sophistication se rencontrent"
    },
    enfants: {
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&h=600",
      title: "ENFANTS",
      description: "Mode enfantine premium pour les petits avec un grand sens du style"
    },
    default: {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&h=600",
      title: getCategoryName(category).toUpperCase(),
      description: `Découvrez notre sélection exclusive de produits ${getCategoryName(category).toLowerCase()}`
    }
  };
  
  const currentHeader = categoryHeaders[category as keyof typeof categoryHeaders] || categoryHeaders.default;

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [isCollectionsPage ? 'all-products' : 'category-products', category],
    queryFn: async () => {
      try {
        const url = isCollectionsPage 
          ? '/api/products'
          : `/api/products/category/${category}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des produits');
        }
        return await response.json();
      } catch (error) {
        console.error('Erreur:', error);
        return [];
      }
    },
  });

  const getCategoryDescription = (cat: string) => {
    const descriptions = {
      hommes: "Collection masculine alliant élégance classique et modernité raffinée",
      femmes: "Créations féminines où grâce et sophistication se rencontrent",
      enfants: "Mode enfantine premium pour les petits avec un grand sens du style",
      accessoires: "Accessoires de luxe pour parfaire votre look avec distinction",
      collections: "Découvrez l'intégralité de nos collections premium",
      all: "Découvrez l'intégralité de nos collections premium"
    };
    return descriptions[cat as keyof typeof descriptions] || "Découvrez notre sélection";
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="bg-gray-200 h-80 mb-4 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête de la catégorie avec image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={currentHeader.image}
          alt={`Collection ${currentHeader.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="font-[Abril_Fatface] text-4xl md:text-6xl mb-4">
              {currentHeader.title}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light mb-6">
              {currentHeader.description}
            </p>
            <Badge variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20">
              {products.length} produit{products.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Description de la catégorie */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
          {getCategoryDescription(category)}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom A-Z</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-8">
              Cette catégorie ne contient pas encore de produits.
            </p>
            <Button variant="outline">
              Retour à l'accueil
            </Button>
          </div>
        ) : (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2 gap-6'
          }`}>
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                className={viewMode === 'list' ? 'flex' : ''}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {products.length > 0 && (
          <div className="text-center mt-16">
            <Button variant="outline" size="lg" className="px-12">
              Charger plus de produits
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
