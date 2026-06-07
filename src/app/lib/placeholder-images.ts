
/**
 * @fileOverview Professional metadata export for protocol placeholder assets.
 */
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Guarantee an array export to prevent runtime .find() errors
export const PlaceHolderImages: ImagePlaceholder[] = Array.isArray(data.placeholderImages) 
  ? data.placeholderImages 
  : [];
