import React from 'react';
import './styles/pokeFooter.css';

const PokeFooter = () => {
  return (
    <div className='pokefooter'>
        <div className='pokefooter__red'>
        </div>
        <div className='pokefooter__black'>
          <div className='pokefooter__outcircle'>
            <div className='pokefooter__incircle'></div>
            <div className='pokefooter__inincircle'></div>
          </div>
        </div>
    </div>  )
}

export default PokeFooter;