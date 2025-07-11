import { Metadata } from 'next';
import { auth } from '@/auth';
import ClientProfile from './client-profile';

export const metadata: Metadata = {
  title: 'Customer Profile',
};

const Profile = async () => {
  const session = await auth();

  return <ClientProfile session={session} />;
};

export default Profile;
