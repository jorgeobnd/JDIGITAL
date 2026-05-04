'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { mockUsers } from '@/lib/mockData';
import { ArrowLeft, CheckCircle, AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('El email es requerido');
    } else if (!emailRegex.test(value)) {
      setEmailError('Formato de email inválido');
    } else {
      const userExists = mockUsers.some(u => u.email === value);
      if (!userExists) {
        setEmailError('Este email no está registrado');
      } else {
        setEmailError('');
      }
    }
  };

  const validatePasswords = (pwd: string, confirm: string) => {
    if (!pwd || !confirm) {
      setPasswordError('Completa ambos campos');
      return false;
    }
    if (pwd.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('Debe contener al menos una mayúscula');
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      setPasswordError('Debe contener al menos un número');
      return false;
    }
    if (pwd !== confirm) {
      setPasswordError('Las contraseñas no coinciden');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateEmail(email);

    if (!emailError && email) {
      setLoading(true);
      setTimeout(() => {
        setConfirmMessage(`Se ha enviado un enlace de recuperación a ${email}`);
        setStep('reset');
        setLoading(false);
      }, 500);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePasswords(newPassword, confirmPassword)) {
      setLoading(true);
      setTimeout(() => {
        router.push('/login');
      }, 500);
    }
  };

  const passwordStrength = () => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[!@#$%^&*]/.test(newPassword)) score++;
    return score;
  };

  const strengthColor = () => {
    const score = passwordStrength();
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-yellow-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const strengthText = () => {
    const score = passwordStrength();
    if (score <= 1) return 'Débil';
    if (score === 2) return 'Regular';
    if (score === 3) return 'Buena';
    return 'Fuerte';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al inicio de sesión
          </Link>

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === 'email' ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
            </h1>
          </div>

          {/* Step 1: Email Verification */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Ingresa tu correo electrónico y te enviaremos un enlace para resetear tu contraseña.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="admin@jdigital.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-600 mt-1">{emailError}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
              >
                {loading ? 'Enviando...' : 'Continuar'}
              </Button>
            </form>
          )}

          {/* Step 2: Password Reset */}
          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {confirmMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">{confirmMessage}</p>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa nueva contraseña"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strengthColor()} transition-all`}
                          style={{ width: `${(passwordStrength() / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {strengthText()}
                      </span>
                    </div>
                    <ul className="text-xs text-gray-600 mt-2 space-y-1">
                      <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                        ✓ Mínimo 8 caracteres
                      </li>
                      <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                        ✓ Una mayúscula
                      </li>
                      <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                        ✓ Un número
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirma la contraseña"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className={`pl-10 pr-10 ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-500'
                        : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-xs text-green-600 mt-1">Las contraseñas coinciden</p>
                )}
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{passwordError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
              >
                {loading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
