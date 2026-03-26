import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';

export const useAuth = () => {
  const { user, loadUser } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user]);

  return { user };
};
