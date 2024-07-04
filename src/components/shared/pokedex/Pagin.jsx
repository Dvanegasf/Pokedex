import React from 'react';
import './styles/pagin.css';

const Pages = ({paginate, setPaginate, total}) => {

  const handleLess = (num) => {
    if (paginate > num) {
      setPaginate(paginate - num);
    } else {
      setPaginate(total);
    }
  }

  const handlePlus = (num) => {
    if (paginate <= total - num) {
      setPaginate(paginate + num);
    } else {
      setPaginate(1);
    }
  }

  const handleFirst = () => {
    setPaginate(1);
  }

  const handleLast = () => {
    setPaginate(total);
  }

  return (
    <div className='pages'>
      <button className='page' onClick={handleFirst}>{'First'}</button>
      <button className={`page page${paginate > 50 ? paginate - 50 : total}`} onClick={() => {handleLess(50)}}>{paginate > 50 ? paginate - 50 : total}</button>
      <button className={`page page${paginate > 20 ? paginate - 20 : total}`} onClick={() => {handleLess(20)}}>{paginate > 20 ? paginate - 20 : total}</button>
      <button className={`page page${paginate > 10 ? paginate - 10 : total}`} onClick={() => {handleLess(10)}}>{paginate > 10 ? paginate - 10 : total}</button>
      <button className={`page page${paginate > 1 ? paginate - 1 : total}`} onClick={() => {handleLess(1)}}>{paginate > 1 ? paginate - 1 : total}</button>
      <span>{paginate} / {total}</span>
      <button className={`page page${paginate < total ? paginate + 1 : 1}`} onClick={() => {handlePlus(1)}}>{paginate < total ? paginate + 1 : 1}</button>
      <button className={`page page${paginate <= total - 10 ? paginate + 10 : 1}`} onClick={() => {handlePlus(10)}}>{paginate <= total - 10 ? paginate + 10 : 1}</button>
      <button className={`page page${paginate <= total - 20 ? paginate + 20 : 1}`} onClick={() => {handlePlus(20)}}>{paginate <= total - 20 ? paginate + 20 : 1}</button>
      <button className={`page page${paginate <= total - 50 ? paginate + 50 : 1}`} onClick={() => {handlePlus(50)}}>{paginate <= total - 50 ? paginate + 50 : 1}</button>
      <button className='page' onClick={handleLast}>{'Last'}</button>
    </div>
  )
}

export default Pages;
