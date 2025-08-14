import { Colors } from '@/constants/Colors';
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextStyle,
  ViewStyle,
} from 'react-native';

const { width } = Dimensions.get('window');
interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelButtonStyle?: ViewStyle;
  confirmButtonStyle?: ViewStyle;
  cancelTextStyle?: TextStyle;
  confirmTextStyle?: TextStyle;
  showCancel?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  cancelText = 'Cancel',
  confirmText = 'OK',
  onCancel,
  onConfirm,
  cancelButtonStyle = {},
  confirmButtonStyle = {},
  cancelTextStyle = {},
  confirmTextStyle = {},
  showCancel = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onCancel}>
      <View style={alertStyles.overlay}>
        <View style={alertStyles.alertContainer}>
          {title && <Text style={alertStyles.title}>{title}</Text>}

          {message && <Text style={alertStyles.message}>{message}</Text>}

          <View style={alertStyles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                style={[
                  alertStyles.button,
                  alertStyles.cancelButton,
                  cancelButtonStyle,
                ]}
                onPress={onCancel}
                activeOpacity={0.7}>
                <Text
                  style={[
                    alertStyles.buttonText,
                    alertStyles.cancelText,
                    cancelTextStyle,
                  ]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                alertStyles.button,
                alertStyles.confirmButton,
                confirmButtonStyle,
                !showCancel && { flex: 1 },
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}>
              <Text
                style={[
                  alertStyles.buttonText,
                  alertStyles.confirmText,
                  confirmTextStyle,
                ]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    maxWidth: 320,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral[900],
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    color: '#666',
  },
  confirmText: {
    color: 'white',
  },
});
