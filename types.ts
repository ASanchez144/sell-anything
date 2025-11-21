export enum AppState {
  UPLOAD = 'UPLOAD',
  ANALYSIS = 'ANALYSIS',
  EDIT = 'EDIT',
  GENERATE = 'GENERATE',
  PREVIEW = 'PREVIEW'
}

export enum ItemCategory {
  OBJECT = 'OBJECT',
  CLOTHING = 'CLOTHING',
  UNKNOWN = 'UNKNOWN'
}

export interface ListingData {
  title: string;
  description: string;
  priceRange: string;
  category: ItemCategory;
  hashtags: string[];
  suggestedMarketplaces: string[];
}

export type ImageResolution = '1K' | '2K' | '4K';

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}