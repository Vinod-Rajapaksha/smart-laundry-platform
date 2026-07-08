import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageSquare, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from './styles/Profile.styles';

/**
 * Screen providing Help & Support resources to the customer.
 * Includes FAQ section and quick contact options.
 */
const HelpSupportScreen = () => {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time by visiting the "Orders" tab and clicking the "Track" button on any active order card.'
    },
    {
      question: 'What is the turnaround time?',
      answer: 'Our standard turnaround time is 24-48 hours. Express services are available for 12-hour delivery at an additional cost.'
    },
    {
      question: 'How do I apply a voucher?',
      answer: 'Apply your voucher code during the checkout process in the "Payment Method" screen or select from your "Available Vouchers".'
    },
    {
      question: 'Can I change my pickup time?',
      answer: 'Yes, you can reschedule your pickup time up to 2 hours before the scheduled slot via the Order Details screen.'
    }
  ];

  const contactOptions = [
    { icon: <MessageSquare size={20} color={COLORS.PRIMARY} />, label: 'Live Chat', value: 'Start conversation' },
    { icon: <Phone size={20} color={COLORS.SUCCESS} />, label: 'Phone Support', value: '+94 11 234 5678' },
    { icon: <Mail size={20} color="#EF4444" />, label: 'Email Us', value: 'support@ecoshine.lk' }
  ];

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
    >
      <View style={styles.scrollContent}>
        {/* Contact Options */}
        <View style={helpStyles.contactGrid}>
          {contactOptions.map((option, index) => (
            <TouchableOpacity key={index} style={helpStyles.contactCard}>
              <View style={helpStyles.iconCircle}>{option.icon}</View>
              <Text style={helpStyles.contactLabel}>{option.label}</Text>
              <Text style={helpStyles.contactValue}>{option.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.menuCard}>
            {faqs.map((faq, index) => (
              <View key={index} style={[styles.menuItem, index === faqs.length - 1 && styles.menuItemLast, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}
                  onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <Text style={[styles.menuTitle, { flex: 1 }]}>{faq.question}</Text>
                  {expandedFaq === index ? <ChevronUp size={20} color={COLORS.TEXT_SECONDARY} /> : <ChevronDown size={20} color={COLORS.TEXT_SECONDARY} />}
                </TouchableOpacity>
                
                {expandedFaq === index && (
                  <View style={helpStyles.answerContainer}>
                    <Text style={helpStyles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Still Need Help */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }]}>
            <Text style={[styles.submitButtonText, { color: COLORS.PRIMARY }]}>Browse Documentation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const helpStyles = StyleSheet.create({
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
  },
  contactCard: {
    width: '44%',
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    margin: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  contactValue: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    textAlign: 'center',
  },
  answerContainer: {
    marginTop: 12,
    paddingBottom: 4,
    width: '100%',
  },
  answerText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  }
});

export default HelpSupportScreen;
