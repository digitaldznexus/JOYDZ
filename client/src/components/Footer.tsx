import { Link } from "wouter";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="h-16 flex items-center mb-6">
                <div className="font-[Abril_Fatface] text-3xl text-white tracking-wider flex items-center">
                  <span className="text-yellow-400">JOY</span>
                  <div className="ml-3 text-sm font-light text-gray-300 leading-tight">
                    La Mode à<br/>Tout Prix
                  </div>
                </div>
              </div>
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
                    href="/collections" 
                    className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                  >
                    Toutes les Collections
                  </Link>
                </li>
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

            {/* Legal */}
            <div>
              <h4 className="font-[Abril_Fatface] text-lg mb-6">Légal</h4>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                  >
                    Conditions Générales
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                  >
                    Politique de Confidentialité
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                  >
                    Mentions Légales
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-300 hover:text-yellow-600 transition-colors duration-300 font-light"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-12 bg-gray-800" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 font-light mb-4 md:mb-0">
              © {new Date().getFullYear()} JOY. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <span className="text-gray-500 text-sm">
                Paiement sécurisé
              </span>
              <div className="flex space-x-2">
                <span className="text-gray-500">•</span>
                <span className="text-gray-500 text-sm">
                  Livraison internationale
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Large J O Y Logo at the bottom */}
        <div className="border-t border-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center items-center space-x-2 md:space-x-6 lg:space-x-12 mb-4">
                {['J', 'O', 'Y'].map((letter, index) => (
                  <motion.span 
                    key={index}
                    className="text-6xl md:text-8xl lg:text-9xl font-[Abril_Fatface] text-gray-200 hover:text-yellow-400 transition-colors duration-500"
                    whileHover={{ 
                      y: -10,
                      textShadow: "0 0 20px rgba(234, 179, 8, 0.5)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <p className="text-gray-400 text-lg md:text-xl font-light">
                La Mode à Tout Petit Prix
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
