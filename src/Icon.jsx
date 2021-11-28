import React, { useState, useEffect, useContext, useMemo } from 'react';
import Styled from 'styled-components';
import documentIcon from './img/icon/document.png';
import folderIcon from './img/icon/folder.png';
import { Store } from './App';
import axios from 'axios';

const IconComponent = ({info, po}) => {
  const store = useContext(Store);
  const [active, setActive] = useState(false);

  const id = info.id;
  const type = info.type;
  const name = info.name;
  const parent = info.parent;
  const fileName = info.fileName;

  const icon = useMemo(() => (
    info.type == 'folder' ? folderIcon : documentIcon
  ), [info]);

  const iconClick = (e) => {
    let target = e.currentTarget;
    
    if (!active) {
      store.setSelectIconList(prev => {
        let temp = [...prev];
        temp.push(target.getAttribute('data-id'));
        return temp;
      });
    } else {
      store.setSelectIconList(prev => {
        let temp = [...prev];
        let filted = temp.filter(x => x != target.getAttribute('data-id'));
        return filted;
      });
    }

    setActive(prev => !prev);


  }

  const iconDbClick = (e) => {
    store.setParentSeq(parent);
    if (type == 'file') {
      store.setModalYN(true);
      let a = document.createElement('a');
          a.href = '/files/' + fileName.split('|')[0];
          a.target = 'new';
          a.download = name;
          a.click();
          a.remove();
      return;
    }
    store.setBgYN(true);
    store.setSelectIconList([]);
    let iconList = store.iconList;
    let items = iconList.filter(x => x?.parent == id);
    store.setFinderInfo({yn: true, id: id, name: name, items: items});
    finderReload();
  }

  // 탐색기 새로고침
  const finderReload = () => {
    let setFinderInfo = store.setFinderInfo;
    store.setFileChange((prev) => !prev);
    setFinderInfo((prev) => {
      let tempObj = {}
      tempObj.yn = prev.yn;
      tempObj.id = prev.id;
      tempObj.name = prev.name;
      tempObj.items = store.iconList.filter(x => x.parent == id);
      return tempObj
    });
  }

  const renameEnd = () => {
    if (document.querySelector('#renameIconInput').value == '') {
      store.setEditIcon({mode: false, id: '', name: ''});  
      return;
    }

    axios.patch(store.dbURL + '/icon-list/' + store.editIcon.id + '.json', {
      name: document.querySelector('#renameIconInput').value
    }).then(() => {
      let setFinderInfo = store.setFinderInfo;
      store.setFileChange((prev) => !prev);
      setFinderInfo((prev) => {
        let tempObj = {}
        tempObj.yn = prev.yn;
        tempObj.id = prev.id;
        tempObj.name = prev.name;

        let editObj = prev.items.find(x => x.pathName == store.editIcon.id);
        let otherList = prev.items.filter(x => x.pathName != store.editIcon.id);
        editObj.name = document.querySelector('#renameIconInput').value;
        
        store.setEditIcon({mode: false, id: '', name: ''});

        otherList.push(editObj);
        tempObj.items = otherList;
        return tempObj;
      });
    });

  }

  const editInputKeydown = (e) => {
    if (e.keyCode == 13) renameEnd();
  }

  useEffect(() => {
    if (!info.progress) {
      setProgress(<></>);
    }
    if (info.progress == 100) {
      setTimeout(() => {
        setProgress(<></>);
      }, 1000)
    }
  }, [progress, setProgress, info.progress]);

  const [progress, setProgress] = useState(
    <icon-progress>
      <div />
    </icon-progress>
  );

  return (
    <Icon 
      fileIcon
      draggable 
      className={active ? 'activeIcon' : ''}
      po={po} 
      icon={icon} 
      name={name}
      data-id={info.pathName}
      progress={info.progress}
      data-parent={parent} 
      onClick={iconClick}
      onDoubleClick={iconDbClick}
    >
      <icon-img/>
      {store.editIcon.mode && store.editIcon.id == info.pathName ? (
        <input id="renameIconInput" defaultValue={store.editIcon.name} onBlur={renameEnd} onKeyDown={editInputKeydown} />
      ) : (
        <icon-name/>
      )}
      {progress}
    </Icon>
  )
}

export default IconComponent;

const Icon = Styled.article`
  width: 110px;
  height: 110px;
  border: 1px solid #ffffff00;
  float: left;
  margin: 4px;
  padding: 4px;
  position: relative;
  
  &:hover {
    background-color: ${(props) => props.po == 'bg' ? '#ffffff10' : '#00000010'};
    border: ${(props) => props.po == 'bg' ? '1px solid #ffffff30' : '1px solid #00000020'};
  }

  &.activeIcon {
    background-color: ${(props) => props.po == 'bg' ? '#ffffff30' : '#00000010'};
    border: ${(props) => props.po == 'bg' ? '1px solid #ffffff30' : '1px solid #00000030'};
  }

  & > icon-img {
    display: block;
    margin: 0 auto;
    color: #000;
    width: 80%;
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
      font-size: 13px;
      font-weight: ${(props) => props.po == 'bg' ? 300 : 400};
      letter-spacing: 1px;
      color: ${(props) => props.po == 'bg' ? '#fff' : '#343434'};
      text-shadow: ${(props) => props.po == 'bg' ? '0 0 2px #000' : 'unset'};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: 'Noto Sans KR', sans-serif;
    }
  }
  & > icon-progress {
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 5px;
    border-radius: 10px;
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;

    div {
      width: ${(props) => props.progress || 0}%;
      height: 100%;
      background: #46b955;
      transition-duration: .3s;
      transition-delay: .3s;
    }
  }

  & > input {
    text-align: center;
    font-size: 13px;
    font-family: 'Noto Sans KR', sans-serif;
    display: block;
    width: 100px;
    margin: 0 auto;
    border: 1px solid #ccc;
    outline: none;
  }
`;
