import React, { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import './index.css'
import Cards from '../../components/Cards'
import AddCards from '../../components/AddCards'
import EditCards from '../../components/EditCards'
import MenuLeft from '../../components/MenuLeft'
import CardView from '../../components/CardView'
import Dashboard from '../../components/Dashboard'

const UserCollection = (props) => {

    useEffect(() => {
        const body = document.querySelector('body')
        body.classList.remove('login')
    })

    return(
        <div>
            <div className="wrapper">
                <MenuLeft />
                <div className="content-wrapper p-2">
                    <Switch>
                        <Route path={`${props.match.path}/cards`} component={Cards} />
                        <Route path={`${props.match.path}/addcard`} exact component={AddCards} />
                        <Route path={`${props.match.path}/dashboard`} exact component={Dashboard} />
                        <Route path={`${props.match.path}/editcard/:id`} exact component={EditCards} />
                        <Route path={`${props.match.path}/cardview/:id`} exact component={CardView} />
                        <Redirect from={`${props.match.path}*`} to={`${props.match.path}/cards`} />
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