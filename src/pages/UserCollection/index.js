import React, { useEffect, useContext } from 'react'
import { Switch, Route, Redirect} from 'react-router-dom'
import './index.css'
import {AuthContext} from '../../utils/auth'
import {BASE_URL_BACK, BASE_URL_LOGIN} from '../../utils/variaveisAmbiente'
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
import ColorsCard from '../../components/ColorsCard'
import AddColorsCard from '../../components/AddColorsCard'
import EditColorsCard from '../../components/EditColorsCard'
import LanguageCard from '../../components/LanguageCard'
import AddLanguagesCard from '../../components/AddLanguagesCard'
import EditLanguagesCard from '../../components/EditLanguagesCard'


const UserCollection = (props) => {

    let {isAuth} = useContext(AuthContext)

    useEffect(() => {
        const body = document.querySelector('body')
        body.classList.remove('login')
    })

    if(isAuth == false){
        window.location.href = `${BASE_URL_LOGIN}`        
    }

    if(isAuth == false){
        return null
    }

    return(
        <div>
            <div className="wrapper">
                <MenuLeft />
                <div className="content-wrapper p-2">
                    <Switch>
                        <Route path={`/cards`} component={Cards} />
                        <Route path={`/addcard`} exact component={AddCardsCollection} />
                        <Route path={`/editcard/:id`} exact component={EditCardsCollection} />
                        <Route path={`/dashboard`} exact component={Dashboard} />
                        <Route path={`/dashboardadmin`} component={DashboardAdmin} />
                        <Route path={`/cardview/:id`} exact component={CardView} />
                        <Route path={`/editioncards`} exact component={EditionCards} />
                        <Route path={`/addeditioncards`} exact component={AddEditionCards} />
                        <Route path={`/editioncards/:id`} component={EditEditionCards} />
                        <Route path={`/colors`} component={ColorsCard} />
                        <Route path={`/addcolorscard`} component={AddColorsCard} />
                        <Route path={`/editcolorscard/:id`} component={EditColorsCard} />
                        <Route path={`/languages`} component={LanguageCard} />
                        <Route path={`/addlanguagescard`} component={AddLanguagesCard} />
                        <Route path={`/editlanguagescard/:id`} component={EditLanguagesCard} />
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