import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Live Chat</h1>
      <Link href="/chat">
        <button style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>Enter Chat</button>
      </Link>
    </main>
  );
}