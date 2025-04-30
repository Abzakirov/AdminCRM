import { useEffect, useState } from "react";
import { UserType } from "@/@types";
import ProfilesClient from "../profil/Profiles";

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));

    if (userCookie) {
      const userValue = userCookie.split('=')[1];
      setUser(JSON.parse(decodeURIComponent(userValue)));
    }
  }, []);

  return <ProfilesClient user={user} />;
}
