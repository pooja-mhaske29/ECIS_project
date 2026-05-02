import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';
import { useAuth, useForm } from '@/hooks';

export default function Register() {
  const { register, loading } = useAuth();

  const { values, errors, handleChange, handleSubmit } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    async (formValues) => {
      if (formValues.password !== formValues.confirmPassword) {
        toast.error('Passwords do not match');
        throw new Error('Passwords do not match');
      }
      await register(formValues.name, formValues.email, formValues.password);
    }
  );

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-neon rounded-lg flex items-center justify-center shadow-neon-green">
            <AlertTriangle className="w-10 h-10 text-dark-900" />
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          whileHover={{ borderColor: 'rgba(0, 255, 255, 0.5)' }}
          className="glass-dark p-8 space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neon-green mb-2">ECIS</h1>
            <p className="text-gray-400">Create Your Account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-green hover:text-neon-cyan transition-colors">
              Log in
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
