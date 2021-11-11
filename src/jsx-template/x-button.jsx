import React from 'react';
import Styled from 'styled-components';

export default ({size, click}) => {
  let _size = size || 16;
  return (
    <Button size={_size} onClick={click}>
      <span></span>
      <span></span>
    </Button>
  )
}

const Button = Styled.button`
  width: ${prop => prop.size}px;
  height: ${prop => prop.size}px;
  border: 1px solid #f00;
  background-color: orangered;
  border-radius: 50%;
  cursor: pointer;
  position: relative;

  & > span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 70%;
    height: 2px;
    background-color: #fdc7c7;
    &:first-of-type {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &:last-of-type {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

`;