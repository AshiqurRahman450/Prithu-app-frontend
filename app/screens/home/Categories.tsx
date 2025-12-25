import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import api from '../../../apiInterpretor/apiInterceptor';

const { width } = Dimensions.get("window");
const ITEM_PER_ROW = 4;
const SPACING = 8;
const itemWidth = (width - SPACING * (ITEM_PER_ROW + 1)) / ITEM_PER_ROW;

// Function to get relevant emoji based on category name
const getCategoryEmoji = (categoryName: string): string => {
  const name = categoryName.toLowerCase().trim();

  // Mapping of keywords to emojis
  const emojiMap: { [key: string]: string } = {
    // Entertainment & Media
    'music': '🎵',
    'song': '🎶',
    'audio': '🔊',
    'podcast': '🎙️',
    'video': '🎬',
    'movie': '🎬',
    'film': '🎥',
    'cinema': '🍿',
    'entertainment': '🎭',
    'drama': '🎭',
    'comedy': '😂',
    'funny': '😄',
    'humor': '🤣',
    'meme': '😜',
    'memes': '🤪',
    'viral': '🔥',
    'trending': '📈',
    'gaming': '🎮',
    'game': '🎮',
    'esports': '🕹️',
    'anime': '🎌',
    'cartoon': '📺',
    'tv': '📺',
    'series': '🎞️',
    'show': '📡',

    // Lifestyle
    'food': '🍔',
    'foodie': '🍕',
    'cooking': '👨‍🍳',
    'recipe': '🍳',
    'restaurant': '🍽️',
    'cafe': '☕',
    'coffee': '☕',
    'tea': '🍵',
    'dessert': '🍰',
    'cake': '🎂',
    'drink': '🍹',
    'cocktail': '🍸',
    'travel': '✈️',
    'trip': '🧳',
    'vacation': '🏖️',
    'adventure': '🗺️',
    'explore': '🧭',
    'wanderlust': '🌄',
    'beach': '🏝️',
    'mountain': '🏔️',
    'hotel': '🏨',
    'fashion': '👗',
    'style': '💅',
    'outfit': '👔',
    'clothing': '👕',
    'shoes': '👟',
    'accessories': '👜',
    'jewelry': '💎',
    'luxury': '👑',
    'beauty': '💄',
    'makeup': '💋',
    'skincare': '🧴',
    'haircare': '💇',
    'fitness': '💪',
    'gym': '🏋️',
    'health': '🏥',
    'wellness': '🧘‍♀️',
    'workout': '🏋️',
    'yoga': '🧘',
    'meditation': '🕯️',
    'diet': '🥗',
    'nutrition': '🥑',
    'lifestyle': '🌟',
    'life': '✨',

    // Education & Career
    'education': '📚',
    'learning': '📖',
    'study': '📝',
    'school': '🏫',
    'college': '🎓',
    'university': '🎓',
    'exam': '📋',
    'teacher': '👨‍🏫',
    'student': '👨‍🎓',
    'course': '📒',
    'tutorial': '📓',
    'tips': '💡',
    'tricks': '🪄',
    'hack': '⚡',
    'hacks': '⚡',
    'science': '🔬',
    'chemistry': '🧪',
    'physics': '⚛️',
    'math': '🔢',
    'history': '📜',
    'geography': '🗺️',
    'technology': '💻',
    'tech': '📱',
    'gadget': '📲',
    'smartphone': '📱',
    'laptop': '💻',
    'software': '🖥️',
    'hardware': '🔌',
    'coding': '👨‍💻',
    'programming': '⌨️',
    'developer': '👩‍💻',
    'ai': '🤖',
    'robot': '🤖',
    'future': '🔮',
    'innovation': '💫',
    'startup': '🚀',
    'business': '💼',
    'finance': '💰',
    'money': '💵',
    'investment': '📊',
    'stock': '📈',
    'crypto': '🪙',
    'bitcoin': '₿',
    'career': '🎯',
    'job': '👔',
    'work': '💼',
    'office': '🏢',

    // Nature & Animals
    'nature': '🌿',
    'environment': '🌍',
    'eco': '♻️',
    'green': '🌱',
    'animal': '🐾',
    'animals': '🦋',
    'pet': '🐕',
    'pets': '🐾',
    'dog': '🐶',
    'puppy': '🐕',
    'cat': '🐱',
    'kitten': '😺',
    'bird': '🐦',
    'fish': '🐠',
    'horse': '🐴',
    'wildlife': '🦁',
    'zoo': '🦒',
    'jungle': '🌴',
    'forest': '🌲',
    'ocean': '🌊',
    'sea': '🐚',
    'river': '💧',
    'garden': '🌺',
    'flower': '🌸',
    'plant': '🌱',
    'tree': '🌳',
    'weather': '🌤️',
    'rain': '🌧️',
    'sun': '☀️',
    'sunset': '🌅',
    'sunrise': '🌄',

    // Sports
    'sports': '⚽',
    'sport': '🏆',
    'football': '🏈',
    'soccer': '⚽',
    'cricket': '🏏',
    'basketball': '🏀',
    'tennis': '🎾',
    'badminton': '🏸',
    'volleyball': '🏐',
    'golf': '⛳',
    'swimming': '🏊',
    'running': '🏃',
    'cycling': '🚴',
    'boxing': '🥊',
    'wrestling': '🤼',
    'martial': '🥋',
    'hockey': '🏒',
    'skating': '⛸️',
    'skiing': '⛷️',
    'surfing': '🏄',
    'champion': '🏆',
    'winner': '🥇',

    // Arts & Creativity
    'art': '🎨',
    'artist': '👨‍🎨',
    'painting': '🖼️',
    'drawing': '✏️',
    'sketch': '📐',
    'design': '✨',
    'graphic': '🎨',
    'illustration': '🖌️',
    'photography': '📷',
    'photo': '📸',
    'photographer': '📸',
    'camera': '📷',
    'portrait': '🖼️',
    'creative': '🎪',
    'creativity': '💫',
    'craft': '🎀',
    'handmade': '🧵',
    'diy': '🔧',
    'writing': '✍️',
    'writer': '📝',
    'author': '📖',
    'book': '📕',
    'books': '📚',
    'reading': '📖',
    'poetry': '📜',
    'dance': '💃',
    'dancing': '🕺',
    'singer': '🎤',
    'singing': '🎤',
    'theater': '🎭',

    // Social & Relationship
    'love': '❤️',
    'romance': '💘',
    'dating': '💑',
    'relationship': '💕',
    'couple': '💏',
    'marriage': '💒',
    'family': '👨‍👩‍👧‍👦',
    'mom': '👩',
    'dad': '👨',
    'parent': '👪',
    'friends': '👯',
    'friendship': '🤝',
    'social': '🤝',
    'community': '👥',
    'people': '👫',

    // News & Current Affairs
    'news': '📰',
    'breaking': '🔴',
    'update': '📢',
    'politics': '🏛️',
    'government': '🏛️',
    'election': '🗳️',
    'world': '🌍',
    'global': '🌐',
    'economy': '📊',
    'market': '📈',

    // Religion & Spirituality
    'motivation': '🚀',
    'motivational': '💪',
    'inspiration': '💡',
    'inspirational': '✨',
    'quotes': '💬',
    'quote': '📝',
    'success': '🏆',
    'mindset': '🧠',
    'positive': '😊',
    'happiness': '😃',
    'spiritual': '🙏',
    'spirituality': '☮️',
    'religious': '⛪',
    'religion': '🕌',
    'prayer': '🙏',
    'god': '✝️',
    'hindu': '🕉️',
    'islam': '☪️',
    'buddha': '☸️',
    'astrology': '🔮',
    'zodiac': '♈',
    'horoscope': '⭐',

    // Vehicles & Transport
    'car': '🚗',
    'cars': '🚙',
    'automobile': '🏎️',
    'bike': '🏍️',
    'motorcycle': '🏍️',
    'bicycle': '🚲',
    'vehicle': '🚗',
    'transport': '🚌',
    'train': '🚂',
    'airplane': '✈️',
    'flight': '🛫',
    'ship': '🚢',

    // Home & Living
    'home': '🏠',
    'house': '🏡',
    'interior': '🛋️',
    'decor': '🖼️',
    'furniture': '🪑',
    'kitchen': '🍳',
    'bedroom': '🛏️',
    'bathroom': '🛁',
    'cleaning': '🧹',
    'organize': '📦',

    // Events & Celebrations
    'wedding': '💒',
    'party': '🎉',
    'celebration': '🎊',
    'festival': '🎪',
    'birthday': '🎂',
    'anniversary': '💝',
    'holiday': '🎄',
    'christmas': '🎅',
    'diwali': '🪔',
    'eid': '🌙',
    'holi': '🎨',
    'newyear': '🎆',
    'valentine': '💝',

    // Kids & Parenting
    'kids': '👶',
    'kid': '👧',
    'children': '👦',
    'child': '🧒',
    'baby': '🍼',
    'toddler': '👶',
    'parenting': '👪',
    'momlife': '🤱',
    'toys': '🧸',
    'toy': '🧸',

    // Shopping & Commerce
    'shopping': '🛒',
    'shop': '🛍️',
    'sale': '🏷️',
    'discount': '💸',
    'deal': '🤑',
    'offer': '🎁',
    'gift': '🎁',
    'review': '⭐',
    'product': '📦',
    'brand': '™️',

    // Miscellaneous
    'random': '🎲',
    'misc': '📂',
    'general': '📁',
    'other': '📋',
    'more': '➕',
    'new': '🆕',
    'hot': '🔥',
    'popular': '⭐',
    'best': '👍',
    'top': '🔝',
    'special': '💫',
    'exclusive': '👑',
    'premium': '💎',
    'free': '🆓',
    'daily': '📅',
    'weekly': '📆',
    'story': '📖',
    'stories': '📚',
    'status': '💭',
    'reels': '🎬',
    'shorts': '📱',
    'vlog': '🎥',
    'blog': '📝',
  };

  // Check for exact match first
  if (emojiMap[name]) {
    return emojiMap[name];
  }

  // Check if category name contains any keyword
  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    if (name.includes(keyword)) {
      return emoji;
    }
  }

  // Default emoji for unknown categories - attractive sparkle
  return '✨';
};

