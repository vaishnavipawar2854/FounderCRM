import { useAuth } from '../contexts/AuthContext';
import FounderDashboard from '../components/dashboards/FounderDashboard';
import TeamMemberDashboard from '../components/dashboards/TeamMemberDashboard';

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'founder' ? (
        <FounderDashboard />
      ) : (
        <TeamMemberDashboard />
      )}
    </div>
  );
};

export default DashboardPage;