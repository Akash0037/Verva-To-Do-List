
import React, { useState } from 'react';
import { User } from '../types';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  id: string;
  disabled?: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

// Moved outside Login component to prevent re-creation on every render
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  id,
  disabled,
  isFocused,
  onFocus,
  onBlur
}) => {
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative mb-8 w-full max-w-[320px] group">
      <label
        htmlFor={id}
        className={`absolute uppercase tracking-[0.25em] font-black transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none z-20 ${isActive
            ? "-top-3 right-2 bg-emerald-600 text-white text-[8px] px-2 py-1 rounded-lg border-2 border-emerald-700 shadow-[3px_3px_0_rgba(5,150,105,0.2)] scale-110"
            : "top-4 left-6 text-emerald-800 text-[10px] opacity-50 group-hover:opacity-100"
          }`}
      >
        {label}
      </label>

      <div className="relative w-full">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
          className={`w-full bg-white/40 backdrop-blur-sm px-6 py-4 outline-none text-emerald-950 font-bold tracking-[0.1em] transition-all duration-300 rounded-xl disabled:opacity-50 ${isActive
              ? "border-2 border-emerald-600 shadow-[4px_4px_0_rgba(5,150,105,0.05)] bg-white"
              : "border-l-[3px] border-b-[3px] border-emerald-600/40 border-t-0 border-r-0 rounded-none bg-transparent group-hover:border-emerald-600/60"
            }`}
        />
      </div>
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      onLogin(user);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('LOGIN CANCELLED');
      } else if (err.code === 'auth/popup-blocked') {
        setError('POPUP BLOCKED');
      } else {
        setError('GOOGLE LOGIN FAILED');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isSignUp && !name)) {
      setError('MISSING FIELDS');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const user = await signUpWithEmail(email, password, name);
        onLogin(user);
      } else {
        const user = await signInWithEmail(email, password);
        onLogin(user);
      }
    } catch (err: any) {
      // Handle Firebase auth errors with user-friendly messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('EMAIL ALREADY EXISTS');
          break;
        case 'auth/invalid-email':
          setError('INVALID EMAIL FORMAT');
          break;
        case 'auth/weak-password':
          setError('PASSWORD TOO WEAK (MIN 6 CHARS)');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('INVALID CREDENTIALS');
          break;
        case 'auth/too-many-requests':
          setError('TOO MANY ATTEMPTS - TRY LATER');
          break;
        default:
          setError('AUTHENTICATION FAILED');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-emerald-50 p-4 font-sans antialiased relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-200 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] bg-sky-200 rounded-full blur-[120px] opacity-30"></div>

      {/* Compact Hero Branding Section */}
      <div className="mb-6 flex flex-col items-center gap-2 group cursor-default z-10 text-center scale-90 md:scale-100">
        <div className="flex items-center gap-4">
          <div className="h-[1.5px] w-8 bg-emerald-900/10"></div>
          <div className="relative">
            <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-sky-600 rounded-xl shadow-xl -rotate-6 group-hover:rotate-0 transition-all duration-500">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
          </div>
          <div className="h-[1.5px] w-8 bg-emerald-900/10"></div>
        </div>
        <h1 className="text-2xl font-black tracking-[-0.02em] text-emerald-950 uppercase">
          VERVA <span className="text-sky-600">AI</span>
        </h1>
      </div>

      {/* Tightened Login Card */}
      <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border-2 border-white shadow-[0_24px_48px_-12px_rgba(5,150,105,0.1)] w-full max-w-[440px] flex flex-col items-center z-10">

        <div className="relative mb-8 text-center">
          <h2 className="text-xl font-black text-emerald-950 tracking-[0.15em] uppercase relative z-10">
            {isSignUp ? 'REGISTER' : 'LOG IN'}
          </h2>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-[4px] bg-emerald-600 rounded-full opacity-10"></div>
        </div>

        {error && (
          <div className="mb-6 py-2 px-6 bg-rose-50 text-rose-600 border border-rose-100 font-black tracking-[0.1em] text-[10px] uppercase rounded-xl shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="w-full flex flex-col items-center">
          {isSignUp && (
            <InputField
              label="FULL NAME"
              value={name}
              onChange={setName}
              id="name"
              disabled={loading}
              isFocused={focusedField === 'name'}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          )}

          <InputField
            label="EMAIL ADDRESS"
            value={email}
            onChange={setEmail}
            type="email"
            id="email"
            disabled={loading}
            isFocused={focusedField === 'email'}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />

          <InputField
            label="SECURE PASSWORD"
            value={password}
            onChange={setPassword}
            type="password"
            id="password"
            disabled={loading}
            isFocused={focusedField === 'password'}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 relative overflow-hidden w-full max-w-[320px] py-4 bg-emerald-600 border-2 border-emerald-700 rounded-xl text-white font-black tracking-[0.3em] uppercase transition-all duration-300 hover:bg-emerald-700 active:scale-95 text-[11px] group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10">{loading ? 'PROCESSING...' : 'INITIALIZE ACCESS'}</span>
            <div className="absolute inset-0 bg-sky-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4 w-full px-8">
          <div className="flex-1 h-[1px] bg-emerald-950/10"></div>
          <span className="text-[9px] font-black tracking-[0.3em] text-emerald-950/20 uppercase">OR</span>
          <div className="flex-1 h-[1px] bg-emerald-950/10"></div>
        </div>

        <div className="mt-6 w-full flex justify-center">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-emerald-100 hover:border-emerald-200 bg-white hover:bg-emerald-50 transition-all text-[10px] font-black tracking-[0.2em] text-emerald-900 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-sm border border-emerald-50 group-hover:scale-110 transition-transform">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            {loading ? 'PROCESSING...' : 'CONTINUE WITH GOOGLE'}
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-center text-[9px] font-bold text-emerald-900/30 tracking-[0.2em] uppercase">
            {isSignUp ? 'ALREADY PART OF THE GRID?' : "READY TO DESIGN YOUR DAY?"}
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            disabled={loading}
            className="text-sky-600 font-black tracking-[0.25em] text-[10px] border-b-2 border-sky-600/20 pb-1 uppercase transition-all hover:text-emerald-950 hover:border-emerald-950 disabled:opacity-50"
          >
            {isSignUp ? 'GO TO LOGIN' : 'JOIN THE ARCHITECTS'}
          </button>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="mt-6 opacity-20 hover:opacity-100 transition-opacity duration-500 z-10 cursor-default">
        <p className="text-[9px] font-black text-emerald-950 tracking-[0.8em] uppercase">
          Verva OS // Ver 2.5
        </p>
      </div>
    </div>
  );
};

export default Login;
