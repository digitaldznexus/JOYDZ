import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@shared/schema";

export default function Home() {
  const { data: featuredProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const categories = [
    {
      name: "Homme",
      href: "/category/hommes",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      description: "Élégance masculine redéfinie"
    },
    {
      name: "Femme", 
      href: "/category/femmes",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      description: "Grâce et sophistication"
    },
    {
      name: "Enfant",
      href: "/category/enfants", 
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000",
      description: "Luxe pour les petits"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-gray-900 to-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div className="max-w-4xl px-4">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-yellow-400 mr-2" />
              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300 border-yellow-400">
                Collection Exclusive
              </Badge>
            </div>
            <h1 className="font-[Abril_Fatface] text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide joy-text-shadow">
              JOY
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 tracking-widest">
              La Mode à Tout Prix
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed opacity-90">
              Découvrez notre collection exclusive de vêtements de luxe pour hommes, femmes et enfants. L'élégance redéfinie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white px-12 py-4 text-lg tracking-widest">
                DÉCOUVRIR LA COLLECTION
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black px-12 py-4 text-lg tracking-widest"
              >
                NOTRE HISTOIRE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[Abril_Fatface] text-4xl md:text-5xl text-gray-900 mb-6">
              Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Explorez nos collections raffinées, conçues pour sublimer votre style avec élégance et sophistication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-white rounded-lg shadow-lg">
                    <img
                      src={category.image}
                      alt={`Collection ${category.name}`}
                      className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="font-[Abril_Fatface] text-2xl text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/90 font-light mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
                        <span className="text-sm font-medium">Découvrir</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-yellow-600 mr-2" />
              <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                Sélection Premium
              </Badge>
            </div>
            <h2 className="font-[Abril_Fatface] text-4xl md:text-5xl text-gray-900 mb-6">
              Sélection Exclusive
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Découvrez nos pièces phares, soigneusement sélectionnées pour leur qualité exceptionnelle et leur design intemporel.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-80 mb-4 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/category/all">
              <Button 
                size="lg"
                variant="outline" 
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-12 py-4 text-lg tracking-widest transition-all duration-300"
              >
                VOIR TOUTE LA COLLECTION
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
                alt="L'Art de Vivre JOY"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <div className="flex items-center">
                <div className="w-12 h-px bg-yellow-600 mr-4" />
                <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                  Notre Histoire
                </Badge>
              </div>
              <h2 className="font-[Abril_Fatface] text-4xl md:text-5xl text-gray-900">
                L'Excellence Française
              </h2>
              <div className="space-y-6 text-lg font-light leading-relaxed text-gray-700">
                <p>
                  Depuis notre création, <strong className="text-gray-900">JOY</strong> incarne l'excellence dans l'art de vivre à la française. 
                  Basée à Oran, notre maison cultive un savoir-faire d'exception, alliant tradition et modernité.
                </p>
                <p>
                  Chaque pièce de nos collections est pensée pour sublimer votre personnalité, 
                  créant une harmonie parfaite entre élégance intemporelle et sophistication contemporaine.
                </p>
                <p className="italic text-yellow-700">
                  "La Mode à Tout Prix" n'est pas seulement notre signature, 
                  c'est notre engagement à rendre l'excellence accessible à ceux qui partagent notre vision du luxe.
                </p>
              </div>
              <Link href="/contact">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3">
                  Découvrir notre Histoire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
