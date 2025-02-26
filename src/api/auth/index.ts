import axios from 'axios';
import { apiPostCall } from '..';
import { LoginType, RegisterType } from '@/schema/auth-schema';

export const refreshAccessToken = async () => {
  const response = await axios.get('/auth/refresh-token', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
    },
  });
  return response.data;
};

export const loginUser = async (data: LoginType) => {
  const response = await apiPostCall('/auth/login', {
    username: data.phoneNumber,
    password: data.password,
  });
  return response.data;
};

export const registerUser = async (data: RegisterType) => {
  const response = await apiPostCall('/auth/register', {
    mobile: data.mobile,  // Corrected from "mobie" to "mobile"
    password: data.password,
    confirmPassword: data.confirmPassword,
    username: data.mobile,  // Assuming username should be the same as the mobile
    email: data.email,      // Send the email as well
  });
  return response.data;
};

