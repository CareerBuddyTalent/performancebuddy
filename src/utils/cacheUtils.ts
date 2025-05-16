
/**
 * Utility functions for caching and asset optimization
 */

// Calculate cache hash from a string for versioning
export const calculateHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

// Get a versioned URL for assets to improve caching
export const getVersionedAssetUrl = (url: string, version?: string): string => {
  if (!url) return url;
  
  // Skip external URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  const versionParam = `v=${version || import.meta.env.VITE_APP_VERSION || calculateHash(new Date().toISOString().split('T')[0])}`;
  
  return `${url}${separator}${versionParam}`;
};

// Preload critical assets
export const preloadAssets = (assets: string[]): void => {
  assets.forEach(asset => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = getVersionedAssetUrl(asset);
      
      if (asset.endsWith('.js')) {
        link.as = 'script';
      } else if (asset.endsWith('.css')) {
        link.as = 'style';
      } else if (asset.endsWith('.svg') || asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.webp')) {
        link.as = 'image';
      }
      
      document.head.appendChild(link);
    }
  });
};
