import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../../../apiInterpretor/apiInterceptor';

const { width, height } = Dimensions.get('window');

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
          toValue: startY - 100 - Math.random() * 60,
          duration: 3500 + Math.random() * 1500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
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
          toValue: 1,
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

// Animated detail row
const AnimatedDetailRow = ({
  icon,
  label,
  value,
  delay,
  isHighlight = false
}: {
  icon: string;
  label: string;
  value: string;
  delay: number;
  isHighlight?: boolean;
}) => {
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
        styles.detailRow,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <View style={styles.detailLeft}>
        <View style={[styles.iconContainer, isHighlight && styles.iconContainerHighlight]}>
          <Icon name={icon} size={20} color={isHighlight ? "#FFD700" : "#32CD32"} />
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={[styles.detailValue, isHighlight && styles.detailValueHighlight]}>
        {value}
      </Text>
    </Animated.View>
  );
};

const SubscriptionDetails = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { plan } = route.params as { plan: any };

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupSubtitle, setPopupSubtitle] = useState('');
  const [isCancelConfirm, setIsCancelConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animations
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(1)).current;
  const popupSlide = useRef(new Animated.Value(300)).current;
  const popupFade = useRef(new Animated.Value(0)).current;

  // Particles
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3000,
    startX: Math.random() * width,
    startY: height * 0.3 + Math.random() * height * 0.5,
  }));

  useEffect(() => {
    // Card entrance animation
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Badge pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
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
      ]).start(() => setIsCancelConfirm(false));
    }
  }, [showPopup]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (durationDays: number) => {
    if (!durationDays) return 'N/A';
    if (durationDays >= 365) return `${Math.floor(durationDays / 365)} Year${durationDays >= 730 ? 's' : ''}`;
    if (durationDays >= 30) return `${Math.floor(durationDays / 30)} Month${durationDays >= 60 ? 's' : ''}`;
    return `${durationDays} Days`;
  };

  const handleCancelSubscription = () => {
    if (!plan.id) {
      setPopupMessage('Error');
      setPopupSubtitle('Subscription ID is missing');
      setShowPopup(true);
      return;
    }

    setPopupMessage('Cancel Subscription?');
    setPopupSubtitle('Your premium benefits will end immediately. This action cannot be undone.');
    setIsCancelConfirm(true);
    setShowPopup(true);
  };

  const handlePopupAction = async () => {
    if (isCancelConfirm) {
      setIsLoading(true);
      try {
        const response = await api.put('/api/user/cancel/subscription', {
          subscriptionId: plan.id,
        });

        setPopupMessage('Cancelled');
        setPopupSubtitle(response.data.message || 'Subscription cancelled successfully');
        setIsCancelConfirm(false);
        setShowPopup(true);
        setTimeout(() => navigation.goBack(), 1500);
      } catch (error: any) {
        setPopupMessage('Error');
        setPopupSubtitle(error.response?.data?.message || 'Failed to cancel');
        setIsCancelConfirm(false);
        setShowPopup(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowPopup(false);
    }
  };

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

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Badge */}
          <Animated.View style={[styles.badgeContainer, { transform: [{ scale: badgePulse }] }]}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.premiumBadge}
            >
              <Icon name="workspace-premium" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.premiumText}>Premium Active</Text>
            <Text style={styles.premiumSubtext}>You have full access to all features</Text>
          </Animated.View>

          {/* Details Card */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ scale: cardScale }],
                opacity: cardFade,
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Plan Details</Text>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>

            <AnimatedDetailRow
              icon="payments"
              label="Monthly Cost"
              value={`₹${Math.ceil(plan.price / 30)}/mo`}
              delay={200}
              isHighlight
            />

            <AnimatedDetailRow
              icon="schedule"
              label="Duration"
              value={formatDuration(plan.duration)}
              delay={300}
            />

            <AnimatedDetailRow
              icon="event"
              label="Started On"
              value={formatDate(plan.startDate)}
              delay={400}
            />

            <AnimatedDetailRow
              icon="event-available"
              label="Renews On"
              value={formatDate(plan.endDate)}
              delay={500}
              isHighlight
            />

            <AnimatedDetailRow
              icon="person"
              label="Account"
              value={plan.userName || 'Your Account'}
              delay={600}
            />
          </Animated.View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
            activeOpacity={0.8}
          >
            <Icon name="cancel" size={20} color="#FF6464" style={{ marginRight: 8 }} />
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>

          <Text style={styles.noteText}>
            Cancellation will take effect immediately
          </Text>
        </ScrollView>

        {/* Popup */}
        {showPopup && (
          <Animated.View
            style={[styles.popupOverlay, { opacity: popupFade }]}
          >
            <TouchableOpacity
              style={styles.popupBackdrop}
              onPress={() => !isCancelConfirm && setShowPopup(false)}
              activeOpacity={1}
            />
            <Animated.View
              style={[styles.popupContainer, { transform: [{ translateY: popupSlide }] }]}
            >
              <LinearGradient
                colors={isCancelConfirm ? ['#2f1a1a', '#1f0f0f'] : ['#1a3a2a', '#0f2f1a']}
                style={styles.popupGradient}
              >
                <View style={[
                  styles.popupIconContainer,
                  { backgroundColor: isCancelConfirm ? 'rgba(255,100,100,0.2)' : 'rgba(50,205,50,0.2)' }
                ]}>
                  <Icon
                    name={isCancelConfirm ? 'warning' : 'check-circle'}
                    size={40}
                    color={isCancelConfirm ? '#FF6464' : '#32CD32'}
                  />
                </View>
                <Text style={styles.popupTitle}>{popupMessage}</Text>
                <Text style={styles.popupSubtitle}>{popupSubtitle}</Text>

                {isCancelConfirm ? (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.popupButton, styles.cancelConfirmButton]}
                      onPress={handlePopupAction}
                      disabled={isLoading}
                    >
                      <Text style={styles.popupButtonText}>
                        {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.popupButton, styles.keepButton]}
                      onPress={() => setShowPopup(false)}
                    >
                      <Text style={[styles.popupButtonText, { color: '#fff' }]}>Keep Plan</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.singleButton}
                    onPress={handlePopupAction}
                  >
                    <LinearGradient
                      colors={["#32CD32", "#228B22"]}
                      style={styles.singleButtonGradient}
                    >
                      <Text style={styles.popupButtonText}>Got it</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        )}
      </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  premiumBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  premiumText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  premiumSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(50,205,50,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#32CD32',
    marginRight: 6,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#32CD32',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(50,205,50,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerHighlight: {
    backgroundColor: 'rgba(255,215,0,0.15)',
  },
  detailLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  detailValueHighlight: {
    color: '#FFD700',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.3)',
    backgroundColor: 'rgba(255,100,100,0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6464',
  },
  noteText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
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
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  popupSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  popupButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelConfirmButton: {
    backgroundColor: '#FF6464',
  },
  keepButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  singleButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  singleButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  popupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SubscriptionDetails;