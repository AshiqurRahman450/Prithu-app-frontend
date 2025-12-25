
import React, { useRef, useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { IMAGES, FONTS, COLORS } from '../../constants/theme';
import PostoptionSheet from '../../components/bottomsheet/PostoptionSheet';
import { Image as ExpoImage } from 'expo-image';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Individual Reel Item Component with autoplay (SQUARE FORMAT) - Memoized for performance
const ReelItem = memo(({ data, index, onPress, onOpenSheet, scrollYRef }: any) => {
    const videoRef = useRef<Video>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const itemLayoutRef = useRef({ y: 0, height: 0 });
    const wasVisibleRef = useRef(false);

    // Handle video status updates
    const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
        }
    };

    // Handle layout to get position
    const handleLayout = (event: any) => {
        const { y, height } = event.nativeEvent.layout;
        itemLayoutRef.current = { y, height };
    };

    // Check visibility using interval (more efficient than useEffect on every scroll)
    useEffect(() => {
        const checkVisibility = () => {
            if (!scrollYRef?.current && scrollYRef?.current !== 0) return;

            const scrollY = scrollYRef.current;
            const { y: itemY, height: itemHeight } = itemLayoutRef.current;
            if (itemY === 0 && itemHeight === 0) return;

            const isVisible = itemY < scrollY + screenHeight && itemY + itemHeight > scrollY;

            // Only update if visibility state actually changed
            if (isVisible !== wasVisibleRef.current) {
                wasVisibleRef.current = isVisible;
                if (isVisible) {
                    videoRef.current?.playAsync().catch(() => { });
                } else {
                    videoRef.current?.pauseAsync().catch(() => { });
                }
            }
        };

        // Check visibility periodically (every 300ms)
        const interval = setInterval(checkVisibility, 300);
        checkVisibility(); // Initial check

        return () => clearInterval(interval);
    }, [scrollYRef]);

    // Pause video on unmount
    useEffect(() => {
        return () => {
            videoRef.current?.pauseAsync().catch(() => { });
        };
    }, []);

    return (
        <View
            onLayout={handleLayout}
            style={{ width: '33.33%' }}
        >
            <TouchableOpacity
                style={{ padding: 2 }}
                onPress={onPress}
                activeOpacity={0.9}
            >
                {/* Square Video (1:1 aspect ratio like images) */}
                <Video
                    ref={videoRef}
                    source={{ uri: data.contentUrl }}
                    style={{
                        width: '100%',
                        height: undefined,
                        aspectRatio: 1 / 1, // Square format
                        backgroundColor: '#000',
                        borderRadius: 4,
                    }}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                    isLooping={true}
                    isMuted={true}
                    useNativeControls={false}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />

                {/* Play Icon Overlay (top-right) */}
                <View style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: 12,
                    padding: 4,
                }}>
                    <Image
                        style={{ width: 16, height: 16, tintColor: '#fff' }}
                        source={IMAGES.play}
                    />
                </View>

                {/* Like Count (bottom-left) */}
                <View style={{
                    flexDirection: 'row',
                    gap: 5,
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'absolute',
                    borderRadius: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    bottom: 8,
                    left: 8
                }}>
                    <Image
                        style={{ width: 10, height: 10, resizeMode: 'contain', tintColor: '#fff' }}
                        source={IMAGES.like}
                    />
                    <Text style={{ ...FONTS.fontRegular, fontSize: 10, color: COLORS.white, lineHeight: 14 }}>
                        {data.like}
                    </Text>
                </View>

                {/* More Options Button (top-left) */}
                <TouchableOpacity
                    style={{ position: 'absolute', top: 8, left: 8 }}
                    onPress={(e) => {
                        e.stopPropagation();
                        onOpenSheet(data.id);
                    }}
                >
                    <View style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: 12,
                        padding: 4,
                    }}>
                        <Image
                            style={{ width: 16, height: 16, tintColor: COLORS.white }}
                            source={IMAGES.more}
                        />
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
});

// Main Component - use memo for parent too
const ProfilePostData = memo(({ ProfilepicData, allPostsData, navigation, onNotInterested, setSelectedPostId, scrollYRef }: any) => {
    const optionSheetRef = useRef<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Handle opening the sheet
    const handleOpenSheet = (postId: string) => {
        console.log('Opening PostoptionSheet with postId:', postId);
        setIsSheetOpen(true);
        optionSheetRef.current?.openSheet(postId);
        if (setSelectedPostId) {
            setSelectedPostId(postId);
        }
    };

    // Handle closing the sheet
    const handleCloseSheet = () => {
        setIsSheetOpen(false);
    };

    // Close sheet when navigating away
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
            if (optionSheetRef.current) {
                optionSheetRef.current.close();
                handleCloseSheet();
            }
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <View style={{ marginTop: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
            {ProfilepicData.map((data: any, index: any) => {
                const isVideo = data.type === 'video';

                if (isVideo) {
                    // Render vertical reel with autoplay
                    return (
                        <ReelItem
                            key={data.id || index}
                            data={data}
                            index={index}
                            scrollYRef={scrollYRef}
                            onPress={() => {
                                // Filter only video feeds for the Reels screen
                                const allVideoFeeds = allPostsData?.filter((item: any) => item.type === 'video') || [];
                                navigation.navigate('Reels', {
                                    initialVideoId: data.id,
                                    allReelsData: allVideoFeeds, // Pass all video feeds for relevant content
                                });
                            }}
                            onOpenSheet={handleOpenSheet}
                        />
                    );
                }

                // Render image post (square format) - use ExpoImage for better performance
                return (
                    <View
                        key={data.id || index}
                        style={{ width: '33.33%' }}
                    >
                        <TouchableOpacity
                            style={{ padding: 2 }}
                            onPress={() => {
                                navigation.navigate('ProfilePost', {
                                    initialPostId: data.id,
                                    allPostsData: allPostsData,
                                });
                            }}
                        >
                            <ExpoImage
                                style={{ width: '100%', height: undefined, aspectRatio: 1, borderRadius: 4 }}
                                source={data.image}
                                cachePolicy="disk"
                                transition={0}
                            />

                            {/* Like Count */}
                            <View style={{
                                flexDirection: 'row',
                                gap: 5,
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                position: 'absolute',
                                borderRadius: 12,
                                paddingHorizontal: 8,
                                paddingVertical: 3,
                                bottom: 8,
                                left: 8
                            }}>
                                <Image
                                    style={{ width: 10, height: 10, resizeMode: 'contain', tintColor: '#fff' }}
                                    source={IMAGES.like}
                                />
                                <Text style={{ ...FONTS.fontRegular, fontSize: 10, color: COLORS.white, lineHeight: 14 }}>
                                    {data.like}
                                </Text>
                            </View>

                            {/* More Options Button */}
                            <TouchableOpacity
                                style={{ position: 'absolute', top: 8, left: 8 }}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleOpenSheet(data.id);
                                }}
                            >
                                <View style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    borderRadius: 12,
                                    padding: 4,
                                }}>
                                    <Image
                                        style={{ width: 16, height: 16, tintColor: COLORS.white }}
                                        source={IMAGES.more}
                                    />
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                );
            })}
            {isSheetOpen && (
                <PostoptionSheet
                    ref={optionSheetRef}
                    onNotInterested={(postId: string) => {
                        onNotInterested(postId);
                    }}
                />
            )}
        </View>
    );
});

export default ProfilePostData;