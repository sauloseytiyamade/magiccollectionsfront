import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import './index.css'
import ImgGui from '../../img/guilherme_souza.png'
import Collection from '../../components/Collection'

const UserCollection = (props) => {

    useEffect(() => {
        const body = document.querySelector('body')
        body.classList.remove('login')
    })

    return(
        <div>
            <div className="wrapper">
                <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                    <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
                    </li>
                    </ul>
                </nav>
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    <a href="#" className="brand-link">
                    <span className="brand-text font-weight-bold">MAGIC COLLECTIONS</span>
                    </a>
                    <div className="sidebar text-center mt-3">
                        <img src={ImgGui} className="img-circle mb-2" alt="Guilherme Souza" />
                        <div className="text-white ml-2 text-bold">
                            Guilherme Souza
                        </div>
                        <hr className="hrWhite" />
                        <nav>
                            <ul className="nav nav-pills nav-sidebar flex-column">
                                <li className="nav-item">
                                    <a href="./index2.html" className="nav-link">
                                        <i className="fas fa-tachometer-alt text-white mr-2"></i>
                                        <p className="text-white text-bold">Dashboard</p>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="./index2.html" className="nav-link">
                                        <i className="fab fa-wizards-of-the-coast text-white mr-2"></i>
                                        <p className="text-white text-bold">Minha Coleção</p>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </aside>
                <div className="content-wrapper p-2">
                    <Switch>
                        <Route path={`${props.match.path}/cards`} component={Collection} />
                    </Switch>
                </div>
                <footer className="main-footer">
                    <strong>Copyright &copy; 2020 - Magic Collections.</strong>
                    All rights reserved.
                </footer>
            </div>
        </div>
    )
}

export default UserCollection