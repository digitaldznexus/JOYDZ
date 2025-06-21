import { useEffect } from 'react';
import { useLocation } from 'wouter';

const ScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Fait défiler vers le haut de la page à chaque changement de route
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // Animation de défilement fluide
    });
  }, [location]); // Se déclenche à chaque changement de route

  return null; // Ce composant ne rend rien
};

export default ScrollToTop;
