import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Briefcase, Camera } from 'lucide-react-native';
import ScreenWrapper from '../../../components/common/ScreenWrapper';
import { COLORS } from '../../../theme/colors';
import styles from '../styles/Staff.styles';

/**
 * Screen for Staff to edit their profile information.
 * Includes work-related details like Employee ID and Role.
 */
const StaffEditProfileScreen = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: 'Vinod Madhuranga',
    email: 'vinod@bwlaundry.lk',
    phone: '+94 77 123 4567',
    employeeId: 'EMP-BW-102',
    role: 'Senior Delivery Partner'
  });

  const header = (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Edit Profile</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: COLORS.PRIMARY, fontWeight: '700' }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      header={header}
      scroll
      withKeyboardAvoidingView
    >
      <View style={{ padding: 20 }}>
        {/* Avatar Section */}
        <View style={editStyles.avatarSection}>
          <View style={editStyles.avatarBorder}>
            <View style={editStyles.avatar}>
              <Text style={editStyles.avatarText}>{formData.name[0]}</Text>
            </View>
            <TouchableOpacity style={editStyles.cameraBtn}>
              <Camera size={16} color={COLORS.WHITE} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Section */}
        <View style={editStyles.form}>
          <View style={editStyles.inputGroup}>
            <Text style={editStyles.label}>Full Name</Text>
            <View style={editStyles.inputWrapper}>
              <User size={20} color={COLORS.TEXT_MUTED} />
              <TextInput 
                style={editStyles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
            </View>
          </View>

          <View style={editStyles.inputGroup}>
            <Text style={editStyles.label}>Work Email</Text>
            <View style={editStyles.inputWrapper}>
              <Mail size={20} color={COLORS.TEXT_MUTED} />
              <TextInput 
                style={editStyles.input}
                value={formData.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={editStyles.inputGroup}>
            <Text style={editStyles.label}>Phone Number</Text>
            <View style={editStyles.inputWrapper}>
              <Phone size={20} color={COLORS.TEXT_MUTED} />
              <TextInput 
                style={editStyles.input}
                value={formData.phone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={[editStyles.inputGroup, { opacity: 0.6 }]}>
            <Text style={editStyles.label}>Employee ID (Read-only)</Text>
            <View style={editStyles.inputWrapper}>
              <Briefcase size={20} color={COLORS.TEXT_MUTED} />
              <TextInput 
                style={editStyles.input}
                value={formData.employeeId}
                editable={false}
              />
            </View>
          </View>

          <View style={[editStyles.inputGroup, { opacity: 0.6 }]}>
            <Text style={editStyles.label}>Designation</Text>
            <View style={editStyles.inputWrapper}>
              <User size={20} color={COLORS.TEXT_MUTED} />
              <TextInput 
                style={editStyles.input}
                value={formData.role}
                editable={false}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={editStyles.updateBtn}
          onPress={() => router.back()}
        >
          <Text style={editStyles.updateBtnText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const editStyles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.PRIMARY,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.WHITE,
  },
  form: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  updateBtn: {
    backgroundColor: COLORS.PRIMARY,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  updateBtnText: {
    color: COLORS.WHITE,
    fontWeight: '800',
    fontSize: 16,
  }
});

export default StaffEditProfileScreen;
