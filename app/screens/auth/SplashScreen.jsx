import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import vd from '../../assets/images/splash1.mp4'

const SplashVideo = ({ navigation }) => {
  const video = useRef(null);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={vd} // Make sure this file exists
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            navigation.replace('Onbording');
          }
        }}
      />
    </View>
  );
};

export default SplashVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
