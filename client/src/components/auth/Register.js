import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { setRegister } from '../../actions/auth';

const Register = ({ setAlert, setRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    password: '',
    password2: '',
    isAdmin: false,
  });
  const { name, login, password, password2, isAdmin } = formData;
  const onChange = (e) => {
    const value = e.target.name === 'isAdmin' 
      ? e.target.checked 
      : e.target.value ;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if(password !== password2) {
      setAlert('A senha deve ser igual nos dois campos.', 'danger');
    } else {
      setRegister({ name, login, password, isAdmin });
    }
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>
        Registro de Conta
      </h1>
      <p className='lead'>
        <i className='fas fa-user'></i>
        Crie uma conta para seus usuários
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}> 
        <div className='form-group'>
          <input 
            type='text' 
            placeholder='Nome Completo' 
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input 
            type='text' 
            placeholder='Login' 
            name='login'
            value={login}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Digite uma senha'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input 
            type='password' 
            placeholder='Digite a senha novamente' 
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <legend className='form-text'>
            Marque se o usuário tem permissão de Administrador.
          </legend>
          <label>
            <input 
              type='checkbox'
              name='isAdmin'
              checked={isAdmin}
              onChange={(e) => onChange(e)}
            />
            <i className='m-05'>Administrador</i>
          </label>

        </div>
        <input type='submit' value='Registrar' className='btn btn-primary' />
      </form>  
    </Fragment>
  );
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  setRegister: PropTypes.func.isRequired
}

export default connect(null, { setAlert, setRegister })(Register);

