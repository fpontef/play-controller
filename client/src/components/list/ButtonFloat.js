import React from 'react';
import { Link } from 'react-router-dom';

//<a href="player-add.html" class="btn btn-float"><i class="fa fa-plus btn-my-float"></i></a>

const ButtonFloat = () => {
  return (
    <Link 
      to="/singer-add" 
      className="btn btn-float">
      <i className="fa fa-plus btn-my-float"></i>
    </Link>
  )
}

export default ButtonFloat;
