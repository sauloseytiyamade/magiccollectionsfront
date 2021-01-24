import { JsonWebTokenError } from 'jsonwebtoken';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'

export const AuthContext = React.createContext()

const UseIsAuth = () => {
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

const IsAdmin = () => {
    const [isAdmin, setIsAdmin] = useState()
    const token = localStorage.getItem('token')
    const decodedToken = jwt.decode(token)
    const {permission} = decodedToken || 1
    useEffect(() => {
        if(permission == 1){
            setIsAdmin(false)
        }else{
            setIsAdmin(true)
        }
    })

    return isAdmin
}

export const AuthProvider = (props) => {
    const logged = UseIsAuth()
    const isAdmin = IsAdmin()
    return(
        <AuthContext.Provider value={{isAuth: logged, isAdmin: isAdmin}} >
            {props.children}
        </AuthContext.Provider>
    )
}


