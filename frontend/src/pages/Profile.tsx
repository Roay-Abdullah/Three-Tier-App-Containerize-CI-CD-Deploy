import Navbar from '../components/common/Navbar';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h1>Profile</h1>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
    </div>
  );
};

export default Profile;