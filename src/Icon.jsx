import React, { useContext, useMemo } from 'react';
import Styled from 'styled-components';
import documentIcon from './img/icon/document.png';
import folderIcon from './img/icon/folder.png';
import { Store } from './App';

const IconComponent = ({info}) => {
  const id = info.id;
  const type = info.type;
  const name = info.name;
  const parent = info.parent;
  const store = useContext(Store);

  const icon = useMemo(() => (
    info.type == 'folder' ? folderIcon : documentIcon
  ), [info]);

  const iconDbClick = (e) => {
    if (type == 'file') {
      store.setModalYN(true);
      return;
    }
    store.setBgYN(true);
    let items = store.iconList.filter(x => x.parent == id);
    store.setFinderInfo({yn: true, name: name, items: items});
  }

  return (
    <Icon icon={icon} data-parent={parent} name={name} onDoubleClick={iconDbClick}>
      <icon-img/>
      <icon-name/>
    </Icon>
  )
}

export default IconComponent;

const Icon = Styled.article`
  width: 110px;
  height: 120px;
  border: 1px solid #ffffff00;
  float: left;
  margin: 4px;
  padding: 4px;
  & > icon-img {
    display: block;
    color: #000;
    height: 80px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(${prop => prop.icon });
  }
  & > icon-name {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 80px);;
    &::before {
      content: '${prop => prop.name}';
      font-size: 22px;
      color: #343434;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }
  }
  &:hover {
    background-color: #ffffff10;
    border: 1px solid #ffffff30;
    & > icon-name::before {
      color: #000;
    }
  }
`;
