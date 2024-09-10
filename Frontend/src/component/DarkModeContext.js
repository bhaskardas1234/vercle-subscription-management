// import React, { createContext, useState, useContext } from 'react';

// const DarkModeContext = createContext();

// export const DarkModeProvider = ({ children }) => {
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     const toggleDarkMode = () => {
//         setIsDarkMode((prevMode) => !prevMode);
//     };

//     return (
//         <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
//             {children}
//         </DarkModeContext.Provider>
//     );
// };

// export const useDarkMode = () => useContext(DarkModeContext);


import React, { createContext, useState, useEffect, useContext } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Retrieve the theme preference from local storage if it exists, otherwise default to false (light mode)
        const storedTheme = localStorage.getItem('isDarkMode');
        return storedTheme ? JSON.parse(storedTheme) : false;
    });

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            // Save the new theme preference in local storage
            localStorage.setItem('isDarkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    useEffect(() => {
        // Set the theme based on the stored value on initial render
        const storedTheme = localStorage.getItem('isDarkMode');
        if (storedTheme !== null) {
            setIsDarkMode(JSON.parse(storedTheme));
        }
    }, []);

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);