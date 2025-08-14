import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/Card';

export default function PersonalInformationScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+254 712 345 678',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    occupation: 'Farmer',
    farmSize: '50 acres',
    location: 'Nairobi, Kenya',
  });

  const handleSave = () => {
    // In a real app, this would save to an API
    setIsEditing(false);
    Alert.alert('Success', 'Your information has been updated successfully.');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

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
          <Text style={styles.title}>Personal Information</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <AntDesign name='close' size={24} color={Colors.neutral[800]} />
            ) : (
              <Feather name='edit-3' size={24} color={Colors.primary[700]} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <Card style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                  }}
                  style={styles.avatar}
                />
                {isEditing && (
                  <TouchableOpacity style={styles.cameraButton}>
                    <Feather name='camera' size={16} color={Colors.white} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.avatarLabel}>Profile Photo</Text>
            </View>
          </Card>

          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label='First Name'
                  value={formData.firstName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, firstName: text })
                  }
                  editable={isEditing}
                  style={!isEditing && styles.disabledInput}
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label='Last Name'
                  value={formData.lastName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, lastName: text })
                  }
                  editable={isEditing}
                  style={!isEditing && styles.disabledInput}
                />
              </View>
            </View>

            <Input
              label='Email Address'
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType='email-address'
              editable={isEditing}
              style={!isEditing && styles.disabledInput}
            />

            <Input
              label='Phone Number'
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType='phone-pad'
              editable={isEditing}
              style={!isEditing && styles.disabledInput}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label='Date of Birth'
                  value={formData.dateOfBirth}
                  onChangeText={(text) =>
                    setFormData({ ...formData, dateOfBirth: text })
                  }
                  editable={isEditing}
                  style={!isEditing && styles.disabledInput}
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label='Gender'
                  value={formData.gender}
                  onChangeText={(text) =>
                    setFormData({ ...formData, gender: text })
                  }
                  editable={isEditing}
                  style={!isEditing && styles.disabledInput}
                />
              </View>
            </View>
          </Card>

          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Professional Information</Text>

            <Input
              label='Occupation'
              value={formData.occupation}
              onChangeText={(text) =>
                setFormData({ ...formData, occupation: text })
              }
              editable={isEditing}
              style={!isEditing && styles.disabledInput}
            />

            <Input
              label='Farm Size'
              value={formData.farmSize}
              onChangeText={(text) =>
                setFormData({ ...formData, farmSize: text })
              }
              editable={isEditing}
              style={!isEditing && styles.disabledInput}
            />

            <Input
              label='Location'
              value={formData.location}
              onChangeText={(text) =>
                setFormData({ ...formData, location: text })
              }
              editable={isEditing}
              style={!isEditing && styles.disabledInput}
            />
          </Card>

          {isEditing && (
            <View style={styles.actionButtons}>
              <Button
                title='Cancel'
                onPress={handleCancel}
                variant='outline'
                style={styles.cancelButton}
              />
              <Button
                title='Save Changes'
                onPress={handleSave}
                leftIcon={
                  <Feather name='save' size={20} color={Colors.white} />
                }
                style={styles.saveButton}
              />
            </View>
          )}
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
  editButton: {
    padding: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarLabel: {
    ...Typography.body,
    color: Colors.neutral[600],
  },
  formCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typography.h5,
    marginBottom: 16,
    color: Colors.neutral[900],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  disabledInput: {
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});
