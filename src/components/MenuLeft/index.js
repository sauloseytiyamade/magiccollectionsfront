import React, { useEffect, useState, useContext } from 'react';
import ImgDefault from '../../img/imgDefault.png'
import jwt from 'jsonwebtoken'
import {Link, Redirect, useHistory} from 'react-router-dom'
import {AuthContext} from '../../utils/auth'
import { toast, ToastContainer } from 'react-toastify'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
import {messages} from '../../utils/messages'
import axios from 'axios';
import _ from 'lodash'

const MenuLeft = () => {
    const history = useHistory()
    const [userName, setUserName] = useState('User')
    const [photo, setPhoto] = useState('')
    const token = localStorage.getItem('token')
    const user = jwt.decode(token) || 0
    let {isAdmin} = useContext(AuthContext)
    let {isAuth} = useContext(AuthContext)

    const configAxios = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        axios.get(`${BASE_URL_BACK}/users`,configAxios)
        .then(resp => {
            const userFilter = _.filter(resp.data, {'id': user.id})
            const userNameFilter = userFilter[0].name
            const photoFilter = userFilter[0].photo
            setPhoto(photoFilter)
            setUserName(userNameFilter)
            
        })
        .catch(err => {
            //Caso dê algum erro é enviada uma mensagem para o usuário
            toast.info(messages(err.response.data.message))
        })
    },[userName])

    if(isAuth == false){
        return (
            <Redirect to='/login' />
        )
    }else{
        
    }
    
    if(isAuth == false){
        return null
    }

    const sair = () => {
        localStorage.removeItem('token')
        toast.info('Tchauzinho Planeswalker!!!')
        setTimeout(() => {
            window.location.href = `${BASE_URL_LOGIN}`
        }, 5000);
    }
    
    return(
        <>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                </li>
                </ul>
            </nav>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <a href="#" className="brand-link">
                    <span className="brand-text font-weight-bold ml-2">
                        MAGIC COLLECTIONS
                    </span>
                </a>
                <div className="sidebar text-center mt-3">
                    <img src={photo || ImgDefault} className="img-circle mb-2" alt="Guilherme Souza" />
                    <div className="text-white ml-2 text-bold">
                        {isAdmin &&
                            <i className="far fa-gem text-warning"></i> 
                        } {userName}
                    </div>
                    <hr className="hrWhite" />
                    <nav>
                        <ul className="nav nav-pills nav-sidebar flex-column">
                            <li className="nav-item">
                                <Link to='/dashboard' className="nav-link">
                                    <i className="fas fa-tachometer-alt text-white mr-2"></i>
                                    <p className="text-white text-bold">Dashboard</p>
                                </Link>
                            </li>
                            {isAdmin &&
                                <li className="nav-item">
                                    <Link to='/dashboardadmin' className="nav-link">                                    
                                        <i className="fas fa-tachometer-alt text-white mr-2"></i>
                                        <p className="text-white text-bold">Dashboard Admin</p>
                                    </Link>
                                </li>
                            }
                            <li className="nav-item">
                                <Link to='/cards' className="nav-link">                                    
                                    <i className="fab fa-wizards-of-the-coast text-white mr-2"></i>
                                    <p className="text-white text-bold">Minha Coleção</p>
                                </Link>
                            </li>
                            {isAdmin &&
                                <li className="nav-item">
                                    <Link to='/editioncards' className="nav-link">                                    
                                        <i className="fab fa-wizards-of-the-coast text-white mr-2"></i>
                                        <p className="text-white text-bold">Cadastro edição / cards</p>
                                    </Link>
                                </li>
                            }
                            {isAdmin &&
                                <li className="nav-item">
                                    <Link to='/users' className="nav-link">                                    
                                        <i className="fas fa-users text-white mr-2"></i>
                                        <p className="text-white text-bold">Administrar Usuários</p>
                                    </Link>
                                </li>
                            }
                            <li className="nav-item">
                                <Link to='/configuser' className="nav-link">                                    
                                    <i className="fas fa-user text-white mr-2"></i>
                                    <p className="text-white text-bold">Configuração do usuário</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" onClick={sair} className="nav-link">                                    
                                    <i className="fas fa-sign-out-alt text-white mr-2"></i>
                                    <p className="text-white text-bold">sair</p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <ToastContainer />
            </aside>
        </>
    )
}

export default MenuLeft

