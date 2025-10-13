// app/(landing)/index.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('screen');

export default function LandingPage() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.title}>Scoutr</Text>
        <Text style={styles.subtitle}>
          The smart, modern way to scout FTC matches — built for teams that want
          data-driven strategy and seamless collaboration.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/reports')}
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Scoutr?</Text>
        <Feature
          icon="⚡"
          title="Fast Match Input"
          description="Quickly record autonomous and teleop data with a clean, intuitive UI that works on phones and tablets."
        />
        <Feature
          icon="📊"
          title="Powerful Analytics"
          description="Visualize team performance and match trends with built-in charts and data summaries."
        />
        <Feature
          icon="🌐"
          title="Offline Sync"
          description="Scout anywhere — data automatically syncs when your device reconnects."
        />
      </View>

      {/* Showcase Section */}
      <View style={styles.showcaseSection}>
        <Text style={styles.sectionTitle}>See It In Action</Text>
        <Image
          source={{ uri: 'https://placehold.co/600x350?text=App+Screenshot' }}
          style={styles.screenshot}
          resizeMode="cover"
        />
      </View>

      {/* Team / Contact Section */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Built by FTC Teams, for FTC Teams</Text>
        <Text style={styles.contactSubtitle}>
          Have questions or want to collaborate? Reach out to the Scoutr development team!
        </Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.contactButtonText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureContainer}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  hero: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: width * 0.8,
  },
  ctaButton: {
    backgroundColor: '#0369A1',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#0F172A',
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0F172A',
  },
  featureDescription: {
    fontSize: 16,
    color: '#475569',
  },
  showcaseSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  screenshot: {
    width: width * 0.8,
    height: 200,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  contactSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#0369A1',
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 16,
    color: '#E0F2FE',
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: width * 0.8,
  },
  contactButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#0369A1',
    fontWeight: '600',
    fontSize: 16,
  },
});
