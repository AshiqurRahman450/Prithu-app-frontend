import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import Profile from '../screens/profile/Profile';
import Search from '../screens/search/Search';
import Reels from '../screens/reels/Reels';
import Chat from '../screens/chat/Chat';
import BottomTab from '../layout/BottomTab';
import { SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BottomTabParamList } from './BottomTabParamList';

const Tab = createBottomTabNavigator<BottomTabParamList>();

function BottomNavigation() {

    const theme = useTheme();
    const {colors} = theme;
    
    //  create ref here
  const postListRef = React.useRef<any>(null);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
        //  pass postListRef to BottomTab
        tabBar={(props) => <BottomTab {...props} postListRef={postListRef} />}
      >
        <Tab.Screen name="Home">
          {(props) => <HomeScreen {...props} postListRef={postListRef} />}
        </Tab.Screen>
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Reels" component={Reels} />
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </SafeAreaView>
  );

}

export default BottomNavigation;