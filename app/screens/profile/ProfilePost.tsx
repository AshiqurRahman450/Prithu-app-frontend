import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    StyleSheet,
    InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, IMAGES, SIZES } from '../../constants/theme';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import PostShareSheet from '../../components/bottomsheet/PostShareSheet';
import PostoptionSheet from '../../components/bottomsheet/PostoptionSheet';
import PostCard from '../../components/PostCard';
import api from '../../../apiInterpretor/apiInterceptor';
import { themeColorCache, cachePostColors, extractThemeColors, DEFAULT_THEME_COLORS } from '../../utils/ThemeColorCache';

const { height: windowHeight } = Dimensions.get("window");

// Memoized PostCard for performance
const MemoPostCard = memo(PostCard, (prev, next) =>
    prev.id === next.id &&
    prev.postimage?.[0]?.image === next.postimage?.[0]?.image &&
    prev.caption === next.caption &&
    prev.like === next.like &&
    prev.isLiked === next.isLiked &&
    prev.isSaved === next.isSaved &&
    prev.isDisliked === next.isDisliked &&
    prev.dislikesCount === next.dislikesCount &&
    prev.commentsCount === next.commentsCount
);

interface Post {
    _id: string;
    creatorUsername: string;
    creatorAvatar: string | null;
    timeAgo: string;
    contentUrl: string;
    caption: string;
    tags: string[];
    background: string;
    commentsCount: number;
    likesCount: number;
    type: string;
    profileUserId: string;
    roleRef: string;
    isLiked: boolean;
    isSaved: boolean;
    isDisliked?: boolean;
    dislikesCount?: number;
    primary: string;
    accent: string;
    textColor?: string;
    avatorToUse: string | null;
}

