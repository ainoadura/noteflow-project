// components/ImageSelector.tsx
import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImageSelectorProps {
  onImageSelected: (uri: string) => Promise<void> | void;
}

export default function ImageSelector({ onImageSelected }: ImageSelectorProps) {
  
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
      <Button 
        title="Attach Image to Note" 
        onPress={pickImage} 
        color="#007AFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
});
