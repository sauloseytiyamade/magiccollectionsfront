import React, { useEffect, useState } from 'react';

export const AuthContext = React.createContext()

const useIsAuth = () => {
    const [logged, setLogged] = useState()
    const token = localStorage.getItem('token')
    useEffect(() => {
        
        if(token){
            setLogged(true)
        }else{
            setLogged(false)
        }
    }, [])

    return logged
}

export const AuthProvider = (props) => {
    const logged = useIsAuth()
    return(
        <AuthContext.Provider value={{isAuth: logged}} >
            {props.children}
        </AuthContext.Provider>
    )
}


