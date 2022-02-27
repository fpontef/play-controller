import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setLogout } from '../../actions/auth';

const Navbar = ({ 
  setLogout, 
  auth: { isAuthed, isLoading, user: { isAdmin } }, 
}) => {
  const authLinks = (
    <Fragment>
      <Link className='nav-item' to='/list'>Lista</Link>
      { isAdmin && <Link className='nav-item' to='/register'>Registro</Link> }
      <a 
        onClick={setLogout} 
        className='nav-item' 
        href='#!'
      >Logout</a>
    </Fragment>
  );
  const guestLinks = (
    <Fragment>
      <Link className='nav-item' to='/login'>Login</Link>
    </Fragment>
  );

  return (
    <nav className='navbar bg-white'>
      <Link className='nav-item bolder' to='/'>
        <i className='fas fa-music'> </i>
        <span> </span>
        <span className='hide-sm'>PlayController</span>
      </Link>
      { 
        !isLoading && 
        (<Fragment> { isAuthed ? authLinks : guestLinks } </Fragment>) 
      }
    </nav>
  )
}

Navbar.propTypes = {
  setLogout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { setLogout })(Navbar);
