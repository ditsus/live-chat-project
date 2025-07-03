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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#23272a] via-[#36393f] to-[#2f3136]">
      <form
        onSubmit={formik.handleSubmit}
        className="p-10 bg-[#2f3136] rounded-2xl shadow-2xl w-full max-w-md border border-[#23272a]"
      >
        <div className="flex flex-col items-center mb-8">
          <svg className="w-10 h-10 text-indigo-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 3h-6a2 2 0 00-2 2v3a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z"></path></svg>
          <h2 className="text-3xl font-extrabold text-white mb-1">Welcome back!</h2>
          <p className="text-[#b9bbbe]">We're so excited to see you again!</p>
        </div>
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block mb-2 text-base font-semibold text-[#b9bbbe]"
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
            className="w-full px-4 py-3 leading-tight text-white bg-[#36393f] border border-[#23272a] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-[#b9bbbe] text-base"
            placeholder="Enter your username"
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="text-red-500 text-xs italic mt-1">
              {formik.errors.username}
            </div>
          ) : null}
        </div>
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block mb-2 text-base font-semibold text-[#b9bbbe]"
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
            className="w-full px-4 py-3 leading-tight text-white bg-[#36393f] border border-[#23272a] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-[#b9bbbe] text-base"
            placeholder="Enter your password"
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-xs italic mt-1">
              {formik.errors.password}
            </div>
          ) : null}
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg transition-all duration-150"
        >
          Login
        </button>
        <p className="mt-6 text-sm text-[#b9bbbe] text-center">
          Need an account?{' '}
          <Link href="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;