const ProfilePost = ({ route }: any) => {
    const sheetRef = useRef<any>();
    const moresheet = useRef<any>();
    const flatListRef = useRef<any>();
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [visibilitySettings, setVisibilitySettings] = useState<any>(null);

    // Get route params
    const initialPostId = route?.params?.initialPostId;
    const allPostsData = route?.params?.allPostsData;
    const profileUserId = route?.params?.profileUserId; // For fetching specific user's posts
    const profileUserName = route?.params?.profileUserName;
    const profileAvatarParam = route?.params?.profileAvatar;

    // Fetch user profile and visibility settings
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [profileRes, visRes] = await Promise.all([
                    api.get('/api/get/profile/detail'),
                    api.get('/api/profile/visibility')
                ]);

                if (profileRes.data?.profile) {
                    setUserProfile(profileRes.data.profile);
                }

                if (visRes.data?.success) {
                    setVisibilitySettings(visRes.data.visibility);
                }
            } catch (e) {
                console.log("Error fetching user data:", e);
            }
        };
        fetchUserData();
    }, []);

    // Shuffle array using Fisher-Yates algorithm
    const shuffleArray = useCallback((array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, []);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);

            // If we have allPostsData from Search, use it
            if (allPostsData && allPostsData.length > 0) {
                const mapped: Post[] = allPostsData
                    .filter((item: any) => item.type === 'image')
                    .map((item: any) => {
                        const feedId = item.feedId || item._id;
                        // Try cache first for O(1) instant color lookup
                        const cachedColors = themeColorCache.getColor(feedId);
                        const themeColors = cachedColors || extractThemeColors(item);

                        // Cache for future use if not already cached
                        if (!cachedColors && feedId) {
                            themeColorCache.setColor(feedId, themeColors);
                        }

                        return {
                            _id: feedId,
                            creatorUsername: item.userName || 'Unknown',
                            creatorAvatar: item.profileAvatar !== 'Unknown' ? item.profileAvatar : null,
                            timeAgo: item.timeAgo || 'Unknown',
                            contentUrl: item.contentUrl?.startsWith("http")
                                ? item.contentUrl
                                : `${api.defaults.baseURL}/${item.contentUrl?.replace(/\\/g, "/")}`,
                            caption: item.caption || '',
                            tags: item.tags || [],
                            background: item.background || '#fff',
                            commentsCount: item.commentsCount || 0,
                            likesCount: item.likesCount || 0,
                            type: item.type,
                            profileUserId: item.createdByAccount,
                            roleRef: item.roleRef,
                            isLiked: !!item.isLiked,
                            isSaved: !!item.isSaved,
                            isDisliked: !!item.isDisliked || false,
                            dislikesCount: item.dislikesCount || 0,
                            primary: themeColors.primary,
                            accent: themeColors.accent,
                            textColor: themeColors.textColor,
                            avatorToUse: item.avatarToUse || null,
                        };
                    });

                // If we have an initialPostId, reorder posts to show it first
                if (initialPostId) {
                    const initialIndex = mapped.findIndex((post) => post._id === initialPostId);
                    if (initialIndex !== -1) {
                        const initialPost = mapped[initialIndex];
                        const otherPosts = mapped.filter((_, index) => index !== initialIndex);
                        // Shuffle other posts, keep initial post first
                        setPosts([initialPost, ...shuffleArray(otherPosts)]);
                    } else {
                        setPosts(shuffleArray(mapped));
                    }
                } else {
                    setPosts(shuffleArray(mapped));
                }
            } else if (profileUserId) {
                // Fetch specific user's posts
                const res = await api.post('/api/user/get/post', {
                    profileUserId: profileUserId
                });

                const feeds = res.data.feeds || [];
                const mapped: Post[] = feeds
                    .filter((item: any) => item.type !== 'video' && !item.contentUrl?.endsWith('.mp4'))
                    .map((item: any) => {
                        const feedId = item.feedId || item._id;
                        // Try cache first for O(1) instant color lookup
                        const cachedColors = themeColorCache.getColor(feedId);
                        const themeColors = cachedColors || extractThemeColors(item);

                        // Cache for future use if not already cached
                        if (!cachedColors && feedId) {
                            themeColorCache.setColor(feedId, themeColors);
                        }

                        return {
                            _id: feedId,
                            creatorUsername: profileUserName || item.userName || 'Unknown',
                            creatorAvatar: profileAvatarParam || (item.profileAvatar !== 'Unknown' ? item.profileAvatar : null),
                            timeAgo: item.timeAgo || 'Recently',
                            contentUrl: item.contentUrl?.startsWith("http")
                                ? item.contentUrl
                                : `${api.defaults.baseURL}/${item.contentUrl?.replace(/\\/g, "/")}`,
                            caption: item.caption || '',
                            tags: item.tags || [],
                            background: item.background || '#fff',
                            commentsCount: item.commentsCount || 0,
                            likesCount: item.likesCount || item.likeCount || 0,
                            type: 'image',
                            profileUserId: profileUserId,
                            roleRef: item.roleRef || 'User',
                            isLiked: !!item.isLiked,
                            isSaved: !!item.isSaved,
                            isDisliked: !!item.isDisliked || false,
                            dislikesCount: item.dislikesCount || 0,
                            primary: themeColors.primary,
                            accent: themeColors.accent,
                            textColor: themeColors.textColor,
                            avatorToUse: item.avatarToUse || profileAvatarParam || null,
                        };
                    });

                // If initialPostId provided, put that post first
                if (initialPostId) {
                    const initialIndex = mapped.findIndex((post) => post._id === initialPostId);
                    if (initialIndex !== -1) {
                        const initialPost = mapped[initialIndex];
                        const otherPosts = mapped.filter((_, index) => index !== initialIndex);
                        setPosts([initialPost, ...shuffleArray(otherPosts)]);
                    } else {
                        setPosts(shuffleArray(mapped));
                    }
                } else {
                    setPosts(shuffleArray(mapped));
                }
            } else {
                // Fetch all posts normally (current user's feed)
                const res = await api.get('/api/get/all/feeds/user');

                const feeds = res.data.feeds || [];
                const mapped: Post[] = feeds
                    .filter((item: any) => item.type === 'image')
                    .map((item: any) => {
                        const feedId = item.feedId || item._id;
                        // Try cache first for O(1) instant color lookup
                        const cachedColors = themeColorCache.getColor(feedId);
                        const themeColors = cachedColors || extractThemeColors(item);

                        // Cache for future use if not already cached
                        if (!cachedColors && feedId) {
                            themeColorCache.setColor(feedId, themeColors);
                        }

                        return {
                            _id: feedId,
                            creatorUsername: item.userName || 'Unknown',
                            creatorAvatar: item.profileAvatar !== 'Unknown' ? item.profileAvatar : null,
                            timeAgo: item.timeAgo || 'Unknown',
                            contentUrl: item.contentUrl?.startsWith("http")
                                ? item.contentUrl
                                : `${api.defaults.baseURL}/${item.contentUrl?.replace(/\\/g, "/")}`,
                            caption: item.caption || '',
                            tags: item.tags || [],
                            background: item.background || '#fff',
                            commentsCount: item.commentsCount || 0,
                            likesCount: item.likesCount || 0,
                            type: item.type,
                            profileUserId: item.createdByAccount,
                            roleRef: item.roleRef,
                            isLiked: !!item.isLiked,
                            isSaved: !!item.isSaved,
                            isDisliked: !!item.isDisliked || false,
                            dislikesCount: item.dislikesCount || 0,
                            primary: themeColors.primary,
                            accent: themeColors.accent,
                            textColor: themeColors.textColor,
                            avatorToUse: item.avatarToUse || null,
                        };
                    });

                // Shuffle posts for randomized order
                setPosts(shuffleArray(mapped));
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [allPostsData, initialPostId, profileUserId, profileUserName, profileAvatarParam, shuffleArray]);

    useEffect(() => {
        if (isFocused) {
            fetchPosts();
        }
    }, [isFocused, fetchPosts]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchPosts();
    }, [fetchPosts]);

    // Handlers for post actions
    const handleDislikeUpdate = useCallback((postId: string, newIsDisliked: boolean, newDislikeCount: number) => {
        setPosts((prevPosts) =>
            prevPosts.map((p) =>
                p._id === postId
                    ? { ...p, isDisliked: newIsDisliked, dislikesCount: newDislikeCount }
                    : p
            )
        );
    }, []);

    const handleLikeUpdate = useCallback((postId: string, newIsLiked: boolean, newLikeCount: number) => {
        setPosts((prevPosts) =>
            prevPosts.map((p) =>
                p._id === postId ? { ...p, isLiked: newIsLiked, likesCount: newLikeCount } : p
            )
        );
    }, []);

    const handleNotInterested = useCallback((postId: string) => {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
    }, []);

    const handleHidePost = useCallback((postId: string) => {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
    }, []);

    // Stable keyExtractor
    const keyExtractor = useCallback((item: Post) => item._id, []);

    // Estimated item height for getItemLayout
    const ESTIMATED_ITEM_HEIGHT = windowHeight * 0.7;

    const getItemLayout = useCallback((_: any, index: number) => ({
        length: ESTIMATED_ITEM_HEIGHT,
        offset: ESTIMATED_ITEM_HEIGHT * index,
        index,
    }), []);

    // Memoized visible boxes (empty for this use case)
    const memoVisibleBoxes = useMemo(() => [], []);

    // Optimized renderItem
    const renderItem = useCallback(({ item: post, index }: { item: Post; index: number }) => (
        <View style={styles.postItemContainer}>
            <MemoPostCard
                id={post._id}
                postIndex={index}
                themeColor={post.primary}
                textColor={post.textColor}
                avatarToUse={post.avatorToUse}
                name={post.creatorUsername}
                profileimage={post.creatorAvatar}
                date={post.timeAgo}
                postimage={[{ image: post.contentUrl }]}
                like={post.likesCount}
                commentsCount={post.commentsCount}
                posttitle={post.caption}
                posttag={post.tags.join(" ")}
                sheetRef={sheetRef}
                optionSheet={moresheet}
                hasStory={false}
                reelsvideo={null}
                caption={post.caption}
                background={post.background}
                visibleBoxes={memoVisibleBoxes}
                onNotInterested={() => handleNotInterested(post._id)}
                onHidePost={() => handleHidePost(post._id)}
                profileUserId={post.profileUserId}
                roleRef={post.roleRef}
                isLiked={post.isLiked}
                isSaved={post.isSaved}
                isDisliked={post.isDisliked || false}
                dislikesCount={post.dislikesCount || 0}
                currentUserProfile={userProfile}
                visibilitySettings={visibilitySettings}
                onDislikeUpdate={(newIsDisliked: boolean, newDislikeCount: number) =>
                    handleDislikeUpdate(post._id, newIsDisliked, newDislikeCount)
                }
                onLikeUpdate={(newIsLiked: boolean, newLikeCount: number) =>
                    handleLikeUpdate(post._id, newIsLiked, newLikeCount)
                }
            />
        </View>
    ), [memoVisibleBoxes, userProfile, visibilitySettings, handleNotInterested, handleHidePost, handleDislikeUpdate, handleLikeUpdate]);

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
                <Header title="Post" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary || colors.title} />
                </View>
            </SafeAreaView>
        );
    }

    // Empty state
    if (posts.length === 0) {
        return (
            <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
                <Header title="Post" />
                <View style={styles.emptyContainer}>
                    <Text style={{ color: colors.title }}>No posts found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header title="Post" />
            <FlatList
                ref={flatListRef}
                data={posts}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                // Pull to refresh
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                // Performance optimizations for smooth scrolling
                removeClippedSubviews={true}
                maxToRenderPerBatch={3}
                updateCellsBatchingPeriod={50}
                windowSize={5}
                initialNumToRender={3}
                // Scroll performance
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
            <PostShareSheet ref={sheetRef} />
            <PostoptionSheet ref={moresheet} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postItemContainer: {
        width: '100%',
        marginTop: 10,
    },
});

export default ProfilePost;