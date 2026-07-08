import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Scan, Sun, History, ShieldAlert } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';

const InvalidQrScreen = () => {
  const router = useRouter();

  const header = (
    <View style={s.header}>
       <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
       </TouchableOpacity>
       <Text style={s.headerTitle}>EcoShine</Text>
       <View style={{ width: 44 }} />
    </View>
  );

  return (
    <ScreenWrapper header={header} style={{ backgroundColor: '#F8FAFC' }}>
      <View style={s.content}>
        
        {/* Error Icon */}
        <View style={s.iconContainer}>
           <View style={s.iconBg}>
              <Scan size={60} color="#EF4444" strokeWidth={1.5} />
              <View style={s.alertBadge}>
                 <ShieldAlert size={16} color={COLORS.WHITE} />
              </View>
           </View>
        </View>

        {/* Text Area */}
        <Text style={s.title}>Invalid or Expired QR Code</Text>
        <Text style={s.subtitle}>
           Please verify the customer QR or contact support if the problem persists.
        </Text>

        <TouchableOpacity 
          style={s.scanBtn}
          onPress={() => router.back()}
        >
           <Scan size={20} color={COLORS.WHITE} style={{ marginRight: 10 }} />
           <Text style={s.scanBtnText}>Scan Again</Text>
        </TouchableOpacity>

        {/* Common Issues Section */}
        <View style={s.issuesSection}>
           <Text style={s.issuesTitle}>COMMON ISSUES</Text>
           
           <View style={s.issueItem}>
              <View style={s.issueIconBox}>
                 <Sun size={20} color="#0D47A1" />
              </View>
              <Text style={s.issueText}>Ensure the screen brightness is high on the customer's device.</Text>
           </View>

           <View style={s.issueItem}>
              <View style={s.issueIconBox}>
                 <History size={20} color="#0D47A1" />
              </View>
              <Text style={s.issueText}>Check if the QR code has already been used for this session.</Text>
           </View>
        </View>

      </View>
    </ScreenWrapper>
  );
};

const s = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  backBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  iconBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FEF2F2',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  scanBtn: {
    marginTop: 40,
    backgroundColor: '#0D47A1',
    width: '100%',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D47A1',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  scanBtnText: {
    color: COLORS.WHITE,
    fontSize: 17,
    fontWeight: '800',
  },
  issuesSection: {
    width: '100%',
    marginTop: 60,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  issuesTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 1,
    marginBottom: 20,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  issueIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
  }
});

export default InvalidQrScreen;
