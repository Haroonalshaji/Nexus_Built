'use client';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import useQueryParams from '@/hooks/useQueryParams';
import axios from 'axios';
import { adminLogin } from '@/utils/apiCalls/auth';
import { setCookie, getCookie, listAllCookies } from '@/utils/cookies/cookies'


const SESSION_KEY = 'userSession';

// Store user info in sessionStorage
const storeUserSession = (user, password) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user, password));
  }
};

// Check if user exists in sessionStorage
const getUserSession = () => {
  if (typeof window !== 'undefined') {
    const user = sessionStorage.getItem(SESSION_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const { showNotification } = useNotificationContext();
  const queryParams = useQueryParams();

  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password')
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    // to show the default value on by default to the input
    // defaultValues: {
    //   email: 'user@demo.com',
    //   password: '123456'
    // }
  });

  // const login = handleSubmit(async values => {
  //   try {
  //     setLoading(true);
  //     // const response = await axios.post('/api/auth/login', {
  //     //   email: values.email,
  //     //   password: values.password
  //     // });

  //     // if (response.data.token) {
  //     //   // Store the JWT token
  //     //   localStorage.setItem('token', response.data.token);

  //     //   // Set authorization header for future requests
  //     //   axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

  //     //   push(queryParams['redirectTo'] ?? '/dashboards/analytics');
  //     //   showNotification({
  //     //     message: 'Successfully logged in. Redirecting....',
  //     //     variant: 'success'
  //     //   });
  //     // }

  //     if(values){
  //       // Store user info in sessionStorage
  //       storeUserSession({ email: values.email,password: values.password });
  //     }

  //     push('/dashboards/analytics');
  //   } catch (error) {
  //     showNotification({
  //       message: error.response?.data?.message || 'Login failed',
  //       variant: 'danger'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // });

  const login = handleSubmit(async values => {
    setLoading(true);

    // signIn('credentials', {
    //   redirect: false,
    //   email: values?.email,
    //   password: values?.password
    // }).then(res => {
    //   console.log(res)
    //   if (res?.ok) {
    //     if (values) {
    //       // Store user info in sessionStorage
    //       storeUserSession({ email: values.email, password: values.password });
    //     }
    //     push(queryParams['redirectTo'] ?? '/pendingapproval');
    //     showNotification({
    //       message: 'Successfully logged in. Redirecting....',
    //       variant: 'success'
    //     });
    //   } else {
    //     showNotification({
    //       message: res?.error ?? '',
    //       variant: 'danger'
    //     });
    //   }
    // });

    try {
      const response = await adminLogin({ "emailId": values?.email, "password": values?.password });
      const RetData = response.data;
      console.log(RetData)

      setLoading(false);

      const userRoles = {
        accessToken: RetData.result.accessToken,
        refreshToken: RetData.result.refreshToken,
        role: RetData.result.role,
        userName: RetData.result.userName,
        status: RetData.result.status
      }

      const cookiesSet = [
        setCookie('accessToken', userRoles.accessToken, 1),
        setCookie('refreshToken', userRoles.refreshToken, 7),
        setCookie('userName', userRoles.userName, 1),
        setCookie('userStatus', userRoles.userStatus, 1),
        setCookie('role', userRoles.role, 1)
      ];

      // Verify cookies were actually set by reading them back
      const accessTokenFromCookie = getCookie('accessToken');
      const refreshTokenFromCookie = getCookie('refreshToken');

      listAllCookies();
      const allCookiesSet = cookiesSet.every(result => result === true) &&
        accessTokenFromCookie === userRoles.accessToken &&
        refreshTokenFromCookie === userRoles.refreshToken;

      if (RetData.isSuccess === true) {
        if (allCookiesSet) {
          showNotification({
            message: `✅  ${RetData.message}`,
            variant: "success",
          })
          push(queryParams['redirectTo'] ?? '/pendingapproval');
          // Navigate after a short delay to ensure cookies are set
          // setTimeout(() => {
          //   router.push("/vendor/dashboard")
          // }, 100)
        } else {
          showNotification({
            message: "⚠️ Login successful but session not saved properly. Please try again.",
            variant: "danger",
          })
        }
      } else {
        showNotification({
          message: `${RetData.message}`,
          variant: "danger",
        })
      }

    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  });

  return {
    loading,
    login,
    control,
    getUserSession
  };
};

export default useSignIn;