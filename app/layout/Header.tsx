import React from 'react';
import { View, Text, TouchableOpacity, Image, Share, Alert } from 'react-native';
import { COLORS, FONTS, IMAGES } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyleSheet } from '../constants/styleSheet';
import { useTheme } from '@react-navigation/native';

const Header = (props: any) => {
  const navigation = useNavigation<any>();
  const { title, onPress, next, transparent, post, share, more, moresheet, share2, homepage, save } = props;

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Share music link here.',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View
      style={[
        GlobalStyleSheet.headerstyle,
        GlobalStyleSheet.container,
        {
          padding: 0,
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
        transparent == true && {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          zIndex: 1,
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
      ]}
    >
      {/* Back button */}
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={[
              { width: 18, height: 18, margin: 10, tintColor: colors.title },
              transparent == true && { tintColor: '#fff' },
            ]}
            source={IMAGES.arrowleft}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text
        style={[
          { ...FONTS.h6, ...FONTS.fontMedium, marginLeft: 10, flex: 1, color: colors.title },
          transparent == true && { color: '#fff' },
        ]}
      >
        {title}
      </Text>

      {/* Next button */}
      {next == true && (
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={onPress}>
          <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: colors.primary }}>next</Text>
        </TouchableOpacity>
      )}

      {/* Post button ✅ fixed */}
      {post == true && (
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={() => {
            if (onPress) {
              onPress(); // Use passed handler (e.g. upload post)
            } else {
              // fallback navigation
              homepage == false
                ? navigation.navigate('Profile')
                : navigation.navigate('DrawerNavigation', { screen: 'Home' });
            }
          }}
        >
          <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: colors.primary }}>Post</Text>
        </TouchableOpacity>
      )}

      {/* Share button */}
      {share == true && (
        <TouchableOpacity onPress={onShare}>
          <Image
            style={[GlobalStyleSheet.image, { tintColor: colors.title, margin: 10 }]}
            source={IMAGES.share}
          />
        </TouchableOpacity>
      )}

      {/* More button */}
      {more == true && (
        <TouchableOpacity onPress={() => moresheet.current.openSheet()}>
          <Image
            style={[GlobalStyleSheet.image, { tintColor: colors.title, margin: 10, marginRight: 0 }]}
            source={IMAGES.more}
          />
        </TouchableOpacity>
      )}

      {/* Share2 text */}
      {share2 == true && (
        <TouchableOpacity onPress={() => navigation.navigate('DrawerNavigation', { screen: 'Home' })}>
          <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: colors.primary }}>share</Text>
        </TouchableOpacity>
      )}

      {/* Save button */}
      {save == true && (
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => navigation.navigate('SavedMusic')}>
          <Image
            style={[GlobalStyleSheet.image, { tintColor: colors.title, margin: 10, marginRight: 0 }]}
            source={IMAGES.save2}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
