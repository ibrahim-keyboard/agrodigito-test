import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

type RenderErrorProps = {
  onRefresh: () => void;
  error: Error;
};

export default function RenderErrorState({
  onRefresh,
  error,
}: RenderErrorProps) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error.message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error[700],
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary[700],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    ...Typography.button,
    fontSize: 14,
  },
});
