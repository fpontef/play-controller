import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
//import { setRegister } from '../../actions/singer';

const SingerRegister = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    music_name: '',
    music_id: ''
  });
  const { name, music_name, music_id } = formData;
  const onChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    //setRegister({ name, music_name, music_id });
    console.log('CADASTRADO', formData);
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>
        Cadastro do Artista
      </h1>
      <p className='lead'>
        <i className='fas fa-user'></i>
        Informe os dados:
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
            placeholder='Nome do Artista e Música' 
            name='music_name'
            value={music_name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input 
            type='text' 
            placeholder='Código da Música' 
            name='music_id'
            value={music_id}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' value='Cadastrar' className='btn btn-primary' />
      </form>  
    </Fragment>
  );
}

SingerRegister.propTypes = {
  setAlert: PropTypes.func.isRequired,
  //setRegister: PropTypes.func.isRequired
}

export default connect(null, { 
setAlert, 
//setRegister 
})(SingerRegister);

