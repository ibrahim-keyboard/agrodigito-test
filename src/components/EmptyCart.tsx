import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SvgProps } from 'react-native-svg';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  Icon?: React.FC<SvgProps>;
  iconName?: keyof typeof Ionicons.glyphMap; // Optional custom icon
}

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  Icon,
  iconName = 'cube-outline', // Default icon
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {Icon ? (
          <Icon height={48} width={48} fill={Colors.neutral[500]} />
        ) : (
          <Ionicons name={iconName} size={48} color={Colors.neutral[400]} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
    backgroundColor: Colors.neutral[50],
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.neutral[100],
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary[800],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default EmptyState;
