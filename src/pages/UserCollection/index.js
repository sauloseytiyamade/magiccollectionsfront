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
                        <Route path={`${props.match.path}/addcard`} exact component={AddCardsCollection} />
                        <Route path={`${props.match.path}/dashboard`} exact component={Dashboard} />
                        <Route path={`${props.match.path}/editcard/:id`} exact component={EditCardsCollection} />
                        <Route path={`${props.match.path}/cardview/:id`} exact component={CardView} />
                        <Route path={`${props.match.path}/editioncards`} exact component={EditionCards} />
                        <Route path={`${props.match.path}/addeditioncards`} exact component={AddEditionCards} />
                        <Route path={`${props.match.path}/editioncards/:id`} component={EditEditionCards} />
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