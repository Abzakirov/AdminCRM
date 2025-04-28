
import { cookies } from 'next/headers';
import MainProfile from '../mainProfile/MainProfile';

const Profiles = async () => {
  const cookieStore = await cookies();
  const res = cookieStore.get('user');
  const user = res ? JSON.parse(res.value) : null;

  if (!user) return null; 

  return (
    <div>
      <MainProfile user={user} />
    </div>
  );
};

export default Profiles;
