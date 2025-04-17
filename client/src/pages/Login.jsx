import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from '../utils/axios';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleManualLogin = async () => {
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Manual login failed');
    }
  };

  const handleGoogleSuccess = async (credResponse) => {
    try {
      const res = await axios.post('/auth/google', {
        tokenId: credResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Google sign-in failed');
    }
  };

  return (
    <div className='flex items-center justify-center flex-col gap-5'>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleManualLogin}>Login</button>

      <div style={{ marginTop: '1rem' }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => {}} />
      </div>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>

    </div>
  );
}

export default Login;
