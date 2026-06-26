import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Login Error', error.message);
      } else {
        Alert.alert('Login Error', 'An unexpected system error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email Address" 
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email} 
        onChangeText={setEmail} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#888"
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      
      <Button title="Login" onPress={handleLogin} />
      
      <Text 
        style={styles.link} 
        onPress={() => router.push('/(auth)/register')}
      >
        Don't have an account? Register here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15 },
  link: { color: '#007AFF', textAlign: 'center', marginTop: 15, fontSize: 16 }
});
