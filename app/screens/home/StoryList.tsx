import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback, useRef } from 'react';
import { View, FlatList, Image, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { IMAGES } from '../../constants/theme';
import api from '../../../apiInterpretor/apiInterceptor';
import { RootStackParamList } from '../../Navigations/RootStackParamList';

interface StoryItemProps {
  title: string;
  image: any;
  isAddStory: boolean;
  isVideo?: boolean;
  onPress: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ title, image, isAddStory, isVideo, onPress }) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <TouchableOpacity
      style={{ marginRight: 12, alignItems: 'center', paddingVertical: 8 }}
      onPress={onPress}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <LinearGradient
          colors={["#FF6B6B", "#FFD93D", "#6BCB77"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 3,
            shadowColor: '#FF6B6B',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Image
            style={{
              width: isAddStory ? 74 : 72, // Inner size as requested
              height: isAddStory ? 74 : 72,
              borderRadius: 50,
              backgroundColor: colors.card,
              borderWidth: isAddStory ? 2 : 0,
              borderColor: colors.card,
            }}
            source={image}
            resizeMode="cover"
          />
          {isAddStory && (
            <View
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#32CD32',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderColor: colors.card,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>+</Text>
            </View>
          )}
          {/* Video indicator overlay */}
          {!isAddStory && isVideo && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 14, marginLeft: 2 }}>▶</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </View>

      <View style={{ marginTop: 6, maxWidth: 85 }}>
        <Text
          style={{
            fontSize: 12,
            color: colors.title,
            textAlign: 'center',
            fontWeight: isAddStory ? '600' : '400',
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Skeleton Story Item Component - Instagram style
const SkeletonStoryItem = ({ colors, pulseAnim }: { colors: any; pulseAnim: Animated.Value }) => {
  const animatedStyle = {
    opacity: pulseAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.7, 0.3],
    }),
  };

  return (
    <View style={{ marginRight: 12, alignItems: 'center', paddingVertical: 8 }}>
      {/* Skeleton Circle */}
      <Animated.View
        style={[
          {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.border || '#E0E0E0',
          },
          animatedStyle,
        ]}
      />
      {/* Skeleton Text */}
      <Animated.View
        style={[
          {
            marginTop: 8,
            width: 60,
            height: 10,
            borderRadius: 4,
            backgroundColor: colors.border || '#E0E0E0',
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

export interface StoryListHandle {
  refreshStories: () => Promise<void>;
}

const StoryList = forwardRef<StoryListHandle>((_, ref) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [profileUrl, setProfileUrl] = useState<any>(IMAGES.profile);
  const [activeAccountType, setActiveAccountType] = useState<string | null>(null);
  const [trendingFeeds, setTrendingFeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pulse animation for skeleton
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Fetch trending feeds function (extracted for refresh)
  const fetchTrendingFeeds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/get/trending/feed');

      if (response.data?.data && Array.isArray(response.data.data)) {
        setTrendingFeeds(response.data.data);
      } else {
        // API returned but no data - just show empty state
        setTrendingFeeds([]);
      }
    } catch (error: any) {
      // Silently handle errors - just show empty state with "Add Story" 
      // This prevents 404 errors from breaking the app
      console.log('Trending feeds not available:', error?.response?.status || error?.message);
      setTrendingFeeds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch profile function (extracted for refresh)
  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get('/api/get/profile/detail');

      let avatarUrl = IMAGES.profile;
      if (response.data?.profile?.profileAvatar && response.data.profile.profileAvatar !== 'Unknown') {
        avatarUrl = {
          uri: response.data.profile.profileAvatar,
        };
      }

      setProfileUrl(avatarUrl);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  // Expose refresh function via ref
  useImperativeHandle(ref, () => ({
    refreshStories: async () => {
      console.log('Refreshing stories...');
      await Promise.all([fetchProfile(), fetchTrendingFeeds()]);
    },
  }));

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Fetch trending feeds on mount
  useEffect(() => {
    fetchTrendingFeeds();
  }, [fetchTrendingFeeds]);

  // Convert trending feeds to story format - GROUP BY USER
  const getStoryData = () => {
    // Add "Add story" item first
    const storyData: any[] = [
      {
        id: '1',
        title: 'Add Post',
        image: profileUrl,
        isAddStory: true,
        isVideo: false,
        feedData: null,
        userStories: [], // Empty for add story
      },
    ];

    // Group feeds by user using a Map
    const userStoriesMap = new Map<string, {
      userId: string;
      userName: string;
      profileAvatar: string | null;
      roleRef: string | null;
      feeds: any[];
    }>();

    trendingFeeds.forEach((feed) => {
      const userId = feed.createdByProfile?.userId || feed.createdByProfile?._id || feed.createdByAccount;
      if (!userId) return; // Skip if no user ID

      const userName = feed.createdByProfile?.userName || 'User';
      const profileAvatar = feed.createdByProfile?.profileAvatar;
      const roleRef = feed.createdByProfile?.roleRef || feed.roleRef;

      if (userStoriesMap.has(userId)) {
        // Add to existing user's stories
        userStoriesMap.get(userId)!.feeds.push(feed);
      } else {
        // Create new user entry
        userStoriesMap.set(userId, {
          userId,
          userName,
          profileAvatar,
          roleRef,
          feeds: [feed],
        });
      }
    });

    // Convert grouped users to story data
    let index = 0;
    userStoriesMap.forEach((userData) => {
      // Use profile avatar for the story thumbnail (Instagram-style)
      let storyImage = IMAGES.profile;
      if (userData.profileAvatar) {
        storyImage = { uri: userData.profileAvatar };
      }

      // Check if any story is a video (for indicator)
      const hasVideo = userData.feeds.some(feed => feed.type === 'video');

      storyData.push({
        id: `user-${userData.userId}-${index}`,
        title: userData.userName.length > 10
          ? userData.userName.substring(0, 10) + '...'
          : userData.userName,
        image: storyImage,
        isAddStory: false,
        isVideo: hasVideo,
        feedData: userData.feeds[0], // First feed for backward compatibility
        userStories: userData.feeds, // All user's stories
        userInfo: {
          userId: userData.userId,
          userName: userData.userName,
          profileAvatar: userData.profileAvatar,
          roleRef: userData.roleRef,
          storyCount: userData.feeds.length, // Number of stories
        },
      });
      index++;
    });

    return storyData;
  };

  const handleStoryPress = (item: any) => {
    if (item.isAddStory) {
      navigation.navigate('AddStory');
    } else if (item.userStories && item.userStories.length > 0) {
      // Use this specific user's stories only
      const userStories = item.userStories.map((feed: any) => ({
        contentUrl: feed.contentUrl,
        type: feed.type,
        userName: feed.createdByProfile?.userName || item.userInfo?.userName || 'User',
        profileAvatar: feed.createdByProfile?.profileAvatar || item.userInfo?.profileAvatar,
        userId: feed.createdByProfile?.userId || item.userInfo?.userId,
        _id: feed._id,
        feedId: feed._id,
        caption: feed.caption,
        totalLikes: feed.totalLikes,
        totalShares: feed.totalShares,
        totalViews: feed.totalViews,
        totalDownloads: feed.totalDownloads,
      }));

      // Group all stories by user for the full status experience
      // Get all users' stories for navigation between users
      const allUserGroups = StoryData
        .filter(story => !story.isAddStory && story.userStories && story.userStories.length > 0)
        .map(story => ({
          userId: story.userInfo?.userId,
          userName: story.userInfo?.userName || 'User',
          profileAvatar: story.userInfo?.profileAvatar,
          stories: story.userStories.map((feed: any) => ({
            contentUrl: feed.contentUrl,
            type: feed.type,
            userName: feed.createdByProfile?.userName || story.userInfo?.userName || 'User',
            profileAvatar: feed.createdByProfile?.profileAvatar || story.userInfo?.profileAvatar,
            userId: feed.createdByProfile?.userId || story.userInfo?.userId,
            _id: feed._id,
            feedId: feed._id,
            caption: feed.caption,
            totalLikes: feed.totalLikes,
            totalShares: feed.totalShares,
            totalViews: feed.totalViews,
            totalDownloads: feed.totalDownloads,
          })),
        }));

      // Find index of clicked user in user groups
      const initialUserIndex = allUserGroups.findIndex(
        group => group.userId === item.userInfo?.userId
      );

      navigation.navigate('status', {
        statusData: userStories, // This user's stories
        initialIndex: 0, // Start from first story of clicked user
        userGroups: allUserGroups, // All users' story groups for navigation
        initialUserIndex: initialUserIndex !== -1 ? initialUserIndex : 0,
        // Fallback params
        name: item.userInfo?.userName || 'User',
        image: item.userInfo?.profileAvatar
          ? { uri: item.userInfo.profileAvatar }
          : IMAGES.profile,
        type: item.feedData?.type || 'image',
        isVideo: item.feedData?.type === 'video',
        contentUrl: item.feedData?.contentUrl,
        profileAvatar: item.userInfo?.profileAvatar,
        feedId: item.feedData?._id,
      });
    }
  };

  // Show loading indicator while fetching data
  // Skeleton loading - Instagram style
  if (loading) {
    const skeletonData = [1, 2, 3, 4, 5]; // Show 5 skeleton items
    return (
      <View style={{ paddingVertical: 12 }}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 8 }}
          horizontal
          data={skeletonData}
          renderItem={() => <SkeletonStoryItem colors={colors} pulseAnim={pulseAnim} />}
          keyExtractor={(item) => item.toString()}
          showsHorizontalScrollIndicator={false}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border + '20',
            paddingBottom: 12,
          }}
        />
      </View>
    );
  }

  const StoryData = getStoryData();

  return (
    <View style={{ paddingVertical: 12 }}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 8 }}
        horizontal
        data={StoryData}
        renderItem={({ item }) => (
          <StoryItem
            title={item.title}
            image={item.image}
            isAddStory={item.isAddStory}
            isVideo={item.isVideo}
            onPress={() => handleStoryPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border + '20',
          paddingBottom: 12,
        }}
      />
    </View>
  );
});

export default StoryList;