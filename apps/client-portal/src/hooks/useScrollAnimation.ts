import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(options = {}) {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Opcional: parar de observar após a animação ser ativada
          // observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger quando 10% do elemento estiver visível
        rootMargin: '0px 0px -100px 0px', // Trigger um pouco antes de entrar no viewport
        ...options
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return { elementRef, isVisible };
}
