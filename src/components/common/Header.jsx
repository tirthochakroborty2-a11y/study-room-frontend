import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  LogIn,
  User,
  LogOut,
  Crown,
  MessageCircle,
  BookOpen,
} from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, userData, loginWithGoogle, logout } = useAuth();
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

  const navLinks = [
    { to: '/', label: 'হোম' },
    { to: '/courses', label: 'কোর্স' },
    { to: '/about', label: 'অ্যাবাউট' },
  ];

  const userNavLinks = [
    { to: '/my-courses', label: 'আমার কোর্স' },
    { to: '/discussion', label: '💬 Discussion' },
  ];

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '12px 0',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: scrolled
          ? '0 4px 30px rgba(0,0,0,0.08)'
          : '0 2px 30px rgba(0,0,0,0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Logo */}
          <Link to="/" style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#6C63FF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            📚 স্টাডি রুম
          </Link>

          {/* Desktop Nav */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }} className="desktop-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isActive ? '#6C63FF' : '#2D2D3F',
                  position: 'relative',
                  paddingBottom: '4px',
                  borderBottom: isActive
                    ? '2.5px solid #6C63FF'
                    : '2.5px solid transparent',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                })}
              >
                {link.label}
              </NavLink>
            ))}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* User Nav Links */}
                {userNavLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    style={({ isActive }) => ({
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isActive ? '#6C63FF' : '#2D2D3F',
                      textDecoration: 'none',
                      paddingBottom: '4px',
                      borderBottom: isActive
                        ? '2.5px solid #6C63FF'
                        : '2.5px solid transparent',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap',
                    })}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {userData?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    style={({ isActive }) => ({
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#FF6584',
                      textDecoration: 'none',
                      paddingBottom: '4px',
                      borderBottom: isActive
                        ? '2.5px solid #FF6584'
                        : '2.5px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                    })}
                  >
                    <Crown size={14} /> Admin
                  </NavLink>
                )}

                {/* User Avatar Dropdown */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '2px solid #6C63FF',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 12px rgba(108, 99, 255, 0.25)',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/38';
                    }}
                  />

                  {dropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: 'absolute',
                        top: '50px',
                        right: 0,
                        background: 'white',
                        borderRadius: '14px',
                        boxShadow: '0 10px 40px rgba(108, 99, 255, 0.20)',
                        padding: '8px',
                        minWidth: '240px',
                        zIndex: 1002,
                        animation: 'fadeIn 0.2s ease',
                      }}
                    >
                      <div style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid #E5E7EB',
                        marginBottom: '6px',
                      }}>
                        <div style={{
                          fontWeight: '700',
                          fontSize: '14px',
                          color: '#2D2D3F',
                          marginBottom: '2px',
                        }}>
                          {user.displayName}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {user.email}
                        </div>
                      </div>

                      <Link
                        to="/my-courses"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          color: '#2D2D3F',
                          fontSize: '14px',
                          fontWeight: '500',
                          textDecoration: 'none',
                        }}
                      >
                        <BookOpen size={16} color="#6C63FF" /> আমার কোর্স
                      </Link>

                      <Link
                        to="/discussion"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          color: '#2D2D3F',
                          fontSize: '14px',
                          fontWeight: '500',
                          textDecoration: 'none',
                        }}
                      >
                        <MessageCircle size={16} color="#6C63FF" /> Discussion
                      </Link>

                      {userData?.role === 'admin' && (
                        <Link
                          to="/admin"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            color: '#2D2D3F',
                            fontSize: '14px',
                            fontWeight: '500',
                            textDecoration: 'none',
                          }}
                        >
                          <Crown size={16} color="#FF6584" /> Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          color: '#ef4444',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: 'transparent',
                          width: '100%',
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: 'none',
                        }}
                      >
                        <LogOut size={16} /> লগআউট
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                style={{
                  padding: '10px 22px',
                  background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                  color: 'white',
                  borderRadius: '50px',
                  fontSize: '13px',
                  fontWeight: '600',
                  boxShadow: '0 8px 20px rgba(108, 99, 255, 0.25)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  border: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <LogIn size={15} /> Login
              </button>
            )}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger"
            style={{
              display: 'none',
              background: 'transparent',
              padding: '8px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {menuOpen ? (
              <X size={26} color="#6C63FF" />
            ) : (
              <Menu size={26} color="#6C63FF" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: menuOpen ? 0 : '-320px',
        width: '300px',
        height: '100vh',
        background: 'white',
        boxShadow: '-4px 0 30px rgba(0,0,0,0.1)',
        padding: '80px 24px 24px',
        zIndex: 1001,
        transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto',
      }}>
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
            borderRadius: '14px',
            marginBottom: '20px',
          }}>
            <img
              src={user.photoURL}
              alt={user.displayName}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '2px solid #6C63FF',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48';
              }}
            />
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{
                fontWeight: '700',
                fontSize: '14px',
                color: '#2D2D3F',
                marginBottom: '2px',
              }}>
                {user.displayName}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6B7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Public Links */}
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'block',
                padding: '14px 0',
                borderBottom: '1px solid #E5E7EB',
                color: isActive ? '#6C63FF' : '#2D2D3F',
                fontWeight: '600',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.3s',
              })}
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink
                to="/my-courses"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '14px 0',
                  borderBottom: '1px solid #E5E7EB',
                  color: isActive ? '#6C63FF' : '#2D2D3F',
                  fontWeight: '600',
                  fontSize: '15px',
                  textDecoration: 'none',
                })}
              >
                📚 আমার কোর্স
              </NavLink>

              <NavLink
                to="/discussion"
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '14px 0',
                  borderBottom: '1px solid #E5E7EB',
                  color: isActive ? '#6C63FF' : '#2D2D3F',
                  fontWeight: '600',
                  fontSize: '15px',
                  textDecoration: 'none',
                })}
              >
                💬 Discussion
              </NavLink>

              {userData?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  style={({ isActive }) => ({
                    display: 'block',
                    padding: '14px 0',
                    borderBottom: '1px solid #E5E7EB',
                    color: '#FF6584',
                    fontWeight: '700',
                    fontSize: '15px',
                    textDecoration: 'none',
                  })}
                >
                  👑 Admin Panel
                </NavLink>
              )}

              <button
                onClick={logout}
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  background: '#FEE2E2',
                  color: '#ef4444',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <LogOut size={17} /> লগআউট
              </button>
            </>
          ) : (
            <button
              onClick={loginWithGoogle}
              style={{
                marginTop: '16px',
                padding: '14px',
                background: 'linear-gradient(135deg, #6C63FF, #5A52D5)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(108, 99, 255, 0.25)',
              }}
            >
              <LogIn size={17} /> Login with Google
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s',
        }}
      />

      <style>{`
        @media (max-width: 992px) {
          .desktop-nav {
            gap: 16px !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Header;
