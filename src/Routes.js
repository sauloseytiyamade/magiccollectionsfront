import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UserCollection from './pages/UserCollection'

export default props => (
    <Router>
        <Switch>
            <Route path='/login' exact component={Login} />
            <Route path='/register' exact component={Register} />
            <Route path='/' component={UserCollection} />
            <Redirect from='*' to='/login' />
        </Switch>
    </Router>

)