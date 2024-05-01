import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "../ui/input";

export const PasswordInput = ({ ...props }) => {
  const [showpass, setShowPass] = useState<boolean>(false);
  return (
    <div className="relative">
      <Input type={showpass ? "text" : "password"} {...props} />
      <div
        onClick={() => setShowPass(!showpass)}
        className="cursor-pointer absolute right-3 top-1 translate-y-1/2"
      >
        {showpass ? <FaEye /> : <FaEyeSlash />}
      </div>
    </div>
  );
};
