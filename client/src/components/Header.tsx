import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";
import SearchBar from "@/components/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import logoJoy from "@assets/logo joy_1750370510245.jpg";

export default function Header() {
  // États pour la navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Hooks de routage et contexte
  const [location] = useLocation();
  const [match] = useRoute("*");
  const { totalItems } = useCart();
  
  // Références
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Gestion du défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer les menus lors du changement de page
  useEffect(() => {
    setIsCategoriesOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  // Gestion de la touche Échap pour la recherche
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  const navigation = [
    { name: "Accueil", href: "/" },
    { 
      name: "Boutique", 
      href: "#",
      categories: [
        { name: "Nouveautés", href: "/category/nouveautes" },
        { name: "Hommes", href: "/category/hommes" },
        { name: "Femmes", href: "/category/femmes" },
        { name: "Enfants", href: "/category/enfants" },
        { name: "Accessoires", href: "/category/accessoires" },
      ]
    },
    { name: "Collections", href: "/category/all" },
    { name: "Contact", href: "/contact" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 shadow-md backdrop-blur-sm' 
            : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="h-12 flex items-center">
                  <div className="font-[Abril_Fatface] text-2xl text-gray-900 tracking-wider flex items-center">
                    <span className="text-yellow-600">JOY</span>
                    <div className="ml-2 text-xs font-light text-gray-600 leading-tight">
                      La Mode à<br/>Tout Prix
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.categories ? (
                    <>
                      <button
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                        className={`flex items-center text-gray-800 hover:text-yellow-600 transition-colors duration-300 font-medium tracking-wide ${
                          location.startsWith('/category/') ? "text-yellow-600" : ""
                        }`}
                      >
                        {item.name}
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'transform rotate-180' : ''}`} />
                      </button>
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isCategoriesOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                            onMouseLeave={() => setIsCategoriesOpen(false)}
                          >
                            <div className="py-1">
                              {item.categories.map((category) => (
                                <Link
                                  key={category.name}
                                  href={category.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => setIsCategoriesOpen(false)}
                                >
                                  {category.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-gray-800 hover:text-yellow-600 transition-colors duration-300 font-medium tracking-wide ${
                        location === item.href ? "text-yellow-600" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-800 hover:text-yellow-600 relative group"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Rechercher
                </span>
              </Button>
              
              {/* Search Overlay */}
              <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

              {/* User Account */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-800 hover:text-yellow-600 relative group"
              >
                <User className="h-5 w-5" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Mon Compte
                </span>
              </Button>

              {/* Cart */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-gray-800 hover:text-yellow-600 group"
                  onClick={toggleCart}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Panier
                  </span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-800 relative group"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {isMobileMenuOpen ? 'Fermer' : 'Menu'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-2 space-y-2 border-t border-gray-100">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.categories ? (
                      <div>
                        <button
                          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                          className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                            location.startsWith('/category/')
                              ? 'bg-gray-100 text-yellow-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-yellow-600'
                          }`}
                        >
                          {item.name}
                          <ChevronDown 
                            className={`ml-2 h-4 w-4 transition-transform ${
                              isCategoriesOpen ? 'transform rotate-180' : ''
                            }`} 
                          />
                        </button>
                        <AnimatePresence>
                          {isCategoriesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-4"
                            >
                              {item.categories.map((category) => (
                                <Link
                                  key={category.name}
                                  href={category.href}
                                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 rounded-md"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsCategoriesOpen(false);
                                  }}
                                >
                                  {category.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          location === item.href
                            ? 'bg-gray-100 text-yellow-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-yellow-600'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Overlay */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
