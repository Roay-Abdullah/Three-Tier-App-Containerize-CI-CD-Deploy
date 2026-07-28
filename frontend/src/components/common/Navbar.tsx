import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', gap: '1rem' }}>
      <Link to="/">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      {user && <span>Welcome, {user.email}</span>}
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default Navbar;