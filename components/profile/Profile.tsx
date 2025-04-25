import ProfileForm from "@/shared/profileForm/ProfileForm";
import { Button } from "antd";
import React from "react";

const Profiles = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <img src="" alt="" />
          </div>
          <div>
            <h2></h2>
            <p></p>
          </div>
        </div>
        <Button type="primary">Edit Profile </Button>
      </div>
      <div>
        <ProfileForm />
      </div>
    </div>
  );
};

export default Profiles;
