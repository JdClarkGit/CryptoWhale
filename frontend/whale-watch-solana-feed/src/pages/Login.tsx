import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import { FiAlertTriangle } from 'react-icons/fi';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Logo
import WhaleIcon from '../assets/whale-icon.svg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFirebaseStatus, setShowFirebaseStatus] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting to log in with:', { email, password: '********' });
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      
      if (err instanceof FirebaseError) {
        console.log('Login error:', err);
        
        // Handle specific Firebase auth errors
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Invalid email address format.');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email. Please sign up first.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password. Please try again.');
            break;
          case 'auth/invalid-credential':
            setError('Invalid login credentials. Please check your email and password.');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed login attempts. Please try again later or reset your password.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your internet connection and try again.');
            break;
          case 'auth/api-key-not-valid':
            setError('Authentication service configuration error. Please contact support.');
            setShowFirebaseStatus(true);
            break;
          default:
            setError(`Login failed: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Unexpected login error:', err);
      }
    }
  };

  const handleTestLogin = () => {
    setEmail('test@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 text-white border-gray-800">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 mb-2">
            <img src={WhaleIcon} alt="CryptoWhale Logo" className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
            CryptoWhale
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        {error && (
          <div className="px-6">
            <Alert className="bg-red-900/30 border-red-800 text-red-300 mb-4">
              <FiAlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {showFirebaseStatus && (
          <div className="px-6">
            <Alert className="bg-yellow-900/30 border-yellow-800 text-yellow-300 mb-4">
              <FiAlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Firebase configuration issue detected. The API key may be invalid or the service may be unavailable.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Link to="/forgot-password" className="text-sm text-cyan-500 hover:text-cyan-400">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="rounded bg-gray-800 border-gray-700 text-cyan-500"
              />
              <Label htmlFor="remember" className="text-sm text-gray-300">Remember me</Label>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleTestLogin}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Use Test Account
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-500 hover:text-cyan-400">
              Sign up
            </Link>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Test Account: test@example.com / password123
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
