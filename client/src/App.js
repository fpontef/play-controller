import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import List from './components/list/List';
import SingerRegister from './components/list/SingerRegister';
import PrivateRoute from './components/routing/PrivateRoute';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = ({ loadUser }) => {
  useEffect( () => {
    loadUser();
  }, [loadUser]);

  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/login' component={Login} />
            {/* <PrivateRoute exact needAdmin={true} path='/register'> */}
            <Route exact needAdmin={false} path='/register'>
              <Register />
            </Route>
            <PrivateRoute exact path='/list' >
              <List />
            </PrivateRoute>
            <PrivateRoute exact path='/singer-add' >
              <SingerRegister />
            </PrivateRoute>
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
}

export default connect(null, {  loadUser })(App);
