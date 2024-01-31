import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState([]);
    const valueObj = {
        userDetails,
        setUserDetails,
    };
    return(
        <GlobalContext.Provider value={valueObj}>{children}</GlobalContext.Provider>
    );
}