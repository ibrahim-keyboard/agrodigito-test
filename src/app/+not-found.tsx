import { Link, usePathname } from 'expo-router';

import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  const pathname = usePathname();
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Oops! This screen doesn&rsquo;t exist.
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        You tried to access: {pathname}
      </Text>
      <Link href='/' style={{ color: 'blue', fontSize: 16 }}>
        Go to Home
      </Link>
    </SafeAreaView>
  );
}
