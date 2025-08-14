import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FileDocIcon, ShieldIconTick } from '@/constants/icons';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const TermsAndConditionsScreen = () => {
  const [activeTab, setActiveTab] = useState('terms');

  const renderTermsContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.contentText}>
        By using Agrodigito (the "Platform"), you agree to these Terms of
        Service. The Platform is operated by [Your Company Name], a company
        registered in Tanzania. If you do not agree, please do not use the
        Platform.
      </Text>

      <Text style={styles.sectionTitle}>2. Services</Text>
      <Text style={styles.contentText}>
        Agrodigito provides a digital platform for agrovet shop owners to
        browse, order, and receive delivery of agricultural products (e.g.,
        seeds, fertilizers, veterinary drugs). We reserve the right to modify or
        discontinue services at any time.
      </Text>

      <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
      <Text style={styles.contentText}>
        • You must be a registered agrovet shop owner or authorized
        representative to use the Platform.{'\n'}• Provide accurate information
        for account creation, orders, and delivery.{'\n'}• Pay for orders via
        approved methods (e.g., M-Pesa, Tigo Pesa, bank transfer).{'\n'}• Do not
        misuse the Platform (e.g., fraudulent orders, unauthorized access).
      </Text>

      <Text style={styles.sectionTitle}>4. Orders and Delivery</Text>
      <Text style={styles.contentText}>
        • Orders are subject to product availability and supplier confirmation.
        {'\n'}• Delivery times are estimates; delays may occur due to logistics
        or unforeseen circumstances.{'\n'}• You are responsible for inspecting
        delivered goods and reporting issues within 24 hours.
      </Text>

      <Text style={styles.sectionTitle}>5. Payments</Text>
      <Text style={styles.contentText}>
        • Prices are listed in Tanzanian Shillings (TZS) and include applicable
        taxes unless stated otherwise.{'\n'}• Payments are processed securely
        via integrated mobile money or bank systems.{'\n'}• Refunds or
        cancellations follow our refund policy, available on the Platform.
      </Text>

      <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
      <Text style={styles.contentText}>
        All content on the Platform (e.g., logos, text, images) is owned by
        [Your Company Name] or its licensors. You may not reproduce or
        distribute without permission.
      </Text>

      <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
      <Text style={styles.contentText}>
        [Your Company Name] is not liable for indirect damages, including lost
        profits or data, arising from Platform use. We strive to ensure accuracy
        but do not guarantee uninterrupted service or error-free content.
      </Text>

      <Text style={styles.sectionTitle}>8. Governing Law</Text>
      <Text style={styles.contentText}>
        These Terms are governed by the laws of Tanzania. Disputes will be
        resolved in courts located in [Your City, e.g., Dar es Salaam].
      </Text>

      <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
      <Text style={styles.contentText}>
        We may update these Terms at any time. Continued use of the Platform
        constitutes acceptance of the updated Terms.
      </Text>

      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.contentText}>
        For questions, contact us at [Your Email] or [Your Phone Number].
      </Text>
    </View>
  );

  const renderPrivacyContent = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.contentText}>
        Agrodigito, operated by [Your Company Name], respects your privacy. This
        Privacy Policy explains how we collect, use, and protect your data in
        compliance with Tanzania's Data Protection Act, 2022.
      </Text>

      <Text style={styles.sectionTitle}>2. Data We Collect</Text>
      <Text style={styles.contentText}>
        • Personal Information: Name, phone number, email, agrovet shop name,
        and delivery address when you register or place orders.{'\n'}•
        Transaction Data: Order history, payment details (e.g., M-Pesa
        transaction IDs), and delivery status.{'\n'}• Technical Data: Device
        type, IP address, browser, and app usage data for analytics.{'\n'}•
        Optional Data: Feedback or survey responses you provide.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
      <Text style={styles.contentText}>
        • To process orders, manage deliveries, and provide customer support.
        {'\n'}• To improve the Platform's functionality and user experience.
        {'\n'}• To send order updates or promotional offers (with your consent).
        {'\n'}• To comply with legal obligations in Tanzania.
      </Text>

      <Text style={styles.sectionTitle}>4. Data Sharing</Text>
      <Text style={styles.contentText}>
        • Suppliers and Delivery Partners: We share necessary data (e.g., shop
        address) with suppliers and logistics providers to fulfill orders.{'\n'}
        • Legal Compliance: We may share data if required by Tanzanian law or to
        protect our rights.{'\n'}• We do not sell your data to third parties.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Security</Text>
      <Text style={styles.contentText}>
        We use encryption and secure servers to protect your data. However, no
        system is 100% secure, and you use the Platform at your own risk.
      </Text>

      <Text style={styles.sectionTitle}>6. Data Retention</Text>
      <Text style={styles.contentText}>
        We retain personal data only as long as necessary for business purposes
        or legal requirements (e.g., tax records). Inactive accounts may be
        deleted after 2 years.
      </Text>

      <Text style={styles.sectionTitle}>7. Your Rights</Text>
      <Text style={styles.contentText}>
        Under Tanzania's Data Protection Act, you can:{'\n'}• Access or correct
        your personal data.{'\n'}• Request data deletion (subject to legal
        obligations).{'\n'}• Opt out of marketing communications.{'\n'}
        Contact us at [Your Email] to exercise these rights.
      </Text>

      <Text style={styles.sectionTitle}>8. Cookies</Text>
      <Text style={styles.contentText}>
        We use cookies to improve your experience (e.g., remembering login
        details). You can disable cookies in your browser, but this may limit
        Platform functionality.
      </Text>

      <Text style={styles.sectionTitle}>9. Third-Party Links</Text>
      <Text style={styles.contentText}>
        The Platform may link to external sites (e.g., payment providers). We
        are not responsible for their privacy practices.
      </Text>

      <Text style={styles.sectionTitle}>10. Changes to Policy</Text>
      <Text style={styles.contentText}>
        We may update this Privacy Policy. Check the Platform for the latest
        version.
      </Text>

      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.contentText}>
        For privacy concerns, reach us at [Your Email] or [Your Phone Number].
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle='light-content'
        backgroundColor={Colors.primary[900]}
      />

      {/* Header */}
      <LinearGradient
        colors={[Colors.primary[700], Colors.primary[800]]}
        style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'terms' && styles.activeTab]}
          onPress={() => setActiveTab('terms')}>
          <FileDocIcon
            height={20}
            fill={
              activeTab === 'terms' ? Colors.primary[700] : Colors.neutral[500]
            }
          />
          {/* <Ionicons
            name='document-text'
            size={20}
            color={activeTab === 'terms' ? '#4CAF50' : '#666'}
          /> */}
          <Text
            style={[
              styles.tabText,
              activeTab === 'terms' && styles.activeTabText,
            ]}>
            Terms of Service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
          onPress={() => setActiveTab('privacy')}>
          <ShieldIconTick
            height={20}
            fill={
              activeTab === 'privacy'
                ? Colors.primary[700]
                : Colors.neutral[500]
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'privacy' && styles.activeTabText,
            ]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {activeTab === 'terms' ? renderTermsContent() : renderPrivacyContent()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Last updated: July 2025</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    width: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E8F5E8',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: Colors.primary[700],
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary[700],
    marginTop: 20,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
  },
  footer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default TermsAndConditionsScreen;
