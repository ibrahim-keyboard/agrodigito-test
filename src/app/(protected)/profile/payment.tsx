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
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/Card';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile' | 'bank';
  name: string;
  details: string;
  lastFour?: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa Card',
      details: 'John Doe',
      lastFour: '4532',
      isDefault: true,
    },
    {
      id: '2',
      type: 'mobile',
      name: 'M-Pesa',
      details: '+254 712 345 678',
      isDefault: false,
    },
    {
      id: '3',
      type: 'bank',
      name: 'KCB Bank',
      details: 'Account ending in 7890',
      isDefault: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<'card' | 'mobile' | 'bank'>(
    'card'
  );
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    accountNumber: '',
    bankName: '',
  });

  const paymentTypes = [
    {
      id: 'card',
      label: 'Credit/Debit Card',
      icon: FontAwesome5,
      iconName: 'credit-card',
    },
    {
      id: 'mobile',
      label: 'Mobile Money',
      icon: Feather,
      iconName: 'smartphone',
    },
    {
      id: 'bank',
      label: 'Bank Account',
      icon: MaterialCommunityIcons,
      iconName: 'bank',
    },
  ];

  const openAddModal = () => {
    setEditingMethod(null);
    setFormData({
      name: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      phoneNumber: '',
      accountNumber: '',
      bankName: '',
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    let newMethod: PaymentMethod;

    if (selectedType === 'card') {
      newMethod = {
        id: Date.now().toString(),
        type: 'card',
        name: 'Card',
        details: formData.name,
        lastFour: formData.cardNumber.slice(-4),
        isDefault: paymentMethods.length === 0,
      };
    } else if (selectedType === 'mobile') {
      newMethod = {
        id: Date.now().toString(),
        type: 'mobile',
        name: 'M-Pesa',
        details: formData.phoneNumber,
        isDefault: paymentMethods.length === 0,
      };
    } else {
      newMethod = {
        id: Date.now().toString(),
        type: 'bank',
        name: formData.bankName,
        details: `Account ending in ${formData.accountNumber.slice(-4)}`,
        isDefault: paymentMethods.length === 0,
      };
    }

    setPaymentMethods([...paymentMethods, newMethod]);
    setModalVisible(false);
  };

  const handleDelete = (methodId: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(
              paymentMethods.filter((method) => method.id !== methodId)
            );
          },
        },
      ]
    );
  };

  const setAsDefault = (methodId: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return (
          <FontAwesome5
            name='credit-card'
            size={24}
            color={Colors.primary[700]}
          />
        );
      case 'mobile':
        return (
          <Feather name='smartphone' size={24} color={Colors.accent[500]} />
        );
      case 'bank':
        return (
          <MaterialCommunityIcons
            name='bank'
            size={24}
            color={Colors.secondary[600]}
          />
        );
      default:
        return (
          <FontAwesome5
            name='credit-card'
            size={24}
            color={Colors.neutral[500]}
          />
        );
    }
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <Card style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          {getPaymentIcon(item.type)}
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentName}>{item.name}</Text>
            <Text style={styles.paymentSubtext}>{item.details}</Text>
            {item.lastFour && (
              <Text style={styles.paymentSubtext}>•••• {item.lastFour}</Text>
            )}
          </View>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.paymentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}>
            <Feather name='trash-2' size={16} color={Colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => setAsDefault(item.id)}>
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  const renderTypeSelector = () => (
    <View style={styles.typeSelector}>
      <Text style={styles.typeSelectorTitle}>Payment Method Type</Text>
      {paymentTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.typeOption,
            selectedType === type.id && styles.selectedTypeOption,
          ]}
          onPress={() => setSelectedType(type.id as any)}>
          <type.icon
            name={type.iconName}
            size={20}
            color={
              selectedType === type.id
                ? Colors.primary[700]
                : Colors.neutral[600]
            }
          />
          <Text
            style={[
              styles.typeOptionText,
              selectedType === type.id && styles.selectedTypeOptionText,
            ]}>
            {type.label}
          </Text>
          {selectedType === type.id && (
            <AntDesign name='check' size={20} color={Colors.primary[700]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderForm = () => {
    switch (selectedType) {
      case 'card':
        return (
          <>
            <Input
              label='Cardholder Name'
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder='John Doe'
            />
            <Input
              label='Card Number'
              value={formData.cardNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, cardNumber: text })
              }
              placeholder='1234 5678 9012 3456'
              keyboardType='numeric'
            />
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Input
                  label='Expiry Date'
                  value={formData.expiryDate}
                  onChangeText={(text) =>
                    setFormData({ ...formData, expiryDate: text })
                  }
                  placeholder='MM/YY'
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label='CVV'
                  value={formData.cvv}
                  onChangeText={(text) =>
                    setFormData({ ...formData, cvv: text })
                  }
                  placeholder='123'
                  keyboardType='numeric'
                  secureTextEntry
                />
              </View>
            </View>
          </>
        );
      case 'mobile':
        return (
          <Input
            label='Phone Number'
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, phoneNumber: text })
            }
            placeholder='+254 712 345 678'
            keyboardType='phone-pad'
          />
        );
      case 'bank':
        return (
          <>
            <Input
              label='Bank Name'
              value={formData.bankName}
              onChangeText={(text) =>
                setFormData({ ...formData, bankName: text })
              }
              placeholder='KCB Bank'
            />
            <Input
              label='Account Number'
              value={formData.accountNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, accountNumber: text })
              }
              placeholder='1234567890'
              keyboardType='numeric'
            />
          </>
        );
      default:
        return null;
    }
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
          <Text style={styles.title}>Payment Methods</Text>
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <AntDesign name='plus' size={24} color={Colors.primary[700]} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentMethod}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                Manage your payment methods for faster checkout
              </Text>
            </View>
          )}
        />

        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Payment Method</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <AntDesign
                    name='arrowleft'
                    size={24}
                    color={Colors.neutral[800]}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                {renderTypeSelector()}
                {renderForm()}

                <View style={styles.modalActions}>
                  <Button
                    title='Cancel'
                    onPress={() => setModalVisible(false)}
                    variant='outline'
                    style={styles.cancelButton}
                  />
                  <Button
                    title='Add Method'
                    onPress={handleSave}
                    leftIcon={
                      <AntDesign name='check' size={20} color={Colors.white} />
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
  listHeader: {
    marginBottom: 24,
  },
  listHeaderText: {
    ...Typography.body,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  paymentCard: {
    marginBottom: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentName: {
    ...Typography.h5,
    marginBottom: 2,
  },
  paymentSubtext: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginBottom: 1,
  },
  defaultBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    ...Typography.caption,
    color: Colors.primary[700],
    fontFamily: 'Inter-Medium',
  },
  paymentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
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
  typeSelector: {
    marginBottom: 24,
  },
  typeSelectorTitle: {
    ...Typography.h5,
    marginBottom: 12,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    marginBottom: 8,
  },
  selectedTypeOption: {
    borderColor: Colors.primary[700],
    backgroundColor: Colors.primary[50],
  },
  typeOptionText: {
    ...Typography.body,
    marginLeft: 12,
    flex: 1,
  },
  selectedTypeOptionText: {
    color: Colors.primary[700],
    fontFamily: 'Inter-Medium',
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
