import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && router.pathname.startsWith('/chat')) {
      router.replace('/login');
    }
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;