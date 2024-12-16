import SharedProfile from '../shared/Profile';

export default function OwnerProfile({ language }) {
  return <SharedProfile language={language} userType="owner" />;
}