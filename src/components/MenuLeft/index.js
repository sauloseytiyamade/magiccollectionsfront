import React, { useEffect, useState, useContext } from 'react';
import ImgGui from '../../img/guilherme_souza.png'
import jwt from 'jsonwebtoken'
import {Link} from 'react-router-dom'
import {AuthContext} from '../../utils/auth'

const MenuLeft = () => {
    const [userName, setUserName] = useState('')
    const token = localStorage.getItem('token')
    const user = jwt.decode(token) || 0
    let {isAdmin} = useContext(AuthContext)

    useEffect(() => {
        if(Object.keys(user).length > 0){
            setUserName(user.name)
        }else{
            setUserName('User')
        }
    })
    
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
                    <span className="brand-text font-weight-bold">
                        MAGIC COLLECTIONS
                    </span>
                </a>
                <div className="sidebar text-center mt-3">
                    <img src={ImgGui} className="img-circle mb-2" alt="Guilherme Souza" />
                    <div className="text-white ml-2 text-bold">
                        {isAdmin &&
                            <i className="far fa-gem text-warning"></i> 
                        } {userName}
                    </div>
                    <hr className="hrWhite" />
                    <nav>
                        <ul className="nav nav-pills nav-sidebar flex-column">
                            <li className="nav-item">
                                <Link to='/usercollection/dashboard' className="nav-link">
                                    <i className="fas fa-tachometer-alt text-white mr-2"></i>
                                    <p className="text-white text-bold">Dashboard</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/usercollection/cards' className="nav-link">                                    
                                    <i className="fab fa-wizards-of-the-coast text-white mr-2"></i>
                                    <p className="text-white text-bold">Minha Coleção</p>
                                </Link>
                            </li>
                            {isAdmin &&
                                <li className="nav-item">
                                    <Link to='/usercollection/editioncards' className="nav-link">                                    
                                        <i className="fab fa-wizards-of-the-coast text-white mr-2"></i>
                                        <p className="text-white text-bold">Cadastro edição / cards</p>
                                    </Link>
                                </li>
                            }
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default MenuLeft

