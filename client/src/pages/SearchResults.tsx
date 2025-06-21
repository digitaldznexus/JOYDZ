import { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { Search, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import type { Product } from '@shared/schema';

export default function SearchResults() {
  const searchParams = new URLSearchParams(useSearch());
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const searchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Erreur lors de la recherche');
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-medium text-gray-900">Recherchez des produits</h2>
          <p className="mt-2 text-gray-500">Utilisez la barre de recherche pour trouver ce que vous cherchez</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <Search className="mx-auto h-12 w-12 text-yellow-500" />
          <p className="mt-4 text-gray-600">Recherche en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <X className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-medium text-gray-900">Erreur de recherche</h2>
          <p className="mt-2 text-gray-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-gray-900">
          Résultats pour "{query}"
        </h1>
        <p className="mt-2 text-gray-600">
          {results.length} {results.length === 1 ? 'produit trouvé' : 'produits trouvés'}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun résultat</h3>
          <p className="mt-2 text-gray-500">
            Aucun produit ne correspond à votre recherche "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
