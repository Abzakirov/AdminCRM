import { UserType } from "@/@types";

interface ProfilesClientProps {
  user: UserType | null;  
}

const ProfilesClient: React.FC<ProfilesClientProps> = ({ user }) => {
  if (!user) return null; 

  return (
    <div className="flex items-center gap-2">
      <div className="!text-[14px] max-[670px]:hidden">
        <div className="flex items-center gap-2">
          <h2>{user.first_name}</h2>
          <h2>{user.last_name}</h2>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <div className="bg-[green] w-[10px] h-[10px] rounded-full"></div>
          <h2 className="capitalize text-end">{user.role}</h2>
        </div>
      </div>
      <div className="w-[40px] h-[40px] bg-gray-300 rounded-full text-white text-[18px] text-center dark:bg-white dark:text-black flex items-center justify-center">
        {user.image === "" ? (
          user.first_name.slice(0, 1)
        ) : (
          <img
            src={user.image}
            alt={user.first_name}
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default ProfilesClient;
