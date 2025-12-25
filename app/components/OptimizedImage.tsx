import React, { useState, useCallback, memo } from 'react';
import { Image, View, Animated, StyleSheet, ImageStyle, ViewStyle } from 'react-native';

interface OptimizedImageProps {
    uri: string;
    style?: ImageStyle | ImageStyle[];
    containerStyle?: ViewStyle;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
    placeholderColor?: string;
    fadeDuration?: number;
    onLoad?: () => void;
    onError?: () => void;
}

/**
 * Instagram-style optimized image component with:
 * - Progressive loading with fade-in animation
 * - Placeholder background
 * - Cached image loading
 * - Memory efficient rendering
 */
const OptimizedImage = memo(({
    uri,
    style,
    containerStyle,
    resizeMode = 'cover',
    placeholderColor = '#e0e0e0',
    fadeDuration = 200,
    onLoad,
    onError,
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const opacity = useState(new Animated.Value(0))[0];

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: fadeDuration,
            useNativeDriver: true,
        }).start();
        onLoad?.();
    }, [opacity, fadeDuration, onLoad]);

    const handleError = useCallback(() => {
        setHasError(true);
        setIsLoaded(true);
        opacity.setValue(1);
        onError?.();
    }, [opacity, onError]);

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Placeholder background */}
            {!isLoaded && (
                <View
                    style={[
                        styles.placeholder,
                        { backgroundColor: placeholderColor },
                        style,
                    ]}
                />
            )}

            {/* Actual image with fade-in */}
            {!hasError && (
                <Animated.Image
                    source={{
                        uri,
                        // Enable caching
                        cache: 'force-cache',
                    }}
                    style={[
                        style,
                        styles.image,
                        { opacity },
                    ]}
                    resizeMode={resizeMode}
                    onLoad={handleLoad}
                    onError={handleError}
                    // Disable fade on Android for performance
                    fadeDuration={0}
                />
            )}
        </View>
    );
}, (prevProps, nextProps) => {
    // Custom comparison - only re-render if uri changes
    return prevProps.uri === nextProps.uri;
});

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    placeholder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default OptimizedImage;
