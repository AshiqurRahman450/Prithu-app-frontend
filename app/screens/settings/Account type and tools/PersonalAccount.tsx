import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';

const PersonalAccount = ({navigation}) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
      <Header title="Personal Account" />
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
          Switch to User Account
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
         Enjoy a simpler experience tailored for personal use:
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
           👥 Stay connected
          </Text>
          <Text style={{ fontSize: 15, color: colors.text }}>
          Share your favorite moments with friends and family without the extra tools.
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
           🎯 Focus on you
          </Text>
          <Text style={{ fontSize: 15, color: colors.text }}>
           Enjoy a clutter-free experience designed for everyday sharing and engagement.
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
           🔒 More privacy
          </Text>
          <Text style={{ fontSize: 15, color: colors.text }}>
           Keep things personal with fewer professional features and more control over who sees your content.
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
           Take it easy. Share your life, your way!
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
          onPress={() => navigation.navigate('AccountType')} // 👈 adjust this route name
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
            Next
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalAccount;
