import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import {
  ListTodoIcon,
  UserIcon,
  LogOutIcon,
  PaletteIcon,
  SparklesIcon,
  ChevronDownIcon,
  CheckIcon
} from './Icons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const { addToast } = useToast();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
  };

  const handleSelectTheme = (themeId: any, themeName: string) => {
    setTheme(themeId);
    setDropdownOpen(false);
    addToast(`Theme changed to ${themeName}`, 'success');
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <header className="glass-nav">
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px var(--glow-color)',
            }}
          >
            <SparklesIcon size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TaskFlow
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              3-Tier Enterprise
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: location.pathname === '/' ? 'var(--bg-secondary)' : 'transparent',
              border: location.pathname === '/' ? '1px solid var(--border-color)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <ListTodoIcon size={16} />
            Dashboard
          </Link>

          <Link
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: location.pathname === '/profile' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: location.pathname === '/profile' ? 'var(--bg-secondary)' : 'transparent',
              border: location.pathname === '/profile' ? '1px solid var(--border-color)' : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <UserIcon size={16} />
            Profile
          </Link>
        </nav>

        {/* Right Controls (Theme Switcher & User) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Theme Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn-secondary"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
              }}
              title="Select Color Theme"
            >
              <PaletteIcon size={16} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ textTransform: 'capitalize' }}>
                {themes.find((t) => t.id === theme)?.name}
              </span>
              <ChevronDownIcon size={14} />
            </button>

            {dropdownOpen && (
              <div
                className="glass-card animate-scale-in"
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '200px',
                  padding: '0.5rem',
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    padding: '0.4rem 0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Choose Theme
                </div>
                {themes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTheme(item.id, item.name)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: theme === item.id ? 'var(--bg-input)' : 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: theme === item.id ? 600 : 400,
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: item.badgeColor,
                          display: 'inline-block',
                        }}
                      />
                      {item.name}
                    </div>
                    {theme === item.id && <CheckIcon size={14} style={{ color: 'var(--accent-primary)' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Chip */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.3rem 0.6rem 0.3rem 0.3rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {userInitial}
              </div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.email}
              </span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn-icon"
            style={{ color: '#f87171' }}
            title="Log Out"
          >
            <LogOutIcon size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;