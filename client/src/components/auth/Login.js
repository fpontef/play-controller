import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setLogin } from '../../actions/auth';

const Login = ({ setLogin, isAuthed }) => { 
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const { login, password } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    setLogin({ login, password });
  }

  // Redirect if logged in
  if(isAuthed) {
    return <Redirect to='/list' />
  }

  return (
    <div>
      <h1 className='large text-primary'>
        Conectar-se à conta
      </h1>
      <p className='lead'>
        <i className='fas fa-user'></i>
        Digite seus dados para o login
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)} >
        <div className='form-group'>
          <input 
            type='login' 
            placeholder='Login'
            name='login'
            value={login}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input 
            type='password'
            placeholder='Digite sua senha' 
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' value='Registrar' className='btn btn-primary' />
      </form>
    </div>
  );
}

Login.propTypes = {
  setLogin: PropTypes.func.isRequired,
  isAuthed: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthed: state.auth.isAuthed
});

export default connect(mapStateToProps, { setLogin })(Login);
