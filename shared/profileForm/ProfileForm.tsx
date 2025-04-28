'use client';

import { UserType } from "@/@types";

const ProfileForm = ({ user }: { user: UserType }) => {
  return (
    <form className="flex gap-5 w-full max-w-4xl dark:shadow-[#1f1f1f] p-5 rounded bg-white dark:bg-gray-900">
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex flex-col">
          <label className="mb-1 text-black dark:text-white">First Name:</label>
          <input
            type="text"
            value={user.first_name}
            readOnly
            className="p-2 rounded border bg-[#f7f7f7] dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-black dark:text-white">Email:</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="p-2 rounded border bg-[#f7f7f7] dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex flex-col">
          <label className="mb-1 text-black dark:text-white">Last Name:</label>
          <input
            type="text"
            value={user.last_name}
            readOnly
            className="p-2 rounded border bg-[#f7f7f7] dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-black dark:text-white">Role:</label>
          <input
            type="text"
            value={user.role}
            readOnly
            className="p-2 rounded border bg-[#f7f7f7] dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
