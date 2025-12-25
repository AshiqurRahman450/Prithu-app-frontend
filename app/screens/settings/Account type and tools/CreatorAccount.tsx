import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';

const CreatorAccount = ({navigation}) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
      <Header title="Creator Account" />
      <ScrollView
        contentContainerStyle={[
          GlobalStyleSheet.container,
          { paddingVertical: 25 },
        ]}
      >
        {/* Title */}
        <Text
          style={{
            fontSize: 26,
            fontWeight: '700',
            color: colors.primary,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
           Switch to Creator Account
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 16,
            color: colors.text,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Unlock tools that help you grow, engage, and earn:
        </Text>

        {/* Feature Cards */}
        <View
          style={{
            backgroundColor: colors.background,
            padding: 18,
            borderRadius: 12,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.title, marginBottom: 6 }}>
            📊 Insights that matter
          </Text>
          <Text style={{ fontSize: 15, color: colors.text }}>
            See which content gets the most attention and discover the best times to post.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            padding: 18,
            borderRadius: 12,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.title, marginBottom: 6 }}>
            🚀 Reach more people
          </Text>
          <Text style={{ fontSize: 15, color: colors.text }}>
            Get your content in front of a bigger audience and drive them to your profile or website to boost brand awareness and sales.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            padding: 18,
            borderRadius: 12,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.title, marginBottom: 6 }}>
            💰 Start earning
          </Text>
          <Text style={{ fontSize: 15, color: colors.text }}>
            Become eligible for features like bonuses, subscriptions, and more ways to monetize your creativity.
          </Text>
        </View>

        {/* Closing Statement */}
        <Text
          style={{
            fontSize: 16,
            color: colors.text,
            marginTop: 25,
            textAlign: 'center',
            fontWeight: '500',
          }}
        >
          Take control of your growth. Turn your passion into impact!
        </Text>

           {/* Next Button */}
        <TouchableOpacity
          style={{
            marginTop: 30,
            backgroundColor: colors.primary,
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 4,
          }}
          onPress={() => navigation.navigate('Categories')} // 👈 adjust this route name
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
            Next
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatorAccount;
