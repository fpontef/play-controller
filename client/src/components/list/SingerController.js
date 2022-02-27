import React, { Fragment } from 'react';

const SingerIsSinging = (singerId) => {
  return null
}

const SingerNextInQueue = (singerId) => {
  return (
    <button className='btn btn-primary small'>Cantar!</button>
  )}

const SingerNormal = (singerId) => {
  return (
    <Fragment>
      <button className='btn btn-secondary small'>Priorizar</button>
    </Fragment>

  )}

const SingerController = ({ 
  isSinging, 
  nextInQueue, 
  singerOrder, 
  singerId, 
  singerIndex = 1
}) => {

  if(isSinging) return <SingerIsSinging singerId={singerId} />;
  if(!isSinging && (nextInQueue || singerIndex === 0) ) return <SingerNextInQueue singerId={singerId} />;
  if(!isSinging && !nextInQueue) return <SingerNormal singerId={singerId} />;

}

export default SingerController;
