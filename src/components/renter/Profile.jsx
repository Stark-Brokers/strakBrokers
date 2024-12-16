import SharedProfile from '../shared/Profile';

export default function RenterProfile({ language }) {
  return <SharedProfile language={language} userType="renter" />;
} 