// Skeleton Loader Component
const SkeletonCategoryItem = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmer]);

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <View style={[styles.gradient, { width: itemWidth }]}>
      <Animated.View
        style={[
          styles.item,
          { opacity: shimmerOpacity }
        ]}
      >
        <Animated.View
          style={[
            styles.skeletonText,
            { opacity: shimmerOpacity }
          ]}
        />
      </Animated.View>
    </View>
  );
};

// Main Categories Component
interface CategoriesProps {
  onSelectCategory: (id: string | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/user/get/content/catagories");
        console.log("📦 Categories API Response:", response.status, response.data);

        if (Array.isArray(response.data.categories)) {
          const safeCategories = response.data.categories.map((cat: any, index: number) => ({
            _id: cat._id || index,
            name: cat.name || "Unnamed",
          }));
          setCategories(safeCategories);
        }
      } catch (err: any) {
        console.error("❌ Error fetching categories:", err.response?.status, err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle Category Selection
  const handleSelect = (id: string | null) => {
    setSelectedCategory(id);
    onSelectCategory(id);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {[...Array(ITEM_PER_ROW + 2)].map((_, index) => (
            <SkeletonCategoryItem key={index} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 'All' Button - Always at the Start */}
          <LinearGradient
            colors={["#FF6B6B", "#FFD93D", "#6BCB77"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <TouchableOpacity
              style={[
                styles.item,
                selectedCategory === "all"
                  ? { backgroundColor: "transparent" } // full gradient when selected
                  : { backgroundColor: "#fff" }, // white inside with gradient border
              ]}
              activeOpacity={1}
              onPress={() => {
                setSelectedCategory("all");
                onSelectCategory(null); // tell PostList to fetch all posts
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: selectedCategory === "all" ? "#fff" : "#333",
                    fontWeight: selectedCategory === "all" ? "600" : "500",
                  },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Other Categories */}
          {categories.map((cat, id) => {
            const isSelected = selectedCategory === cat._id;
            return (
              <LinearGradient
                key={cat._id || id}
                colors={["#FF6B6B", "#FFD93D", "#6BCB77"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <TouchableOpacity
                  style={[
                    styles.item,
                    isSelected
                      ? { backgroundColor: "transparent" } // full gradient when selected
                      : { backgroundColor: "#fff" }, // white with border when not selected
                  ]}
                  onPress={() => handleSelect(cat._id)}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: isSelected ? "#fff" : "#333",
                        fontWeight: isSelected ? "600" : "500",
                      },
                    ]}
                  >
                    {getCategoryEmoji(cat.name)} {cat.name}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    // paddingVertical: 12,
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    justifyContent: "flex-start",
  },
  gradient: {
    borderRadius: 16,
    marginRight: SPACING,
    padding: 2,
  },
  item: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    minWidth: itemWidth,
  },
  text: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  skeletonText: {
    height: 20,
    width: itemWidth - 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});

export default Categories;