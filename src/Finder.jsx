import React, { useContext, useState } from 'react';
import Styled from 'styled-components';
import { Store } from './App';
import folderIcon from './img/icon/folder.png';
import Xbutton from './jsx-template/x-button';
import IconComponent from './Icon';
const FinderComponent = ({name, items}) => {
  const store = useContext(Store);
  
  const xBtnClick = () => {
    let setFinderInfo = store.setFinderInfo;
    store.setBgYN(false);
    setFinderInfo({yn: false, name: '', items: []});
  }

  return (
    <Finder>
      <Wrap>
        <Header>
          <FinderTitle icon={folderIcon}>
            <folder-info>
              <folder-icon />
              <folder-name>{store.finderInfo.name}</folder-name>
            </folder-info>
            <folder-button>
              <Xbutton click={xBtnClick} />
            </folder-button>
          </FinderTitle>
        </Header>
        <Contents>
          {items.map((item, i) => <IconComponent key={i} info={item} />)}
        </Contents>
        <Footer>

        </Footer>
      </Wrap>
    </Finder>
  )
}

export default FinderComponent;

const style = {
  headerH: 100,
  footerH: 50,
};

const Finder = Styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 5;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 1px 1px 5px #00000070;
`;
const Wrap = Styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const Header = Styled.header`
  height: ${style.headerH}px;
  border-bottom: 1px solid #aaaaaa50;
`;
const FinderTitle = Styled.div`
  height: 40px;
  border-bottom: 1px solid #aaaaaa50;
  background: #aaaaaa20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  * {display: block}
  folder-info {
    height: 100%;
    display: flex;
    align-items: center;
  }
  folder-icon {
    width: 26px;
    height: 26px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${prop => prop.icon});
    
  }
  folder-name {
    height: 100%;
    padding: 0 10px;
    font-size: 26px;
    letter-spacing: 1px;
  }
  folder-button {
    
  }
`;

const Contents = Styled.section`
  height: calc(100% - ${style.headerH + style.footerH}px);
  overflow: auto;
`;
const Footer = Styled.footer`
  height: ${style.footerH}px;
  border-top: 1px solid #aaaaaa40;
`;