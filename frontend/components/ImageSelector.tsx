// components/ImageSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImageSelectorProps {
  onImageSelected: (uri: string) => Promise<void> | void;
  buttonColor: string;
}

export default function ImageSelector({ onImageSelected, buttonColor  }: ImageSelectorProps) {
  
  const pickImage = async (): Promise<void> => {
    const permissionResult: ImagePicker.PermissionResponse = 
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.status !== 'granted') {
      Alert.alert(
        'Permission Required', 
        'We need access to your gallery to attach images to your notes.'
      );
      return;
    }

    const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[1, 1], 
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri: string = result.assets[0].uri;
      
      await onImageSelected(selectedUri);
    }
  };

    return (
    <View style={styles.container}>
      <TouchableOpacity 
        activeOpacity={0.85}
        onPress={pickImage}
        style={[styles.baseButton, { backgroundColor: buttonColor }]}
      >
        <Text style={styles.buttonText}>
          ATTACH IMAGE
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignSelf: 'flex-end',
  },
  baseButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    color: '#000000', 
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

