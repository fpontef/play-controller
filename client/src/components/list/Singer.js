import React from 'react';
import SingerController from './SingerController';

const Singer = ({ 
  singerId,
  singerName, 
  singerOrder,
  musicName, 
  musicId, 
  isSinging,
  nextInQueue,
  singerIndex
}) => {

  return (
    <div className='player-content'>
      <div className='player-data'>
        { isSinging 
            ? <div className='fas fa-play'></div>
            : <div className='player-order'>{singerOrder}</div>
        }
        <div className='player-name'> {singerName} </div>
      </div>
      <div className='player-music'> {musicName} #{musicId} </div>
      <div className='player-controller'>
        <i className='fas fa-arrow-down player-button'></i>
        <i className='fas fa-times player-button'></i>

        <SingerController 
          isSinging={isSinging}
          nextInQueue={nextInQueue}
          singerOrder={singerOrder}
          singerId={singerId}
          singerIndex={singerIndex}
        />
      </div>
    </div>

  )
}

export default Singer;
