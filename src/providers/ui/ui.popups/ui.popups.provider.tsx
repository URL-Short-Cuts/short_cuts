import { createContext, useReducer } from "react";
import InitialContext from "./ui.popups.initial";
import { UserInterfacePopUpsReducer } from "./ui.popups.reducer";
import type { ReactNode } from "react";

export const UserInterfacePopUpsContext = createContext({ ...InitialContext });

interface UserInterfacePopUpsProviderProps {
  children: ReactNode;
}

const UserInterfacePopUpsProvider = ({
  children,
}: UserInterfacePopUpsProviderProps) => {
  const [status, dispatch] = useReducer(
    UserInterfacePopUpsReducer,
    InitialContext.status
  );

  return (
    <UserInterfacePopUpsContext.Provider
      value={{
        status,
        dispatch,
      }}
    >
      {children}
    </UserInterfacePopUpsContext.Provider>
  );
};

export default UserInterfacePopUpsProvider;
