import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo3.png';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const fullName = user?.name || 'Kullanıcı';
  const firstName = fullName.split(' ')[0];
  const userInitial = firstName.charAt(0).toUpperCase();

  // Dışarı tıklanınca menüyü kapat
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className="bg-[#0f172a] dark:bg-slate-900 text-white py-3 px-6 md:px-12 shadow-lg sticky top-0 z-50 transition-colors duration-200 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img src={logo} alt="Jobverse Logo" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        {/* Menü + Auth alanı */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Tema Değiştirme Butonu */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
            title={isDark ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
          >
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Menü Linkleri */}
          <div className="flex items-center gap-6">
          <ul className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-semibold underline decoration-sky-500 underline-offset-4'
                  : 'hover:text-white transition-all'
              }
            >
              Ana Sayfa
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-semibold underline decoration-sky-500 underline-offset-4'
                  : 'hover:text-white transition-all'
              }
            >
              İlanlar
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-semibold underline decoration-sky-500 underline-offset-4'
                  : 'hover:text-white transition-all'
              }
            >
              Analizler
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? 'text-white font-semibold underline decoration-sky-500 underline-offset-4'
                  : 'hover:text-white transition-all'
              }
            >
              Hakkımızda
            </NavLink>
          </ul>
          </div>

          {/* Auth Butonları */}
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={handleLoginClick}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/70 bg-sky-500/10 px-4 py-1.5 text-xs md:text-sm font-medium text-sky-100 hover:bg-sky-500/20 hover:border-sky-300 transition-colors"
            >
              Oturum Aç
            </button>
          ) : (
            <div className="relative flex items-center gap-3" ref={menuRef}>
              {/* Profil avatarı + isim (menü aç/kapa butonu) */}
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs md:text-sm font-semibold text-slate-100 border border-slate-500 shadow-sm">
                  {userInitial}
                </div>
                <div className="hidden md:flex items-center leading-tight text-right">
                  <span className="text-sm font-semibold text-white">{fullName}</span>
                </div>
              </button>

               {/* Dropdown menü */}
               {isMenuOpen && (
                 <div className="absolute right-0 md:right-[-1.5rem] lg:right-[-3rem] top-10 w-56 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl py-1 text-sm backdrop-blur z-50">
                   <div className="px-3 py-2 border-b border-slate-700/60">
                     <p className="text-xs text-slate-400">Oturum açtınız</p>
                     <p className="text-sm font-semibold text-white truncate">
                       {fullName}
                     </p>
                   </div>

                   <button
                     type="button"
                     onClick={() => {
                       setIsMenuOpen(false);
                       navigate('/profile');
                     }}
                     className="w-full flex items-center gap-2 px-3 py-2 text-slate-100 hover:bg-slate-800/80 transition-colors"
                   >
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 24 24"
                       className="h-4 w-4"
                       fill="none"
                       stroke="currentColor"
                       strokeWidth="1.8"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                     >
                       <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                       <path d="M4 20c0-2.761 3.134-5 7-5s7 2.239 7 5" />
                     </svg>
                     <span>Profili Düzenle</span>
                   </button>

                   <button
                     type="button"
                     onClick={() => {
                       setIsMenuOpen(false);
                       navigate('/saved-jobs');
                     }}
                     className="w-full flex items-center gap-2 px-3 py-2 text-slate-100 hover:bg-slate-800/80 transition-colors"
                   >
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 24 24"
                       className="h-4 w-4"
                       fill="none"
                       stroke="currentColor"
                       strokeWidth="1.8"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                     >
                       <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                     </svg>
                     <span>Kaydedilen İlanlar</span>
                   </button>

                   <button
                     type="button"
                     onClick={() => {
                       setIsMenuOpen(false);
                       navigate('/cv-upload');
                     }}
                     className="w-full flex items-center gap-2 px-3 py-2 text-slate-100 hover:bg-slate-800/80 transition-colors"
                   >
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 24 24"
                       className="h-4 w-4"
                       fill="none"
                       stroke="currentColor"
                       strokeWidth="1.8"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                     >
                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                       <polyline points="14 2 14 8 20 8" />
                       <line x1="16" y1="13" x2="8" y2="13" />
                       <line x1="16" y1="17" x2="8" y2="17" />
                       <polyline points="10 9 9 9 8 9" />
                     </svg>
                     <span>CV Yükle</span>
                   </button>

                   <button
                     type="button"
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;