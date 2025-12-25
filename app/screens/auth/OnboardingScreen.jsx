 
import React, { useState, useEffect, useRef } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
 
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
} from "react-native";
import Swiper from "react-native-swiper";
import * as Font from "expo-font";
 
const { width, height } = Dimensions.get("window");
 
export default function OnboardingScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);
  const progressAnim = useRef(
    [0, 1, 2].map(() => new Animated.Value(0))
  ).current;
  const timerRef = useRef(null);
 
  const slides = [
    {
      id: 1,
      image: require("../../assets/images/screen1.png"),
    //   title: "Your Daily Dose of Emotions",
      description:
        "Celebrate emotions through curated images, quotes & stories.",
    },
    {
      id: 2,
      image: require("../../assets/images/screen2.jpg"),
    //   title: "Spread Positivity and grow up",
      description:
        "One click to inspire your circle, social media & more",
    },
    {
      id: 3,
      image: require("../../assets/images/screen3.jpg"),
    //   title: "Build a Kind Community",
      description: "Uplift yourself and others with love, stories & support.",
    },
  ];
 
    useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Birthstone-Regular": require("../../assets/images/Birthstone-Regular.ttf"),
        Mono: require("../../assets/images/Monospace.ttf"),
      });
      setFontsLoaded(true);
      startProgress(0);
    };
    loadFonts();
  }, []);
 
  const startProgress = (index) => {
    // Reset previous animations
    progressAnim.forEach((bar, i) => {
      bar.setValue(i < index ? 1 : 0);
    });
 
    Animated.timing(progressAnim[index], {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        if (index < slides.length - 1) {
          swiperRef.current?.scrollBy(1);
        } else {
          navigation.navigate("Login");
        }
      }
    });
  };
 
  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex < slides.length - 1) {
      swiperRef.current?.scrollBy(1);
    } else {
      navigation.navigate("Login");
    }
  };
 
  const handlePrev = () => {
    if (currentIndex > 0) {
      swiperRef.current?.scrollBy(-1);
    }
  };
 
//   if (!fontsLoaded) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#7b61ff" />
//       </View>
//     );
//   }
 
  return (
    <View style={{ flex: 1 }}>
      {/* Top animated progress bar */}
      <View style={styles.progressBarContainer}>
        {slides.map((_, i) => (
          <View key={i} style={styles.progressSegment}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: "#7b61ff",
                  width: progressAnim[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                  borderRadius: 2,
                },
              ]}
            />
          </View>
        ))}
      </View>
 
      <Swiper
        ref={swiperRef}
        loop={false}
        scrollEnabled={false}
        index={currentIndex}
        onIndexChanged={(index) => {
          setCurrentIndex(index);
          if (timerRef.current) clearTimeout(timerRef.current);
          startProgress(index);
        }}
        showsPagination={false}
      >
        {slides.map((slide, i) => (
          <View key={slide.id} style={styles.slide}>
            {/* Left & Right tap zones */}
            <TouchableOpacity style={styles.touchLeft} onPress={handlePrev} />
            <TouchableOpacity style={styles.touchRight} onPress={handleNext} />
 
            <Image source={slide.image} style={styles[`img${slide.id}`]} />
            <Text style={styles[`title${slide.id}`]}>{slide.title}</Text>
            <Text style={styles[`description${slide.id}`]}>{slide.description}</Text>
             </View>
        ))}
      </Swiper>
          <TouchableOpacity
          style={styles.skipWrapper}
          onPress={() => navigation.navigate("Login")}>
          {currentIndex === slides.length - 1 ? (
          <View style={styles.button}>
          <Text style={[styles.buttonText, { color: "#7b61ff" }]}>Skip</Text>
             </View>) : (
         <View style={styles.skipContent}>
         <Text style={styles.skipText}>Skip</Text>
        </View>
          )}
            </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  img1: {
    width: width * 0.9,
    height: height * 0.55,
    marginBottom: 30,
    marginRight: -8,
    resizeMode: "cover",
    marginTop: -30
  },
  img2: {
    width: width * 1.0,
    height: height * 0.6,
    marginBottom: 30,
    resizeMode: "contain",
    marginTop: -30
  },
  img3: {
    width: width,
    height: height * 0.45,
    marginBottom: 30,
    resizeMode: "stretch",
    marginTop: -10
  },
  title1: {
  fontSize: 25,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  position: "absolute",
  marginBottom: -310
},
 
title2: {
  fontSize: 25,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  position: "absolute",
   marginBottom: -300,
},
 
title3: {
  fontSize: 25,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  position: "absolute",
  marginBottom: -290,
},
 
   description1: {
    fontSize: 20,
    // fontFamily: "Mono",
    fontWeight: 400,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 50,
  },
   description2: {
    fontSize: 20,
    // fontFamily: "Mono",
    fontWeight: 400,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 10,
  },
   description3: {
    fontSize: 20,
    // fontFamily: "Mono",
    fontWeight: 400,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 90,
  },
  button: {
  paddingHorizontal: 40,
  paddingVertical: 12,
  borderRadius: 10,
  marginTop: -20,
  alignSelf: "center",
  marginLeft: -180
},
  buttonText: {
  fontSize: 15,
  color: "black", // explicitly black
},
 
  skipWrapper: {
    width: "90%",
    position: "absolute",
    bottom: 100,
  },
  skipContent: {
 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: -20,
    marginLeft : 50
  },
  skipText: {
    color: "#7b61ff",
    fontSize: 15,
  },
  progressBarContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    height: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 100,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    marginHorizontal: 2,
    overflow: "hidden",
  },
  touchLeft: {
    position: "absolute",
    left: 0,
    width: "40%",
    height: "100%",
    zIndex: 10,
  },
  touchRight: {
    position: "absolute",
    right: 0,
    width: "60%",
    height: "100%",
    zIndex: 10,
  },
});
 
 
 