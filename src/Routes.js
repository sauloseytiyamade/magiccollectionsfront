import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

export default props => (
    <Router>
        <Switch>
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Redirect from='*' to='/login' />
        </Switch>
    </Router>

)