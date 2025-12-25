import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../../../apiInterpretor/apiInterceptor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMAGES } from "../../../constants/theme";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

// Floating particle component
const FloatingParticle = ({ delay, startX, startY }: { delay: number; startX: number; startY: number }) => {
  const translateY = useRef(new Animated.Value(startY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  const color = Math.random() > 0.5 ? '#FFD700' : '#32CD32';
  const size = Math.random() * 5 + 3;

  useEffect(() => {
    const startAnimation = () => {
      translateY.setValue(startY);
      opacity.setValue(0);
      scale.setValue(0.5);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: startY - 120 - Math.random() * 80,
          duration: 3500 + Math.random() * 1500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.delay(1800),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(startAnimation, Math.random() * 2500);
      });
    };

    setTimeout(startAnimation, delay);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    />
  );
};

// Animated Feature Row
const AnimatedFeature = ({ icon, text, delay }: { icon: string; text: string; delay: number }) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featureRow,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <View style={styles.featureIconContainer}>
        <Icon name={icon} size={20} color="#32CD32" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  );
};

const SubscriptionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id, price, duration } = route.params || {};

  const [planDetails, setPlanDetails] = useState({
    price: price || '',
    duration: duration || '',
    planType: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedPlans, setFetchedPlans] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupSubtitle, setPopupSubtitle] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  // Animations
  const rocketBounce = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const priceGlow = useRef(new Animated.Value(0)).current;
  const buttonShimmer = useRef(new Animated.Value(0)).current;
  const popupSlide = useRef(new Animated.Value(300)).current;
  const popupFade = useRef(new Animated.Value(0)).current;

  // Particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3000,
    startX: Math.random() * width,
    startY: height * 0.4 + Math.random() * height * 0.4,
  }));

  useEffect(() => {
    // Rocket bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rocketBounce, {
          toValue: -15,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(rocketBounce, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Title entrance
    Animated.parallel([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 6,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Price glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(priceGlow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(priceGlow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Button shimmer
    Animated.loop(
      Animated.timing(buttonShimmer, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  // Popup animation
  useEffect(() => {
    if (showPopup) {
      Animated.parallel([
        Animated.spring(popupSlide, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(popupFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(popupSlide, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(popupFade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showPopup]);

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/api/user/getall/subscriptions");
        const plans = response.data.plans.map((plan: any) => ({
          id: plan._id,
          duration: `${plan.durationYears} ${plan.durationYears === "1" ? "year" : "years"}`,
          price: plan.price.toString(),
          planType: parseInt(plan.durationYears) >= 1 ? "Premium" : "Basic",
        }));
        setFetchedPlans(plans);

        if (id && price && duration) {
          const matchingPlan = plans.find((plan: any) => plan.id === id);
          setPlanDetails({
            price,
            duration,
            planType: matchingPlan ? matchingPlan.planType : "Basic",
          });
          return;
        }

        const maxDurationPlan = plans.reduce((max: any, plan: any) => {
          const currentDuration = parseInt(plan.duration.split(" ")[0]);
          const maxDuration = parseInt(max.duration.split(" ")[0]);
          return currentDuration > maxDuration ? plan : max;
        }, plans[0]);

        setPlanDetails({
          price: maxDurationPlan.price,
          duration: maxDurationPlan.duration,
          planType: maxDurationPlan.planType,
        });
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlanDetails({ price: "499", duration: "1 Year", planType: "Basic" });
      }
    };

    fetchPlans();
  }, [id, price, duration]);

  const handleTrialActivation = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setPopupType('error');
        setPopupMessage('Login Required');
        setPopupSubtitle('Please login to activate the trial.');
        setShowPopup(true);
        setIsLoading(false);
        return;
      }

      const response = await api.post("/api/user/activate/trial/plan", {});
      if (response.data.subscription.success === false) {
        setPopupType('success');
        setPopupMessage(response.data.subscription.message);
        setPopupSubtitle('');
        setShowPopup(true);
        setTimeout(() => {
          navigation.navigate("DrawerNavigation", { screen: "Home" });
        }, 2000);
      } else if (response.data.subscription.success === true) {
        setPopupType('error');
        setPopupMessage(response.data.subscription.message);
        setPopupSubtitle('');
        setShowPopup(true);
      }
    } catch (error: any) {
      setPopupType('error');
      setPopupMessage('Error');
      setPopupSubtitle(error.response?.data?.message || "Failed to activate trial.");
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setPopupType('error');
        setPopupMessage("Login Required");
        setPopupSubtitle("Please login to subscribe.");
        setShowPopup(true);
        setIsLoading(false);
        return;
      }

      let planId = id;
      if (!planId && fetchedPlans.length > 0) {
        const matchingPlan = fetchedPlans.find((plan) => plan.price === planDetails.price);
        if (matchingPlan) planId = matchingPlan.id;
      }

      if (!planId) {
        setPopupType('error');
        setPopupMessage("No Plan Selected");
        setPopupSubtitle("Please select a plan first.");
        setShowPopup(true);
        setIsLoading(false);
        return;
      }

      const response = await api.post("/api/user/plan/subscription", {
        planId,
        price: planDetails.price,
        duration: planDetails.duration,
        planType: planDetails.planType,
        result: "success",
      });

      if (response.status === 200) {
        setPopupType('success');
        setPopupMessage("Welcome to Premium!");
        setPopupSubtitle(response.data.message || "Subscription activated successfully!");
        setShowPopup(true);
        setTimeout(() => {
          navigation.navigate("DrawerNavigation", { screen: "Home" });
        }, 3000);
      }
    } catch (error: any) {
      setPopupType('error');
      setPopupMessage("Error");
      setPopupSubtitle(error.response?.data?.message || "Subscription failed.");
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const shimmerTranslate = buttonShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const glowOpacity = priceGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const features = [
    { icon: 'download', text: 'Access the download the images' },
    { icon: 'people', text: 'Enable the referrals Dashboard to earn' },
    { icon: 'high-quality', text: 'HD Quality content' },
  ];

  return (
    <LinearGradient
      colors={['#0a1a0a', '#0f2f1a', '#1a3a2a']}
      style={styles.container}
    >
      {/* Floating Particles */}
      <View style={styles.particleContainer}>
        {particles.map((particle) => (
          <FloatingParticle
            key={particle.id}
            delay={particle.delay}
            startX={particle.startX}
            startY={particle.startY}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Rocket with bounce animation */}
        <Animated.View style={{ transform: [{ translateY: rocketBounce }] }}>
          <Image
            source={require("../../../assets/images/rocketss.png")}
            style={styles.rocket}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title */}
        <Animated.View style={{
          opacity: titleFade,
          transform: [{ scale: titleScale }]
        }}>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>Unlock all features</Text>
        </Animated.View>

        {/* Features */}
        <View style={styles.featureContainer}>
          {features.map((feature, index) => (
            <AnimatedFeature
              key={index}
              icon={feature.icon}
              text={feature.text}
              delay={400 + index * 100}
            />
          ))}
        </View>

        {/* Price with glow */}
        <View style={styles.priceContainer}>
          <Animated.View style={[styles.priceGlow, { opacity: glowOpacity }]} />
          <Text style={styles.price}>
            ₹ <Text style={styles.priceValue}>{planDetails.price}</Text>
            <Text style={styles.duration}> /{planDetails.duration}</Text>
          </Text>
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={isLoading}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#FFD700", "#32CD32"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Animated.View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: [{ translateX: shimmerTranslate }],
              }}
            />
            <Icon name="diamond" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>
              {isLoading ? "Processing..." : "Go Premium"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Other Options */}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("PlanSubcribe")}>
            <Text style={styles.otherPlans}>View Other Plans</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTrialActivation} disabled={isLoading}>
            {/* <Text style={[styles.trialLink, isLoading && { opacity: 0.5 }]}>
              Try Free Trial
            </Text> */}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success/Error Popup */}
      {showPopup && (
        <Animated.View
          style={[
            styles.popupOverlay,
            {
              opacity: popupFade,
            }
          ]}
        >
          <TouchableOpacity
            style={styles.popupBackdrop}
            onPress={() => setShowPopup(false)}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              styles.popupContainer,
              {
                transform: [{ translateY: popupSlide }],
              }
            ]}
          >
            <LinearGradient
              colors={popupType === 'success' ? ['#1a3a2a', '#0f2f1a'] : ['#3a1a1a', '#2f0f0f']}
              style={styles.popupGradient}
            >
              <View style={[
                styles.popupIconContainer,
                { backgroundColor: popupType === 'success' ? 'rgba(50,205,50,0.2)' : 'rgba(255,100,100,0.2)' }
              ]}>
                <Icon
                  name={popupType === 'success' ? 'check-circle' : 'error'}
                  size={50}
                  color={popupType === 'success' ? '#32CD32' : '#FF6464'}
                />
              </View>
              <Text style={styles.popupTitle}>{popupMessage}</Text>
              {popupSubtitle ? (
                <Text style={styles.popupSubtitle}>{popupSubtitle}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.popupButton}
                onPress={() => setShowPopup(false)}
              >
                <LinearGradient
                  colors={popupType === 'success' ? ["#32CD32", "#228B22"] : ["#FF6464", "#CC5050"]}
                  style={styles.popupButtonGradient}
                >
                  <Text style={styles.popupButtonText}>
                    {popupType === 'success' ? "Awesome!" : "Got it"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.04,
  },
  closeButton: {
    position: "absolute",
    top: height * 0.05,
    right: width * 0.05,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  rocket: {
    width: width * 0.45,
    height: height * 0.28,
    marginBottom: 10,
  },
  title: {
    fontSize: width * 0.075,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginBottom: height * 0.025,
  },
  featureContainer: {
    marginBottom: height * 0.025,
    width: "100%",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(50, 205, 50, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: width * 0.038,
    color: "#fff",
    flex: 1,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: height * 0.03,
    position: 'relative',
  },
  priceGlow: {
    position: 'absolute',
    width: 200,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    top: -20,
  },
  price: {
    fontSize: width * 0.045,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  priceValue: {
    fontSize: width * 0.1,
    fontWeight: "800",
    color: "#fff",
  },
  duration: {
    fontSize: width * 0.035,
    color: "rgba(255,255,255,0.5)",
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: height * 0.025,
    width: '100%',
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop:height*0.025,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gradient: {
    flexDirection: 'row',
    paddingVertical: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
    overflow: 'hidden',
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.048,
    fontWeight: "700",
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  otherPlans: {
    fontSize: width * 0.035,
    color: "#FFD700",
    textDecorationLine: "underline",
  },
  trialLink: {
    fontSize: width * 0.035,
    color: "#32CD32",
    textDecorationLine: "underline",
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
  },
  popupBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  popupContainer: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  popupGradient: {
    padding: 30,
    alignItems: 'center',
  },
  popupIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  popupSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  popupButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    marginTop: 10,
  },
  popupButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  popupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscriptionScreen;