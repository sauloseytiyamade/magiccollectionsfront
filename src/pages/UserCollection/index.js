import React, { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import './index.css'
import Cards from '../../components/Cards'
import AddCardsCollection from '../../components/AddCardsCollection'
import EditCardsCollection from '../../components/EditCardsCollection'
import MenuLeft from '../../components/MenuLeft'
import CardView from '../../components/CardView'
import Dashboard from '../../components/Dashboard'
import EditionCards from '../../components/EditionCards'
import EditEditionCards from '../../components/EditEditionCards'
import AddEditionCards from '../../components/AddEditionCards'
import DashboardAdmin from '../../components/DashboardAdmin'
import Users from '../../components/Users'
import EditUser from '../../components/EditUser'
import ConfigUser from '../../components/ConfigUser'

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
                        <Route path={`/cards`} component={Cards} />
                        <Route path={`/addcard`} exact component={AddCardsCollection} />
                        <Route path={`/dashboard`} exact component={Dashboard} />
                        <Route path={`/dashboardadmin`} component={DashboardAdmin} />
                        <Route path={`/editcard/:id`} exact component={EditCardsCollection} />
                        <Route path={`/cardview/:id`} exact component={CardView} />
                        <Route path={`/editioncards`} exact component={EditionCards} />
                        <Route path={`/addeditioncards`} exact component={AddEditionCards} />
                        <Route path={`/editioncards/:id`} component={EditEditionCards} />
                        <Route path={`/users`} component={Users} />
                        <Route path={`/edituser/:id`} component={EditUser} />
                        <Route path={`/configuser`} component={ConfigUser} />
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