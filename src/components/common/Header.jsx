import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationBell from './NotificationBell';
import {
  Menu, X, LogIn, BookOpen, LogOut, Crown,
  MessageCircle, Headphones, Package, Moon, Sun, Languages,
} from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, userData, loginWithGoogle, logout } = useAuth();
  const { darkMode, toggleDarkMode, language, toggleLanguage, t } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [dropdownOpen]);

  const bgColor = darkMode ? 'rgba(26, 26, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const textColor = darkMode ? '#e5e7eb' : '#2D2D3F';
  const panelBg = darkMode ? '#252540' : 'white';

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/courses', label: t('courses') },
    { to: '/about', label: t('about') },
  ];

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '12px 0',
        background: bgColor,
        backdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.08)' : '0 2px 30px rgba(0,0,0,0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Link to="/" style={{
            fontSize: '22px', fontWeight: '800', color: '#6C63FF',
            display: 'flex', alignItems: 'center', gap: '6px',
            textDecoration: 'none', flexShrink: 0,
          }}>
            📚 স্টাডি রুম
          </Link>

          <nav style={{
            display: 'flex', alignItems: 'center', gap: '20px',
          }} className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}
                style={({ isActive }) => ({
                  fontSize: '14px', fontWeight: '500',
                  color: isActive ? '#6C63FF' : textColor,
                  paddingBottom: '4px',
                  borderBottom: isActive ? '2.5px solid #6C63FF' : '2.5px solid transparent',
                  transition: 'all 0.3s', textDecoration: 'none', whiteSpace: 'nowrap',
                })}
              >
                {link.label}
              </NavLink>
            ))}

            {user ? (
              <>
                <NavLink to="/my-courses"
                  style={({ isActive }) => ({
                    fontSize: '14px', fontWeight: '600',
                    color: isActive ? '#6C63FF' : textColor,
                    textDecoration: 'none', paddingBottom: '4px',
                    borderBottom: isActive ? '2.5px solid #6C63FF' : '2.5px solid transparent',
                    whiteSpace: 'nowrap',
                  })}
                >
                  {t('myCourses')}
                </NavLink>

                <NavLink to="/discussion"
                  style={({ isActive }) => ({
                    fontSize: '14px', fontWeight: '600',
                    color: isActive ? '#6C63FF' : textColor,
                    textDecoration: 'none', paddingBottom: '4px',
                    borderBottom: isActive ? '2.5px solid #6C63FF' : '2.5px solid transparent',
                    whiteSpace: 'nowrap',
                  })}
                >
                  {t('discussion')}
                </NavLink>

                {userData?.role === 'admin' && (
                  <NavLink to="/admin"
                    style={{ fontSize: '14px', fontWeight: '600', color: '#FF6584',
                      textDecoration: 'none', display: 'flex',
                      alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
                    }}
                  >
                    <Crown size={14} /> Admin
                  </NavLink>
                )}

                {/* Icon Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={toggleLanguage} title="Language"
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: darkMode ? '#252540' : '#F8F9FE',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: '800', color: '#6C63FF',
                    }}
                  >
                    {language === 'bn' ? 'EN' : 'বাং'}
                  </button>

                  <button onClick={toggleDarkMode} title="Dark Mode"
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: darkMode ? '#252540' : '#F8F9FE',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {darkMode ? <Sun size={16} color="#FFC857" /> : <Moon size={16} color="#6C63FF" />}
                  </button>

                  <NotificationBell />
                </div>

                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      border: '2px solid #6C63FF', cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(108, 99, 255, 0.25)',
                      objectFit: 'cover',
                    }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/38'; }}
                  />

                  {dropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute', top: '50px', right: 0,
                        background: panelBg, borderRadius: '14px',
                        boxShadow: '0 10px 40px rgba(108, 99, 255, 0.25)',
                        padding: '8px', minWidth: '240px', zIndex: 1002,
                      }}
                    >
                      <div style={{
                        padding: '12px 14px', borderBottom: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                        marginBottom: '6px',
                      }}>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: textColor, marginBottom: '2px' }}>
                          {user.displayName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.email}
                        </div>
                      </div>

                      <Link to="/my-courses" style={dropdownLinkStyle(textColor)}>
                        <BookOpen size={16} color="#6C63FF" /> {t('myCourses')}
                      </Link>
                      <Link to="/order-history" style={dropdownLinkStyle(textColor)}>
                        <Package size={16} color="#6C63FF" /> {t('orderHistory')}
                      </Link>
                      <Link to="/discussion" style={dropdownLinkStyle(textColor)}>
                        <MessageCircle size={16} color="#6C63FF" /> {t('discussion')}
                      </Link>
                      <Link to="/support" style={dropdownLinkStyle(textColor)}>
                        <Headphones size={16} color="#6C63FF" /> {t('support')}
                      </Link>
                      {userData?.role === 'admin' && (
                        <Link to="/admin" style={dropdownLinkStyle(textColor)}>
                          <Crown size={16} color="#FF6584" /> {t('adminPanel')}
                        </Link>
                      )}

                      <button onClick={logout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 14px', borderRadius: '8px',
                          color: '#ef4444', fontSize: '14px', fontWeight: '500',
                          background: 'transparent', width: '100%',
                          textAlign: 'left', cursor: 'pointer', border: 'none',
                        }}
                      >
                        <LogOut size={16} /> {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={toggleLanguage}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: darkMode ? '#252540' : '#F8F9FE',
                    border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '800', color: '#6C63FF',
                  }}
                >
                  {language === 'bn' ? 'EN' : 'বাং'}
                </button>
                <button onClick={toggleDarkMode}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: darkMode ? '#252540' : '#F8F9FE',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {darkMode ? <Sun size={16} color="#FFC857" /> : <Moon size={16} color="#6C63FF" />}
                </button>
                <button onClick={loginWithGoogle}
                  style={{
                    padding: '10px 22px',
                    background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                    color: 'white', borderRadius: '50px',
                    fontSize: '13px', fontWeight: '600',
                    boxShadow: '0 8px 20px rgba(108, 99, 255, 0.25)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer', border: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  <LogIn size={15} /> {t('login')}
                </button>
              </div>
            )}
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger"
            style={{ display: 'none', background: 'transparent', padding: '8px', border: 'none' }}
          >
            {menuOpen ? <X size={26} color="#6C63FF" /> : <Menu size={26} color="#6C63FF" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div style={{
        position: 'fixed', top: 0,
        right: menuOpen ? 0 : '-320px',
        width: '300px', height: '100vh',
        background: panelBg, boxShadow: '-4px 0 30px rgba(0,0,0,0.1)',
        padding: '80px 24px 24px', zIndex: 1001,
        transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto',
      }}>
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px', background: darkMode ? '#1a1a2e' : 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
            borderRadius: '14px', marginBottom: '20px',
          }}>
            <img src={user.photoURL} alt=""
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '2px solid #6C63FF', objectFit: 'cover',
              }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
            />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '14px', color: textColor, marginBottom: '2px' }}>
                {user.displayName}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}
              style={({ isActive }) => ({
                display: 'block', padding: '14px 0',
                borderBottom: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                color: isActive ? '#6C63FF' : textColor,
                fontWeight: '600', fontSize: '15px',
                textDecoration: 'none',
              })}
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink to="/my-courses" style={mobileLinkStyle(textColor, darkMode)}>
                📚 {t('myCourses')}
              </NavLink>
              <NavLink to="/order-history" style={mobileLinkStyle(textColor, darkMode)}>
                📦 {t('orderHistory')}
              </NavLink>
              <NavLink to="/discussion" style={mobileLinkStyle(textColor, darkMode)}>
                {t('discussion')}
              </NavLink>
              <NavLink to="/support" style={mobileLinkStyle(textColor, darkMode)}>
                {t('support')}
              </NavLink>
              {userData?.role === 'admin' && (
                <NavLink to="/admin"
                  style={({ isActive }) => ({
                    display: 'block', padding: '14px 0',
                    borderBottom: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                    color: '#FF6584', fontWeight: '700',
                    fontSize: '15px', textDecoration: 'none',
                  })}
                >
                  👑 {t('adminPanel')}
                </NavLink>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button onClick={toggleLanguage}
                  style={{
                    flex: 1, padding: '12px',
                    background: darkMode ? '#252540' : '#F8F9FE',
                    border: 'none', borderRadius: '10px',
                    fontSize: '13px', fontWeight: '800',
                    color: '#6C63FF', cursor: 'pointer',
                  }}
                >
                  🌐 {language === 'bn' ? 'English' : 'বাংলা'}
                </button>
                <button onClick={toggleDarkMode}
                  style={{
                    flex: 1, padding: '12px',
                    background: darkMode ? '#252540' : '#F8F9FE',
                    border: 'none', borderRadius: '10px',
                    fontSize: '13px', fontWeight: '800',
                    color: '#6C63FF', cursor: 'pointer',
                  }}
                >
                  {darkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>

              <button onClick={logout}
                style={{
                  marginTop: '12px', padding: '14px',
                  background: '#FEE2E2', color: '#ef4444',
                  borderRadius: '12px', fontSize: '15px',
                  fontWeight: '700', cursor: 'pointer', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <LogOut size={17} /> {t('logout')}
              </button>
            </>
          ) : (
            <button onClick={loginWithGoogle}
              style={{
                marginTop: '16px', padding: '14px',
                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                color: 'white', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                border: 'none', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 8px 20px rgba(108, 99, 255, 0.25)',
              }}
            >
              <LogIn size={17} /> {t('login')}
            </button>
          )}
        </div>
      </div>

      <div onClick={() => setMenuOpen(false)} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
        zIndex: 1000, opacity: menuOpen ? 1 : 0,
        visibility: menuOpen ? 'visible' : 'hidden',
        transition: 'all 0.3s',
      }} />

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav { gap: 12px !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
};

const dropdownLinkStyle = (color) => ({
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '10px 14px', borderRadius: '8px',
  color, fontSize: '14px', fontWeight: '500',
  textDecoration: 'none',
});

const mobileLinkStyle = (color, dark) => ({ isActive }) => ({
  display: 'block', padding: '14px 0',
  borderBottom: `1px solid ${dark ? '#374151' : '#E5E7EB'}`,
  color: isActive ? '#6C63FF' : color,
  fontWeight: '600', fontSize: '15px', textDecoration: 'none',
});

export default Header;
