"use client";  // This tells Next.js to treat this as a client component

import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    // Redirect to the login page
    router.push('/login');
  };

  const handleRegisterClick = () => {
    // Redirect to the register page
    router.push('/register');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to the CRM Tool</h1>
      <div>
        <button
          onClick={handleLoginClick}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            margin: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Login
        </button>
        <button
          onClick={handleRegisterClick}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            margin: '10px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default HomePage;
