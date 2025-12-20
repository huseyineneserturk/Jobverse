import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/images/logo3.png';

const AuthPage = () => {
  const { login, register, loginWithGoogle, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signIn'); // 'signIn' | 'signUp'

  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });

  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [localError, setLocalError] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const currentError = localError || error;

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setLocalError(null);

    try {
      const result = await loginWithGoogle();

      if (result.success) {
        navigate('/');
      } else {
        setLocalError(result.error || 'Google ile giriş yapılamadı.');
      }
    } catch (error) {
      setLocalError(error.message || 'Google ile giriş yapılırken bir hata oluştu.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const result = await login(signInForm.email, signInForm.password);
    if (!result.success) {
      setLocalError(result.error);
      return;
    }

    navigate('/');
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const result = await register(signUpForm.name, signUpForm.email, signUpForm.password);
    if (!result.success) {
      setLocalError(result.error);
      return;
    }

    navigate('/');
  };


  const formVariants = {
    initial: (direction) => ({
      x: direction === 'left' ? -40 : 40,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction === 'left' ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 relative transition-colors duration-200">
      {/* Ana Sayfaya Dön Butonu */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 md:top-6 md:left-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#0f172a] via-slate-800 to-[#0f172a] text-white px-3 py-1.5 text-xs md:text-sm font-medium hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 transition-all z-10 shadow-md"
        aria-label="Ana Sayfaya Dön"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">Ana Sayfaya Dön</span>
      </button>

      <motion.div
        layout
        className={`relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row transition-colors duration-200 ${mode === 'signUp' ? 'md:flex-row-reverse' : ''
          }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          layout: { type: 'spring', stiffness: 350, damping: 30 },
          duration: 0.4,
          ease: 'easeOut',
        }}
      >
        {/* Sol taraf: Logo + Form */}
        <motion.div
          layout
          transition={{ layout: { type: 'spring', stiffness: 350, damping: 30 } }}
          className="w-full md:w-1/2 px-10 py-8 md:py-10 flex flex-col justify-center bg-white dark:bg-slate-800 transition-colors duration-200"
        >
          <div className="mb-6 flex justify-center md:justify-start">
            <img
              src={logo}
              alt="Jobverse"
              className="h-8 md:h-9 object-contain"
            />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {mode === 'signIn' ? (
              <motion.div
                key="sign-in"
                custom="left"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="min-h-[360px] flex flex-col"
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center md:text-left transition-colors duration-200">
                  Giriş Yap
                </h2>

                <form
                  onSubmit={handleSignInSubmit}
                  className="space-y-4 flex flex-col justify-between flex-1"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-200">
                      E-posta
                    </label>
                    <input
                      type="email"
                      required
                      value={signInForm.email}
                      onChange={(e) =>
                        setSignInForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                      placeholder="ornek@mail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-200">
                      Şifre
                    </label>
                    <input
                      type="password"
                      required
                      value={signInForm.password}
                      onChange={(e) =>
                        setSignInForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                      placeholder="Şifreniz"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 transition-colors duration-200">
                    <span>
                      Test için: <span className="font-mono">test@mail.com</span> /{' '}
                      <span className="font-mono">123</span>
                    </span>
                    <button
                      type="button"
                      className="text-sky-600 hover:underline"
                    >
                      Şifreni mi unuttun?
                    </button>
                  </div>

                  {currentError && (
                    <p className="text-sm text-red-500">{currentError}</p>
                  )}

                  <div className="space-y-3">
                    {/* Google ile devam et butonu */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading || isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-sm py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>
                        {isGoogleLoading ? 'Google ile giriş yapılıyor...' : 'Google ile devam et'}
                      </span>
                    </button>

                    {/* Ayırıcı */}
                    <div className="relative flex items-center py-2">
                      <div className="flex-1 border-t border-slate-200 dark:border-slate-600"></div>
                      <span className="px-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-200">veya</span>
                      <div className="flex-1 border-t border-slate-200 dark:border-slate-600"></div>
                    </div>

                    {/* Normal giriş butonu */}
                    <button
                      type="submit"
                      disabled={isLoading || isGoogleLoading}
                      className="w-full rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="sign-up"
                custom="right"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut', type: 'spring', stiffness: 300, damping: 28 }}
                className="min-h-[360px] flex flex-col"
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center md:text-left transition-colors duration-200">
                  Kayıt Ol
                </h2>

                <form
                  onSubmit={handleSignUpSubmit}
                  className="space-y-4 flex flex-col justify-between flex-1"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-200">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      required
                      value={signUpForm.name}
                      onChange={(e) =>
                        setSignUpForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-200">
                      E-posta
                    </label>
                    <input
                      type="email"
                      required
                      value={signUpForm.email}
                      onChange={(e) =>
                        setSignUpForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full rounded-md border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                      placeholder="ornek@mail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-200">
                      Şifre
                    </label>
                    <input
                      type="password"
                      required
                      value={signUpForm.password}
                      onChange={(e) =>
                        setSignUpForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200"
                      placeholder="En az 3 karakter (mock: 123)"
                    />
                  </div>

                  {currentError && (
                    <p className="text-sm text-red-500">{currentError}</p>
                  )}

                  <div className="space-y-3">
                    {/* Google ile devam et butonu */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading || isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-sm py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>
                        {isGoogleLoading ? 'Google ile kayıt yapılıyor...' : 'Google ile devam et'}
                      </span>
                    </button>

                    {/* Ayırıcı */}
                    <div className="relative flex items-center py-2">
                      <div className="flex-1 border-t border-slate-200 dark:border-slate-600"></div>
                      <span className="px-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-200">veya</span>
                      <div className="flex-1 border-t border-slate-200 dark:border-slate-600"></div>
                    </div>

                    {/* Normal kayıt butonu */}
                    <button
                      type="submit"
                      disabled={isLoading || isGoogleLoading}
                      className="w-full rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sağ taraf: Lacivert panel (Logo + Hello, Friend!) */}
        <motion.div
          layout
          className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-600 text-white flex flex-col items-center justify-center px-10 py-10 text-center"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            layout: { type: 'spring', stiffness: 350, damping: 30 },
            duration: 0.4,
            ease: 'easeOut',
          }}
        >
          <div className="absolute top-6 left-1/2 -translate-x-1/2 md:static md:translate-x-0 mb-6">
            <img
              src={logo}
              alt="Jobverse"
              className="h-8 md:h-9 object-contain drop-shadow-[0_0_12px_rgba(15,23,42,0.5)]"
            />
          </div>
          {mode === 'signIn' ? (
            <>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Hoş Geldiniz,
              </h3>
              <p className="text-sm md:text-base text-slate-200 mb-6 max-w-xs">
                Kişisel bilgilerinizi girerek Jobverse’e katılın ve kariyer
                yolculuğunuzu bizimle birlikte şekillendirin.
              </p>
              <button
                type="button"
                onClick={() => setMode('signUp')}
                className="inline-flex items-center justify-center rounded-full border border-white/90 px-8 py-2.5 text-sm font-semibold hover:bg-white hover:text-slate-900 transition-colors"
              >
                Kayıt Ol
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Tekrar Hoş Geldiniz
              </h3>
              <p className="text-sm md:text-base text-slate-200 mb-6 max-w-xs">
                Mevcut bir hesabınız varsa giriş yaparak başvurularınızı ve
                favori ilanlarınızı kolayca yönetin.
              </p>
              <button
                type="button"
                onClick={() => setMode('signIn')}
                className="inline-flex items-center justify-center rounded-full border border-white/90 px-8 py-2.5 text-sm font-semibold hover:bg-white hover:text-slate-900 transition-colors"
              >
                Giriş Yap
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
