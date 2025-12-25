import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Confetti colors - Gold and Green theme
const CONFETTI_COLORS = [
    '#FFD700', '#32CD32', '#FFEC8B', '#90EE90', '#FFC125',
    '#228B22', '#FAFAD2', '#7CFC00', '#FFE135', '#00FA9A',
    '#DAA520', '#3CB371', '#F0E68C', '#2E8B57', '#BDB76B',
];

// Single confetti piece component
const ConfettiPiece = ({ delay, startX, side }: { delay: number; startX: number; side: 'left' | 'right' }) => {
    const translateY = useRef(new Animated.Value(-50)).current;
    const translateX = useRef(new Animated.Value(startX)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(0)).current;

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const size = Math.random() * 12 + 8;
    const shape = Math.random() > 0.5 ? 'square' : 'circle';

    // Random horizontal movement direction based on side
    const horizontalMovement = side === 'left'
        ? Math.random() * 200 + 50
        : -(Math.random() * 200 + 50);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Explosion effect - start small then grow
            Animated.timing(scale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.out(Easing.back(2)),
            }).start();

            // Fall animation
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT + 100,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }).start();

            // Horizontal drift
            Animated.timing(translateX, {
                toValue: startX + horizontalMovement,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }).start();

            // Spinning
            Animated.loop(
                Animated.timing(rotate, {
                    toValue: 1,
                    duration: 1000 + Math.random() * 1000,
                    useNativeDriver: true,
                    easing: Easing.linear,
                })
            ).start();

            // Fade out at the end
            Animated.timing(opacity, {
                toValue: 0,
                duration: 4000,
                delay: 1000,
                useNativeDriver: true,
            }).start();
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.confetti,
                {
                    width: size,
                    height: shape === 'square' ? size : size,
                    borderRadius: shape === 'circle' ? size / 2 : 2,
                    backgroundColor: color,
                    transform: [
                        { translateX },
                        { translateY },
                        { rotate: spin },
                        { scale },
                    ],
                    opacity,
                },
            ]}
        />
    );
};

// Ribbon streamer component
const Ribbon = ({ delay, startX, side }: { delay: number; startX: number; side: 'left' | 'right' }) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const translateX = useRef(new Animated.Value(startX)).current;
    const rotateZ = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(0)).current;

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const width = 8 + Math.random() * 6;
    const height = 30 + Math.random() * 40;

    const horizontalMovement = side === 'left'
        ? Math.random() * 300 + 100
        : -(Math.random() * 300 + 100);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Explosion scale
            Animated.spring(scale, {
                toValue: 1,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
            }).start();

            // Falling with wave effect
            Animated.timing(translateY, {
                toValue: SCREEN_HEIGHT + 150,
                duration: 4000 + Math.random() * 2000,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad),
            }).start();

            // Horizontal drift with wave
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: startX + horizontalMovement * 0.7,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad),
                }),
                Animated.timing(translateX, {
                    toValue: startX + horizontalMovement,
                    duration: 2500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.sin),
                }),
            ]).start();

            // Wobble rotation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(rotateZ, {
                        toValue: 1,
                        duration: 300 + Math.random() * 400,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.sin),
                    }),
                    Animated.timing(rotateZ, {
                        toValue: -1,
                        duration: 300 + Math.random() * 400,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.sin),
                    }),
                ])
            ).start();

            // Fade out
            Animated.timing(opacity, {
                toValue: 0,
                duration: 5000,
                delay: 1500,
                useNativeDriver: true,
            }).start();
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    const wobble = rotateZ.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-45deg', '45deg'],
    });

    return (
        <Animated.View
            style={[
                styles.ribbon,
                {
                    width,
                    height,
                    backgroundColor: color,
                    transform: [
                        { translateX },
                        { translateY },
                        { rotateZ: wobble },
                        { scale },
                    ],
                    opacity,
                },
            ]}
        />
    );
};

