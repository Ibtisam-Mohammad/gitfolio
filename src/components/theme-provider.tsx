'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, THEMES, DEFAULT_THEME } from '@/lib/themes';

interface ThemeContextType {
    currentTheme: ThemeConfig;
    setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(DEFAULT_THEME);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedThemeId = localStorage.getItem('gitfolio-theme');
        if (savedThemeId) {
            const theme = THEMES.find((t) => t.id === savedThemeId);
            if (theme) {
                setCurrentTheme(theme);
            }
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        console.log('Switching theme to:', currentTheme.id, currentTheme.cssClass);

        // Remove all theme classes
        THEMES.forEach((t) => {
            document.documentElement.classList.remove(t.cssClass);
        });

        // Add current theme class
        document.documentElement.classList.add(currentTheme.cssClass);
        console.log('HTML classes:', document.documentElement.className);

        // Save to local storage
        localStorage.setItem('gitfolio-theme', currentTheme.id);
    }, [currentTheme, mounted]);

    const setTheme = (themeId: string) => {
        const theme = THEMES.find((t) => t.id === themeId);
        if (theme) {
            setCurrentTheme(theme);
        }
    };

    // Prevent hydration mismatch by not rendering until mounted
    // Or render with default theme but be aware of potential flash
    // For this app, a small flash to default is acceptable or we can hide content
    // But strictly returning children is better for SEO, the useEffect will fix the class quickly.

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
