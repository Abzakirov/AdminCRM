'use client';

import { UserType } from "@/@types";
import { Lock } from "lucide-react";
import { useState } from "react";

const ProfileForm = ({ user }: { user: UserType }) => {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleEnter = () => setHovered(true);
  const handleLeave = () => setHovered(false);

  const inputClass =
    "p-2 rounded border bg-[#f7f7f7] dark:bg-gray-800 text-black dark:text-white cursor-not-allowed opacity-60 max-[568px]-w-full";

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-4xl"
    >
     

      <form className="flex gap-5 w-full dark:shadow-[#1f1f1f] p-5 rounded bg-white dark:bg-gray-900 max-[568px]:flex-col max-[568px]:flex max-[568px]:gap-3">
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <label className="mb-1 text-black dark:text-white">First Name:</label>
            <input
              type="text"
              value={user.first_name}
              readOnly
              className={inputClass}
            />
          </div>
          <div className="flex flex-col" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <label className="mb-1 text-black dark:text-white">Email:</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5">
          <div className="flex flex-col" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <label className="mb-1 text-black dark:text-white">Last Name:</label>
            <input
              type="text"
              value={user.last_name}
              readOnly
              className={inputClass}
            />
          </div>
          <div className="flex flex-col" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <label className="mb-1 text-black dark:text-white">Role:</label>
            <input
              type="text"
              value={user.role}
              readOnly
              className={inputClass}
            />
          </div>
        </div>
      </form>
    </div>
  );};

export default ProfileForm;