const ComingSoon = () => {
    const navigation = useNavigation<any>();
    const textScale = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [showConfetti, setShowConfetti] = useState(true);

    // Generate confetti and ribbons
    const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        delay: Math.random() * 500,
        startX: i < 20 ? 0 : SCREEN_WIDTH, // First 20 from left, rest from right
        side: i < 20 ? 'left' : 'right' as 'left' | 'right',
    }));

    const ribbons = Array.from({ length: 20 }, (_, i) => ({
        id: i + 100,
        delay: Math.random() * 300,
        startX: i < 10 ? 0 : SCREEN_WIDTH,
        side: i < 10 ? 'left' : 'right' as 'left' | 'right',
    }));

    useEffect(() => {
        // Text entrance animation
        Animated.sequence([
            Animated.delay(300),
            Animated.parallel([
                Animated.spring(textScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Continuous pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
            ])
        ).start();

        // Stop generating new confetti after 5 seconds
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={['#1a2e1a', '#163e21', '#0f4630']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Back button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                {/* Confetti container */}
                <View style={styles.confettiContainer}>
                    {showConfetti && confettiPieces.map((piece) => (
                        <ConfettiPiece
                            key={piece.id}
                            delay={piece.delay}
                            startX={piece.startX}
                            side={piece.side}
                        />
                    ))}
                    {showConfetti && ribbons.map((ribbon) => (
                        <Ribbon
                            key={ribbon.id}
                            delay={ribbon.delay}
                            startX={ribbon.startX}
                            side={ribbon.side}
                        />
                    ))}
                </View>

                {/* Main content */}
                <View style={styles.content}>
                    <Animated.View
                        style={[
                            styles.textContainer,
                            {
                                transform: [{ scale: Animated.multiply(textScale, pulseAnim) }],
                                opacity: textOpacity,
                            },
                        ]}
                    >
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <Icon name="emoji-events" size={80} color="#FFD700" />
                        </View>

                        {/* Coming Soon Text */}
                        <Text style={styles.comingSoonText}>COMING SOON</Text>

                        {/* Subtitle */}
                        <Text style={styles.subtitle}>
                            Something amazing is on the way!
                        </Text>

                        {/* Decorative line */}
                        <View style={styles.decorativeLine}>
                            <View style={styles.lineLeft} />
                            <View style={styles.diamond} />
                            <View style={styles.lineRight} />
                        </View>

                        {/* Description */}
                        <Text style={styles.description}>
                            We're working hard to bring you{'\n'}an incredible new feature
                        </Text>
                    </Animated.View>
                </View>

                {/* Tap to blast again button */}
                <TouchableOpacity
                    style={styles.blastButton}
                    onPress={() => {
                        setShowConfetti(false);
                        setTimeout(() => setShowConfetti(true), 50);
                    }}
                >
                    <LinearGradient
                        colors={['#FFD700', '#32CD32']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.blastButtonGradient}
                    >
                        <Icon name="celebration" size={20} color="#fff" />
                        <Text style={styles.blastButtonText}>Celebrate Again!</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 100,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 50,
    },
    confettiContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    confetti: {
        position: 'absolute',
    },
    ribbon: {
        position: 'absolute',
        borderRadius: 4,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(50, 205, 50, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 3,
        borderColor: 'rgba(50, 205, 50, 0.3)',
    },
    comingSoonText: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 4,
        textShadowColor: 'rgba(50, 205, 50, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 15,
        fontWeight: '500',
    },
    decorativeLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    lineLeft: {
        width: 60,
        height: 2,
        backgroundColor: 'rgba(50, 205, 50, 0.5)',
    },
    diamond: {
        width: 10,
        height: 10,
        backgroundColor: '#32CD32',
        transform: [{ rotate: '45deg' }],
        marginHorizontal: 15,
    },
    lineRight: {
        width: 60,
        height: 2,
        backgroundColor: 'rgba(50, 205, 50, 0.5)',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
    },
    blastButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    blastButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        gap: 10,
    },
    blastButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ComingSoon;
