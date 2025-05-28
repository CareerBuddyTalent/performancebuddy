
import { useInView } from 'react-intersection-observer';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (options: UseIntersectionObserverOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  
  return useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });
};

export const useLazyLoad = () => {
  return useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });
};

export const useAnimationTrigger = () => {
  return useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '0px',
    triggerOnce: true,
  });
};
