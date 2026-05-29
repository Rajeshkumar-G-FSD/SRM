export default function Home() {
  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f4f6',
      margin: 0
    }}>
      <div style={{
        padding: '3rem',
        borderRadius: '1rem',
        background: 'white',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)'
      }}>
        <h1>SRM Next.js App</h1>
        <p>Next.js is set up in the monorepo alongside Vite and Node.js.</p>
      </div>
    </main>
  );
}
