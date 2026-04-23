import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Truck, ShieldCheck, Clock, ChevronRight } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Onboarding.styles';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Easy Scheduling',
    subtitle: 'Book your laundry pickup with just a few taps. We handle the rest.',
    icon: <Clock size={120} color={COLORS.PRIMARY} />,
    color: '#F0F9FF'
  },
  {
    id: '2',
    title: 'Safe & Secure',
    subtitle: 'Your clothes are treated with care and tracked through every step.',
    icon: <ShieldCheck size={120} color={COLORS.PRIMARY} />,
    color: '#F0FDF4'
  },
  {
    id: '3',
    title: 'Fast Delivery',
    subtitle: 'Freshly cleaned laundry delivered to your door in as little as 24 hours.',
    icon: <Truck size={120} color={COLORS.PRIMARY} />,
    color: '#FFF7ED'
  }
];

const OnboardingScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/(public)/onboarding/get-started');
    }
  };

  const skip = () => {
    router.push('/(public)/onboarding/get-started');
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      <View style={[styles.imageContainer, { backgroundColor: item.color, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }]}>
        {item.icon}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <ScreenWrapper style={styles.container} scroll={false}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={SLIDES}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, i) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                style={[styles.paginationDot, { width: dotWidth, opacity }]}
                key={i.toString()}
              />
            );
          })}
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={skip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={scrollToNext}>
            <ChevronRight size={28} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default OnboardingScreen;
