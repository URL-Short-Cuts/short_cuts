import { Avatar } from "@chakra-ui/react";
import { HiScissors } from "react-icons/hi";

export const testIDs = {
  NavBarAvatarLink: "NavBarAvatarLink",
};

interface NavBarAvatarProps {
  href: string;
  image: string;
}

const NavBarAvatar = ({ image }: NavBarAvatarProps) => {
  return (
    <Avatar
      loading={"eager"}
      cursor={"pointer"}
      size={"sm"}
      src={image}
      icon={<HiScissors size={25} />}
    />
  );
};

export default NavBarAvatar;
