// app/index.tsx
import { Redirect } from 'expo-router';

export default function IndexBridge() {
  return <Redirect href="/home" />;
}
