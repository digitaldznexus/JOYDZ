import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import logoJoy from "@assets/logo joy_1750370510245.jpg";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <img 
              src={logoJoy} 
              alt="JOY Logo" 
              className="h-16 w-auto mb-6 filter brightness-0 invert"
            />
            <p className="text-gray-300 font-light leading-relaxed mb-6 max-w-md">
              JOY redéfinit l'art de vivre avec des collections exclusives qui célèbrent 
              l'élégance et la sophistication à la française.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-600 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-[Abril_Fatface] text-lg mb-6">Collections</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/category/hommes" 
                  className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                >
                  Homme
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/femmes" 
                  className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                >
                  Femme
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/enfants" 
                  className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                >
                  Enfant
                </Link>
              </li>
              <li>
                <Link 
                  href="/category/accessoires" 
                  className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                >
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-[Abril_Fatface] text-lg mb-6">Service Client</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                >
                  Guide des Tailles
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                >
                  Livraison
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                >
                  Retours & Échanges
                </a>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 font-light mb-4 md:mb-0">
            © 2024 JOY. Tous droits réservés.
          </p>
          <div className="flex space-x-8">
            <a 
              href="#" 
              className="text-gray-400 hover:text-yellow-600 transition-colors duration-300 font-light text-sm"
            >
              Politique de Confidentialité
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-yellow-600 transition-colors duration-300 font-light text-sm"
            >
              Conditions d'Utilisation
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-yellow-600 transition-colors duration-300 font-light text-sm"
            >
              Mentions Légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
