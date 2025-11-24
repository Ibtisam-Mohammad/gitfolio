export type LayoutType = 'standard' | 'sidebar' | 'single-column';

export interface ThemeConfig {
    id: string;
    name: string;
    layout: LayoutType;
    description: string;
    cssClass: string;
}

export const THEMES: ThemeConfig[] = [
    {
        id: 'brutalist',
        name: 'Brutalist',
        layout: 'standard',
        description: 'Bold, high contrast, hard shadows.',
        cssClass: 'theme-brutalist',
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        layout: 'single-column',
        description: 'Clean, simple, focused on content.',
        cssClass: 'theme-minimalist',
    },
    {
        id: 'neon',
        name: 'Neon',
        layout: 'sidebar',
        description: 'Dark mode with vibrant glowing accents.',
        cssClass: 'theme-neon',
    },
    {
        id: 'playful',
        name: 'Playful',
        layout: 'standard',
        description: 'Soft colors, rounded corners, friendly vibe.',
        cssClass: 'theme-playful',
    },
    {
        id: 'professional',
        name: 'Professional',
        layout: 'sidebar',
        description: 'Elegant, serif fonts, traditional layout.',
        cssClass: 'theme-professional',
    },
];

export const DEFAULT_THEME = THEMES[0];
