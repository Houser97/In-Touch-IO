import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";

interface UtilsContextProps {
    isDarkTheme: boolean;
    isSearchOpen: boolean;
    setIsDarkTheme: Dispatch<SetStateAction<boolean>>;
    setIsSearchOpen: Dispatch<SetStateAction<boolean>>;
}

export const UtilsContext = createContext<UtilsContextProps>({
    isDarkTheme: true,
    isSearchOpen: false,
    setIsDarkTheme: () => { throw new Error('setIsDarkTheme not implemented') },
    setIsSearchOpen: () => { throw new Error('setIsSearchOpen not implemented') },
});

export const UtilsProvider = ({ children }: PropsWithChildren) => {

    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <UtilsContext.Provider value={{
            isDarkTheme,
            isSearchOpen,
            setIsDarkTheme,
            setIsSearchOpen
        }}>
            {children}
        </UtilsContext.Provider>
    )
}