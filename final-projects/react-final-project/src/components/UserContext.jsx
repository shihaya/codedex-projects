import React, { createContext, useState } from "react";

// the UserContext
export const UserContext = createContext(undefined);

// the UserProvider component
export function UserProvider({ children }) {
    const [name, setName] = useState("Anonymous");

    return <UserContext.Provider value={{ name, setName }}>{children}</UserContext.Provider>;
}