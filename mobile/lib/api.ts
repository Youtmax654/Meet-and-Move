import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure l'intercepteur pour injecter l'ID de debug
api.interceptors.request.use(async (config) => {
  try {
    let debugUserId = null;
    
    // expo-secure-store ne fonctionne pas sur le web
    if (Platform.OS === 'web') {
      debugUserId = localStorage.getItem('debugUserId');
    } else {
      debugUserId = await SecureStore.getItemAsync('debugUserId');
    }

    if (debugUserId) {
      config.headers['X-Debug-User-Id'] = debugUserId;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du debugUserId', error);
  }
  return config;
});
