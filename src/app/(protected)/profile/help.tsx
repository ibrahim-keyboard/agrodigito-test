import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  AntDesign,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  Feather,
} from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Card from '@/components/Card';
import Button from '@/components/common/Button';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I place an order?',
      answer:
        'To place an order, browse our products, add items to your cart, and proceed to checkout. You can pay using various methods including mobile money, credit cards, or cash on delivery.',
      expanded: false,
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer:
        'We accept M-Pesa, Airtel Money, credit/debit cards, bank transfers, and cash on delivery for your convenience.',
      expanded: false,
    },
    {
      id: '3',
      question: 'How long does delivery take?',
      answer:
        'Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days. Delivery times may vary based on your location.',
      expanded: false,
    },
    {
      id: '4',
      question: 'Can I return or exchange products?',
      answer:
        'Yes, we offer a 7-day return policy for unused products in their original packaging. Seeds and perishable items may have different return policies.',
      expanded: false,
    },
    {
      id: '5',
      question: 'How do I track my order?',
      answer:
        'You can track your order in the Orders section of the app or by clicking the tracking link sent to your email/SMS.',
      expanded: false,
    },
    {
      id: '6',
      question: 'Do you offer bulk discounts?',
      answer:
        'Yes, we offer competitive bulk pricing for large orders. Contact our sales team for custom quotes on bulk purchases.',
      expanded: false,
    },
  ]);

  const toggleFAQ = (id: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id
          ? { ...faq, expanded: !faq.expanded }
          : { ...faq, expanded: false }
      )
    );
  };

  const handleContactMethod = (method: string) => {
    switch (method) {
      case 'phone':
        Linking.openURL('tel:+254712345678');
        break;
      case 'email':
        Linking.openURL('mailto:support@agrodigito.com');
        break;
      case 'whatsapp':
        Linking.openURL('https://wa.me/254712345678');
        break;
      case 'chat':
        Alert.alert('Live Chat', 'Live chat feature will be available soon!');
        break;
    }
  };

  const renderContactOption = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    method: string,
    available: boolean = true
  ) => (
    <TouchableOpacity
      style={[styles.contactOption, !available && styles.disabledOption]}
      onPress={() => available && handleContactMethod(method)}
      disabled={!available}>
      <View style={styles.contactIcon}>{icon}</View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <AntDesign name='right' size={20} color={Colors.neutral[400]} />
    </TouchableOpacity>
  );

  const renderFAQ = (faq: FAQ) => (
    <TouchableOpacity
      key={faq.id}
      style={styles.faqItem}
      onPress={() => toggleFAQ(faq.id)}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        {faq.expanded ? (
          <AntDesign name='up' size={20} color={Colors.neutral[600]} />
        ) : (
          <AntDesign name='down' size={20} color={Colors.neutral[600]} />
        )}
      </View>
      {faq.expanded && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <AntDesign name='arrowleft' size={24} color={Colors.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.title}>Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>How can we help you?</Text>
            <Text style={styles.welcomeText}>
              Find answers to common questions or get in touch with our support
              team.
            </Text>
          </View>

          <Card style={styles.contactCard}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <View style={styles.contactOptions}>
              {renderContactOption(
                'Phone Support',
                '+254 712 345 678 • Available 24/7',
                <Feather name='phone' size={20} color={Colors.primary[700]} />,
                'phone'
              )}
              {renderContactOption(
                'Email Support',
                'support@agrodigito.com • Response within 24hrs',
                <Feather name='mail' size={20} color={Colors.accent[500]} />,
                'email'
              )}
              {renderContactOption(
                'WhatsApp',
                'Quick support via WhatsApp',
                <FontAwesome5
                  name='whatsapp'
                  size={20}
                  color={Colors.success[500]}
                />,
                'whatsapp'
              )}
              {renderContactOption(
                'Live Chat',
                'Chat with our support team',
                <Ionicons
                  name='chatbubble-outline'
                  size={20}
                  color={Colors.secondary[600]}
                />,
                'chat',
                false
              )}
            </View>
          </Card>

          <Card style={styles.resourcesCard}>
            <Text style={styles.sectionTitle}>Resources</Text>
            <View style={styles.resourcesList}>
              <TouchableOpacity style={styles.resourceItem}>
                <View style={styles.resourceIcon}>
                  <Feather name='book' size={20} color={Colors.primary[700]} />
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>User Guide</Text>
                  <Text style={styles.resourceSubtitle}>
                    Complete guide to using agrodigito
                  </Text>
                </View>
                <Feather
                  name='external-link'
                  size={16}
                  color={Colors.neutral[400]}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.resourceItem}>
                <View style={styles.resourceIcon}>
                  <Feather name='video' size={20} color={Colors.accent[500]} />
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>Video Tutorials</Text>
                  <Text style={styles.resourceSubtitle}>
                    Step-by-step video guides
                  </Text>
                </View>
                <Feather
                  name='external-link'
                  size={16}
                  color={Colors.neutral[400]}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.resourceItem}>
                <View style={styles.resourceIcon}>
                  <Ionicons
                    name='people-outline'
                    size={20}
                    color={Colors.secondary[600]}
                  />
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>Community Forum</Text>
                  <Text style={styles.resourceSubtitle}>
                    Connect with other farmers
                  </Text>
                </View>
                <Feather
                  name='external-link'
                  size={16}
                  color={Colors.neutral[400]}
                />
              </TouchableOpacity>
            </View>
          </Card>

          <Card style={styles.faqCard}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>{faqs.map(renderFAQ)}</View>
          </Card>

          <Card style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <MaterialIcons
                name='help-outline'
                size={24}
                color={Colors.primary[700]}
              />
              <Text style={styles.feedbackTitle}>Still need help?</Text>
            </View>
            <Text style={styles.feedbackText}>
              Can`&apos;t find what you`&apos;re looking for? Our support team
              is here to help you with any questions or issues.
            </Text>
            <Button
              title='Contact Support'
              onPress={() => handleContactMethod('email')}
              leftIcon={<Feather name='mail' size={20} color={Colors.white} />}
              style={styles.feedbackButton}
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Our support team is available 24/7 to assist you with any
              questions or concerns.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: {
    padding: 4,
  },
  title: {
    ...Typography.h4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    ...Typography.h3,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    ...Typography.body,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  contactCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.h5,
    marginBottom: 16,
    color: Colors.neutral[900],
  },
  contactOptions: {
    gap: 12,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  disabledOption: {
    opacity: 0.5,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  contactSubtitle: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  resourcesCard: {
    marginBottom: 24,
  },
  resourcesList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  resourceSubtitle: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
  faqCard: {
    marginBottom: 24,
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    ...Typography.body,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    ...Typography.body,
    color: Colors.neutral[700],
    marginTop: 12,
    lineHeight: 22,
  },
  feedbackCard: {
    marginBottom: 24,
    backgroundColor: Colors.primary[50],
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackTitle: {
    ...Typography.h5,
    marginLeft: 12,
    color: Colors.primary[900],
  },
  feedbackText: {
    ...Typography.body,
    color: Colors.primary[800],
    lineHeight: 22,
    marginBottom: 16,
  },
  feedbackButton: {
    alignSelf: 'flex-start',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
