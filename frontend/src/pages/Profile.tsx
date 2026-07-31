import Navbar from '../components/common/Navbar';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { ShieldIcon, UserIcon, PaletteIcon, CheckIcon } from '../components/common/Icons';

const Profile = () => {
  const { user } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const { addToast } = useToast();

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  const handleSelectTheme = (themeId: any, themeName: string) => {
    setTheme(themeId);
    addToast(`Theme changed to ${themeName}`, 'success');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1 }}>
        {/* Profile Banner Card */}
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: '2.5rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              fontSize: '2.5rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px var(--glow-color)',
            }}
          >
            {userInitial}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{user?.email || 'User Account'}</h1>
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {user?.role || 'USER'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              Logged in to Three-Tier Enterprise Task Suite
            </p>
          </div>
        </div>

        {/* Theme Settings Section */}
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <PaletteIcon size={24} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Appearance & Themes</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Customize your visual interface palette across all devices.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            {themes.map((t) => {
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id, t.name)}
                  style={{
                    padding: '1.25rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      background: t.previewGradient,
                      marginBottom: '0.85rem',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</span>
                    {isSelected && <CheckIcon size={16} style={{ color: 'var(--accent-primary)' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Details Card */}
        <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <UserIcon size={24} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Account Information</h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem', color: 'var(--text-secondary)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontWeight: 500 }}>Email Address</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.email || 'N/A'}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontWeight: 500 }}>Role Permission</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.role || 'USER'}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
              }}
            >
              <span style={{ fontWeight: 500 }}>Authentication System</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.36rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                <ShieldIcon size={16} style={{ color: '#34d399' }} /> Standard JWT Session
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;