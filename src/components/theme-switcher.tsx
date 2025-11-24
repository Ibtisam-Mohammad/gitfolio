'use client';

import * as React from 'react';
import { Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { THEMES } from '@/lib/themes';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
    const { currentTheme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Switch Theme">
                    <Paintbrush className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {THEMES.map((theme) => (
                    <DropdownMenuItem
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={cn(
                            "flex flex-col items-start gap-1 p-3 cursor-pointer",
                            currentTheme.id === theme.id && "bg-accent text-accent-foreground"
                        )}
                    >
                        <span className="font-medium">{theme.name}</span>
                        <span className="text-xs text-muted-foreground opacity-80">
                            {theme.description}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
