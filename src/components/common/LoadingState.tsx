import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Typography } from '@/constants/Typography';
import { Colors } from '@/constants/Colors';

export default function LoadingState({ name }: { name: string }) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color={Colors.primary[700]} />
      <Text style={styles.loadingText}>Loading {name}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginTop: 12,
  },
});
