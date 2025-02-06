import React, { useState } from "react";

import { auth, signOut } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import {  useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "../../Hooks/auth";
import {
  Avatar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,

} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

const profileMenuItems = [
  {
    label: "Log Out",
    icon: PowerIcon,
  },
];

export default function Header() {

  const  user  = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const closeMenu = () => setIsMenuOpen(false);

  const signOutMutation = useMutation({
    mutationFn: async () => {
      await signOut(auth);
      console.log("Logged out successfully");
      queryClient.setQueryData(['authUser'], null);
      localStorage.removeItem("user")
      navigate("/");
    },
  });

  const handleSignOut = () => {
    signOutMutation.mutate();
  };


  return (
    <div className="flex justify-between p-4 mb-5 transition-colors duration-300 "  
    style={{ backgroundColor: "#e1c1e4",
    // position:'fixed',
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
     }}>
      <h1 className="flex text-2xl dark:text-blue font-bold items-center gap-2">
      <i className='fa fa-file' aria-hidden="true"></i> TaskBuddy
      </h1>

      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
            {...(undefined as any)}
          >
            <Avatar
              variant="circular"
              size="sm"
              alt={user?.displayName}
              className="border border-gray-900 p-0.5"
              src={user?.photoURL}
              {...(undefined as any)}
            />
            {user?.displayName}
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""
                }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1" {...(undefined as any)}>
          {profileMenuItems.map(({ label, icon }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={isLastItem ? handleSignOut : closeMenu}
                className={`flex items-center gap-2 rounded ${isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
                  }`}
                  {...(undefined as any)}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  // onClick={handleSignOut}
                  color={isLastItem ? "red" : "inherit"}
                  {...(undefined as any)}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

    </div>
  );
}


