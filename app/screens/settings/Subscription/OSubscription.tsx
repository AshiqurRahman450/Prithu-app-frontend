import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../../../apiInterpretor/apiInterceptor";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

// Floating particle component for background effect
const FloatingParticle = ({ delay, startX, startY }: { delay: number; startX: number; startY: number }) => {
  const translateY = useRef(new Animated.Value(startY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  const color = Math.random() > 0.5 ? '#FFD700' : '#32CD32';
  const size = Math.random() * 6 + 4;

  useEffect(() => {
    const startAnimation = () => {
      translateY.setValue(startY);
      opacity.setValue(0);
      scale.setValue(0.5);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: startY - 150 - Math.random() * 100,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.delay(1500),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(startAnimation, Math.random() * 2000);
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

// Animated Plan Card
const AnimatedPlanCard = ({
  plan,
  isSelected,
  onSelect,
  index,
  totalPlans
}: {
  plan: any;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
  totalPlans: number;
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer animation for popular badge
    if (plan.popular) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    }
  }, []);

  // Scale animation on selection
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1 : 1.02,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect();
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim },
        ],
        opacity: fadeAnim,
        marginBottom: height * 0.025,
      }}
    >
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.planCardSelected,
        ]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* Popular Badge with Shimmer */}
        {plan.popular && (
          <View style={styles.popularBadgeContainer}>
            <LinearGradient
              colors={["#FFD700", "#32CD32"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.popularBadge}
            >
              <Animated.View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: [{ translateX: shimmerTranslate }],
                }}
              />
              <Icon name="star" size={12} color="#fff" />
              <Text style={styles.popularText}>Most Popular</Text>
            </LinearGradient>
          </View>
        )}

        {/* Selection indicator */}
        <View style={styles.radioContainer}>
          <View style={[
            styles.radioOuter,
            isSelected && styles.radioOuterSelected
          ]}>
            {isSelected && (
              <View style={styles.radioInner} />
            )}
          </View>
        </View>

        {/* Plan Details */}
        <View style={styles.planContent}>
          <View style={styles.planLeft}>
            <Text style={styles.planDuration}>{plan.duration}</Text>
            <Text style={styles.planText}>{plan.unit}</Text>
            <View style={[styles.badge, { backgroundColor: plan.badgeColor }]}>
              <Text style={[styles.badgeText, { color: plan.badgeTextColor }]}>
                {plan.badge}
              </Text>
            </View>
          </View>

          <View style={styles.planRight}>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planPerMonth}>{plan.perMonth}</Text>
          </View>
        </View>

        {/* Glow effect for selected card */}
        {isSelected && (
          <View style={styles.selectedGlow} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const SubscriptionPlans = () => {
  const navigation = useNavigation<any>();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  // Animations
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonShimmer = useRef(new Animated.Value(0)).current;

  // Generate floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3000,
    startX: Math.random() * width,
    startY: height * 0.3 + Math.random() * height * 0.5,
  }));

  useEffect(() => {
    // Title entrance animation
    Animated.parallel([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();

    // Button shimmer loop
    Animated.loop(
      Animated.timing(buttonShimmer, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/api/user/getall/subscriptions");
        const fetchedPlans = response.data.plans.map((plan: any) => ({
          id: plan._id,
          duration: plan.durationYears,
          unit: plan.durationYears === "1" ? "year" : "years",
          price: `₹${plan.price}`,
          perMonth: `${(plan.price / (plan.durationDays / 30)).toFixed(1)} / month`,
          badge: `Save ${plan.discount || 0}%`,
          badgeColor: plan.discount >= 40 ? "rgba(50, 205, 50, 0.2)" : plan.discount >= 25 ? "rgba(255, 215, 0, 0.2)" : "rgba(255,255,255,0.1)",
          badgeTextColor: plan.discount >= 25 ? "#32CD32" : "rgba(255,255,255,0.6)",
          popular: plan.discount >= 40,
        }));
        setPlans(fetchedPlans);

        const maxDurationPlan = fetchedPlans.reduce((max: any, plan: any) =>
          parseInt(plan.duration) > parseInt(max.duration) ? plan : max
        );
        setSelectedPlan(maxDurationPlan.id);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlans([]);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);
    if (selectedPlanData) {
      navigation.navigate("Subcribe", {
        id: selectedPlanData.id,
        price: selectedPlanData.price.replace("₹", ""),
        duration: `${selectedPlanData.duration} ${selectedPlanData.unit}`,
      });
    }
  };

  const shimmerTranslate = buttonShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <LinearGradient
      colors={['#0a1a0a', '#0f2f1a', '#1a3a2a']}
      style={styles.gradientContainer}
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
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Crown Icon */}
        <Animated.View
          style={[
            styles.crownContainer,
            {
              opacity: titleFade,
              transform: [{ translateY: titleSlide }],
            }
          ]}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.crownGradient}
          >
            <Icon name="workspace-premium" size={40} color="#fff" />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleFade,
              transform: [{ translateY: titleSlide }],
            }
          ]}
        >
          Premium Plans
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: titleFade,
              transform: [{ translateY: titleSlide }],
            }
          ]}
        >
          Unlock unlimited features
        </Animated.Text>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <AnimatedPlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
              index={index}
              totalPlans={plans.length}
            />
          ))}
        </View>

        {/* Subscribe Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubscribe}
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
              <Icon name="diamond" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Get Premium</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Terms */}
        <Text style={styles.termsText}>
          Cancel anytime • Secure payment
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: width * 0.05,
    paddingTop: height * 0.08,
    paddingBottom: height * 0.05,
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
  crownContainer: {
    marginBottom: 20,
  },
  crownGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "rgba(255,255,255,0.6)",
    marginBottom: height * 0.04,
    textAlign: "center",
  },
  plansContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  planCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.04,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: "relative",
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: "#FFD700",
    borderWidth: 2,
    backgroundColor: "rgba(255, 215, 0, 0.08)",
  },
  selectedGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  popularBadgeContainer: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    left: '50%',
    transform: [{ translateX: -50 }],
    zIndex: 10,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 4,
    overflow: 'hidden',
  },
  popularText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  radioContainer: {
    marginRight: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#FFD700',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  planContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLeft: {
    justifyContent: "center",
  },
  planDuration: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "#fff",
  },
  planText: {
    fontSize: width * 0.035,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  badge: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  planRight: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  planPrice: {
    fontSize: width * 0.055,
    fontWeight: "700",
    color: "#FFD700",
  },
  planPerMonth: {
    fontSize: width * 0.03,
    color: "rgba(255,255,255,0.5)",
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    width: width * 0.85,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    paddingVertical: height * 0.02,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "700",
  },
  termsText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 16,
  },
});

export default SubscriptionPlans;