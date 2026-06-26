//components/RemoteImage.tsx
import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

interface RemoteImageProps {
  uri: string | null | undefined;
  style: object | object[]; 
}

export default function RemoteImage({ uri, style }: RemoteImageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  
  const [error, setError] = useState<boolean>(false);

  if (!uri || error) {
    return (
      <View style={[styles.placeholderContainer, style]}>
        <View style={styles.fallbackVisual} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ 
          uri: uri,
          cache: 'disk' 
        }}
        style={style}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      
      {loading && (
        <View style={[StyleSheet.absoluteFillObject, styles.loadingOverlay]}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderContainer: {
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackVisual: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3A3A3C',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(28, 28, 30, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
