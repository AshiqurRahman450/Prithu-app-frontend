/**
 * ThemeColorCache - LRU Cache for Theme Colors
 * 
 * Uses a Map-based LRU (Least Recently Used) cache for O(1) lookups.
 * This dramatically speeds up color loading when navigating to ProfilePost.
 * 
 * DSA: HashMap + Doubly Linked List pattern (JavaScript Map maintains insertion order)
 * Time Complexity: O(1) for get/set operations
 * Space Complexity: O(n) where n = MAX_CACHE_SIZE
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache configuration
const MAX_CACHE_SIZE = 100; // LRU eviction after 100 entries
const STORAGE_KEY = 'theme_color_cache';
const SAVE_DEBOUNCE_MS = 2000; // Debounce storage saves

export interface ThemeColors {
    primary: string;
    accent: string;
    textColor: string;
}

// Default colors for immediate rendering
export const DEFAULT_THEME_COLORS: ThemeColors = {
    primary: '#4A90E2',
    accent: '#50C878',
    textColor: '#FFFFFF',
};

class ThemeColorCache {
    private cache: Map<string, ThemeColors>;
    private saveTimeout: NodeJS.Timeout | null = null;
    private isLoaded: boolean = false;

    constructor() {
        // Map maintains insertion order, making LRU implementation simple
        this.cache = new Map<string, ThemeColors>();
    }

    /**
     * Get cached theme colors - O(1) lookup
     * Returns null if not cached (use DEFAULT_THEME_COLORS as fallback)
     */
    getColor(feedId: string): ThemeColors | null {
        if (!feedId) return null;

        const colors = this.cache.get(feedId);
        if (colors) {
            // Move to end (most recently used) - LRU strategy
            this.cache.delete(feedId);
            this.cache.set(feedId, colors);
            return colors;
        }
        return null;
    }

    /**
     * Cache theme colors - O(1) insert with LRU eviction
     */
    setColor(feedId: string, colors: ThemeColors): void {
        if (!feedId || !colors.primary) return;

        // If exists, delete first (to update position)
        if (this.cache.has(feedId)) {
            this.cache.delete(feedId);
        }

        // Evict oldest entry if at capacity (LRU - first item is least recent)
        if (this.cache.size >= MAX_CACHE_SIZE) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }

        // Add to end (most recently used)
        this.cache.set(feedId, colors);

        // Debounced save to storage
        this.debouncedSave();
    }

    /**
     * Batch set colors - useful when loading posts list
     */
    setColors(entries: Array<{ feedId: string; colors: ThemeColors }>): void {
        entries.forEach(({ feedId, colors }) => {
            if (feedId && colors.primary) {
                this.setColor(feedId, colors);
            }
        });
    }

    /**
     * Check if color is cached - O(1)
     */
    hasColor(feedId: string): boolean {
        return this.cache.has(feedId);
    }

    /**
     * Get color or default - convenience method
     */
    getColorOrDefault(feedId: string): ThemeColors {
        return this.getColor(feedId) || DEFAULT_THEME_COLORS;
    }

    /**
     * Preload cache from AsyncStorage on app start
     */
    async preloadFromStorage(): Promise<void> {
        if (this.isLoaded) return;

        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const entries: Array<[string, ThemeColors]> = JSON.parse(stored);
                // Rebuild cache from stored entries
                entries.forEach(([feedId, colors]) => {
                    this.cache.set(feedId, colors);
                });
                console.log(`ThemeColorCache: Loaded ${this.cache.size} entries from storage`);
            }
            this.isLoaded = true;
        } catch (error) {
            console.error('ThemeColorCache: Failed to load from storage', error);
            this.isLoaded = true;
        }
    }

    /**
     * Save cache to AsyncStorage (debounced)
     */
    private debouncedSave(): void {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = setTimeout(async () => {
            try {
                // Convert Map to array for JSON serialization
                const entries = Array.from(this.cache.entries());
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
            } catch (error) {
                console.error('ThemeColorCache: Failed to save to storage', error);
            }
        }, SAVE_DEBOUNCE_MS);
    }

    /**
     * Clear cache (for debugging/reset)
     */
    clear(): void {
        this.cache.clear();
        AsyncStorage.removeItem(STORAGE_KEY).catch(() => { });
    }

    /**
     * Get cache stats (for debugging)
     */
    getStats(): { size: number; maxSize: number } {
        return {
            size: this.cache.size,
            maxSize: MAX_CACHE_SIZE,
        };
    }
}

// Singleton instance for global access
export const themeColorCache = new ThemeColorCache();

// Helper to extract theme colors from feed data
export function extractThemeColors(feedData: any): ThemeColors {
    return {
        primary: feedData?.themeColor?.primary || feedData?.primary || DEFAULT_THEME_COLORS.primary,
        accent: feedData?.themeColor?.accent || feedData?.accent || DEFAULT_THEME_COLORS.accent,
        textColor: feedData?.themeColor?.text || feedData?.textColor || DEFAULT_THEME_COLORS.textColor,
    };
}

// Helper to cache colors from a posts array
export function cachePostColors(posts: any[]): void {
    const entries = posts
        .filter(p => p && (p.feedId || p._id))
        .map(p => ({
            feedId: p.feedId || p._id,
            colors: extractThemeColors(p),
        }));

    themeColorCache.setColors(entries);
}

export default themeColorCache;
