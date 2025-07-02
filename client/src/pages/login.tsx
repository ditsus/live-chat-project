import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      setError('');
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
          values
        );
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        router.push('/chat');
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            setError(err.response.data.error || 'Invalid credentials. Please try again.');
          } else if (err.request) {
            // The request was made but no response was received
            setError('Cannot connect to the server. Please check your network connection.');
          } else {
            // Something happened in setting up the request that triggered an Error
            setError('An error occurred while sending the request.');
          }
        } else {
          setError('An unexpected error occurred.');
        }
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={formik.handleSubmit}
        className="p-8 bg-gray-800 rounded-lg shadow-lg w-96"
      >
        <h2 className="mb-4 text-2xl font-bold text-white">Welcome back!</h2>
        <p className="mb-8 text-gray-400">We're so excited to see you again!</p>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-bold text-gray-400"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className="w-full px-3 py-2 leading-tight text-gray-300 bg-gray-700 border border-gray-600 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-red-500 text-xs italic">
              {formik.errors.username}
            </div>
          ) : null}
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-bold text-gray-400"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full px-3 py-2 mb-3 leading-tight text-gray-300 bg-gray-700 border border-gray-600 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-xs italic">
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          Need an account?{' '}
          <Link href="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;