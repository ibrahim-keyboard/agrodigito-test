import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/Card';
import { LocationIcon } from '@/constants/icons';
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      address: '123 Main Street, Apartment 4B',
      city: 'Nairobi',
      state: 'Nairobi County',
      zipCode: '00100',
      phone: '+254 712 345 678',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Farm',
      address: '456 Rural Road, Plot 789',
      city: 'Nakuru',
      state: 'Nakuru County',
      zipCode: '20100',
      phone: '+254 723 456 789',
      isDefault: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (editingAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...addr, ...formData } : addr
        )
      );
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
    }
    setModalVisible(false);
  };

  const handleDelete = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter((addr) => addr.id !== addressId));
          },
        },
      ]
    );
  };

  const setAsDefault = (addressId: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <Card style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressNameRow}>
          <LocationIcon height={20} fill={Colors.primary[700]} />
          <Text style={styles.addressName}>{item.name}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.addressActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(item)}>
            <MaterialIcons name='edit' size={16} color={Colors.neutral[600]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}>
            <Feather name='trash-2' size={16} color={Colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.addressText}>{item.address}</Text>
      <Text style={styles.addressText}>
        {item.city}, {item.state} {item.zipCode}
      </Text>
      <Text style={styles.addressText}>{item.phone}</Text>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => setAsDefault(item.id)}>
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </Card>
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
            <Feather name='arrow-left' size={24} color={Colors.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.title}>My Addresses</Text>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <MaterialCommunityIcons
              name='plus'
              size={24}
              color={Colors.primary[700]}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddress}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Feather
                    name='arrow-left'
                    size={24}
                    color={Colors.neutral[800]}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Input
                  label='Address Name'
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder='e.g., Home, Office, Farm'
                />

                <Input
                  label='Street Address'
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                  placeholder='Enter your street address'
                />

                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Input
                      label='City'
                      value={formData.city}
                      onChangeText={(text) =>
                        setFormData({ ...formData, city: text })
                      }
                      placeholder='City'
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Input
                      label='State/County'
                      value={formData.state}
                      onChangeText={(text) =>
                        setFormData({ ...formData, state: text })
                      }
                      placeholder='State/County'
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Input
                      label='ZIP Code'
                      value={formData.zipCode}
                      onChangeText={(text) =>
                        setFormData({ ...formData, zipCode: text })
                      }
                      placeholder='ZIP Code'
                      keyboardType='numeric'
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <Input
                      label='Phone Number'
                      value={formData.phone}
                      onChangeText={(text) =>
                        setFormData({ ...formData, phone: text })
                      }
                      placeholder='Phone Number'
                      keyboardType='phone-pad'
                    />
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title='Cancel'
                    onPress={() => setModalVisible(false)}
                    variant='outline'
                    style={styles.cancelButton}
                  />
                  <Button
                    title={editingAddress ? 'Update' : 'Add Address'}
                    onPress={handleSave}
                    leftIcon={
                      <Feather name='check' size={20} color={Colors.white} />
                    }
                    style={styles.saveButton}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
  addButton: {
    padding: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  addressCard: {
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressName: {
    ...Typography.h5,
    marginLeft: 8,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    ...Typography.caption,
    color: Colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  addressText: {
    ...Typography.body,
    color: Colors.neutral[700],
    marginBottom: 2,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary[50],
    borderRadius: 6,
  },
  setDefaultText: {
    ...Typography.bodySmall,
    color: Colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  modalTitle: {
    ...Typography.h4,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  modalBody: {
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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
