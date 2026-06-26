import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleRegister = async (): Promise<void> => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const userCredential: FirebaseAuthTypes.UserCredential = 
        await auth().createUserWithEmailAndPassword(email, password);
      
      const userId: string | undefined = userCredential.user?.uid;
      
      if (!userId) {
        throw new Error('User identifier could not be generated.');
      }
      
      await firestore().collection('users').doc(userId).set({
        name: name,
        email: email,
        createdAt: firestore.FieldValue.serverTimestamp(),
        avatarUrl: null,
      });

      Alert.alert('Success', 'Account created successfully!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        Alert.alert('Registration Error', error.message);
      } else {
        Alert.alert('Registration Error', 'An unexpected system error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        placeholderTextColor="#888"
        value={name} 
        onChangeText={setName} 
      />
      
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
      
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 15 }
});
