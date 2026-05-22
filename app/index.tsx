// app/index.tsx
import { Redirect } from 'expo-router';

export default function IndexBridge() {
  // Directly point the initial launch path to the home tab route
  return <Redirect href={{ pathname: '/home' }} />;
}
