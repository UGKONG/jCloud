import React from 'react';
import Styled from 'styled-components';

const BgDiv = ({yn}) => {
  return yn ? <Div  /> : <></>;
}

export default BgDiv;

const Div = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000010;
`;