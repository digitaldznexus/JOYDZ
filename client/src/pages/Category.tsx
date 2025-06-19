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

export default function Category() {
  const { category } = useParams() as { category: string };
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/category", category],
    queryFn: () => fetch(`/api/products/category/${category}`).then(res => res.json()),
  });

  const getCategoryName = (cat: string) => {
    const names = {
      hommes: "Homme",
      femmes: "Femme", 
      enfants: "Enfant",
      accessoires: "Accessoires",
      all: "Toutes les Collections"
    };
    return names[cat as keyof typeof names] || cat;
  };

  const getCategoryDescription = (cat: string) => {
    const descriptions = {
      hommes: "Collection masculine alliant élégance classique et modernité raffinée",
      femmes: "Créations féminines où grâce et sophistication se rencontrent",
      enfants: "Mode enfantine premium pour les petits avec un grand sens du style",
      accessoires: "Accessoires de luxe pour parfaire votre look avec distinction",
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
      {/* Header */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-[Abril_Fatface] text-4xl md:text-5xl text-gray-900 mb-4">
            {getCategoryName(category)}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light mb-6">
            {getCategoryDescription(category)}
          </p>
          <Badge variant="outline" className="border-yellow-600 text-yellow-600">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </Badge>
        </div>
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
