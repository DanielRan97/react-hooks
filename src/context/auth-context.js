import React, { useState } from 'react';


export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
});

const AuthContextProvider = props => {

    const [isAuthState, setIsAuthState] = useState(false);

    let isAuth = isAuthState;

    const login = () => {
        setIsAuthState(true);
    };

    return (
        <AuthContext.Provider value={{login, isAuth}}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;