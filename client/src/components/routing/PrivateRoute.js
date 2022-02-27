import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Instead of { component: Component }, the react-router-dom v5.x asks to use the
// { children }, instead of component or render.

const PrivateRoute = ({ 
  children,
  auth: { isAuthed, isLoading, user: { isAdmin }},
  needAdmin = false,
  ...rest 
}) => {
  return ( 
    <Route 
      { ...rest } 
      render={ (props) => {
        if(needAdmin && !isAdmin) {
          return <div className='large'>Autorizado somente Administrador.</div>
        }
        if(!isAuthed && !isLoading) {
          return <Redirect to='/login' />
        }
        return children
        // Original:
        // <Component {...props} />
        // poderia ser? Não sei.  <children {...props} />
      }} 
    />
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
