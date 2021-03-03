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
import QualitiesCard from '../../components/QualitiesCard'
import AddQualityCard from '../../components/AddQualityCard'
import EditQualitiesCard from '../../components/EditQualitiesCard'
import RaritiesCard from '../../components/RaritiesCard'
import AddRarityCard from '../../components/AddRarityCard'
import EditRaritiesCard from '../../components/EditRaritiesCard'
import TypesCard from '../../components/TypesCard'
import AddTypesCard from '../../components/AddTypesCard'
import EditTypesCard from '../../components/EditTypesCard'
import EditionsCard from '../../components/EditionsCards'
import EditEditionsCards from '../../components/EditEditionsCards'
import LogView from '../../components/LogView'


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
                        <Route path={`/usercollection/cards`} component={Cards} />
                        <Route path={`/usercollection/addcard`} exact component={AddCardsCollection} />
                        <Route path={`/usercollection/editcard/:id`} exact component={EditCardsCollection} />
                        <Route path={`/usercollection/dashboard`} exact component={Dashboard} />
                        <Route path={`/usercollection/dashboardadmin`} component={DashboardAdmin} />
                        <Route path={`/usercollection/cardview/:id`} exact component={CardView} />
                        <Route path={`/usercollection/editioncards`} exact component={EditionCards} />
                        <Route path={`/usercollection/addeditioncards/:id`} exact component={AddEditionCards} />
                        <Route path={`/usercollection/editioncards/:id`} component={EditEditionCards} />
                        <Route path={`/usercollection/editions`} component={EditionsCard} />
                        <Route path={`/usercollection/editeditionscards/:id`} component={EditEditionsCards} />
                        <Route path={`/usercollection/colors`} component={ColorsCard} />
                        <Route path={`/usercollection/addcolorscard`} component={AddColorsCard} />
                        <Route path={`/usercollection/editcolorscard/:id`} component={EditColorsCard} />
                        <Route path={`/usercollection/languages`} component={LanguageCard} />
                        <Route path={`/usercollection/addlanguagescard`} component={AddLanguagesCard} />
                        <Route path={`/usercollection/editlanguagescard/:id`} component={EditLanguagesCard} />
                        <Route path={`/usercollection/qualities`} component={QualitiesCard} />
                        <Route path={`/usercollection/addqualitiescard`} component={AddQualityCard} />
                        <Route path={`/usercollection/editqualitiescard/:id`} component={EditQualitiesCard} />
                        <Route path={`/usercollection/rarities`} component={RaritiesCard} />
                        <Route path={`/usercollection/addraritiescard`} component={AddRarityCard} />
                        <Route path={`/usercollection/editraritiescard/:id`} component={EditRaritiesCard} />
                        <Route path={`/usercollection/types`} component={TypesCard} />
                        <Route path={`/usercollection/addtypescard`} component={AddTypesCard} />
                        <Route path={`/usercollection/edittypescard/:id`} component={EditTypesCard} />
                        <Route path={`/usercollection/users`} component={Users} />
                        <Route path={`/usercollection/edituser/:id`} component={EditUser} />
                        <Route path={`/usercollection/configuser`} component={ConfigUser} />
                        <Route path={`/usercollection/logview/:id`} component={LogView} />
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