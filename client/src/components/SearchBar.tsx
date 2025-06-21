import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'wouter';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Focus sur le champ de recherche quand il s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
    }
  };

  // L'URL de recherche
  const searchUrl = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '#';

  // Gestion de la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        className="relative mx-auto mt-32 max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative z-10 bg-white rounded-lg shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full py-5 pl-12 pr-16 text-lg border-0 focus:ring-0 focus:outline-none"
                autoComplete="off"
              />
              {query && (
                <Link
                  href={searchUrl}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-yellow-600"
                  aria-label="Rechercher"
                  onClick={() => onClose()}
                >
                  <Search className="h-5 w-5" />
                </Link>
              )}
            </div>
            <button
              type="submit"
              className="px-6 h-full bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-colors"
            >
              Rechercher
            </button>
          </form>
          
          {/* Suggestions de recherche (à implémenter) */}
          {query && (
            <div className="border-t border-gray-100 p-4">
              <p className="text-sm text-gray-500">
                Appuyez sur Entrée pour voir tous les résultats pour "{query}"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
