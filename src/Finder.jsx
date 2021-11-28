import React, { useContext, useEffect, useState, useRef } from 'react';
import Styled from 'styled-components';
import { Store } from './App';
import folderIcon from './img/icon/folder.png';
import Xbutton from './jsx-template/x-button';
import IconComponent from './Icon';
import Fontawesome from './Fontawesome';
import axios from 'axios';
import { useMaxArr } from './hook';

const FinderComponent = ({id, name, items}) => {
  const store = useContext(Store);
  const finderContents = useRef(null);
  const [backDisabled, setBackDisabled] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  
  useEffect(() => {
    let iconList = store.iconList;
    let thisObj = iconList.find(x => x.id == id);
    setBackDisabled(thisObj.parent == 0 ? true : false);
  }, [store.iconList, id]);

  // x 버튼 클릭
  const xBtnClick = () => {
    let setFinderInfo = store.setFinderInfo;
    store.setBgYN(false);
    setFinderInfo({yn: false, id: '', name: '', items: []});
    finderReload();
  }

  // 뒤로가기 버튼 클릭
  const backClick = () => {
    let setFinderInfo = store.setFinderInfo;
    let thisObj = store.iconList.find(x => x.id == id);
    let parentObj = store.iconList.find(x => x.id == thisObj.parent);
    let items = store.iconList.filter(x => x.parent == parentObj.id);
    setFinderInfo({yn: true, id: parentObj.id, name: parentObj.name, items: items});
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

  // 파일 업로드
  const fileUpload = (e) => {
    let input = e.target;
    let files = input.files;
    if (files.len == 0) return;
    let idNumber = useMaxArr(store.iconList, 'id').id;

    for (let file of files) {
      idNumber += 1;
      let date = new Date();
          date = String(date.getFullYear()) + 
                 String(date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()) +
                 String(date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
                 String(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
                 String(date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
                 String(date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      let data = {
        fileName: date + '|' + file.name,
        icon: 'document.png',
        name: file.name,
        parent: id,
        type: 'file',
        id: idNumber
      }
      let formData = new FormData();
          formData.append('uploadFile', file);
          formData.append('uploadFileName', date);

      axios.post('/upload', formData, {
        header: {'Content-Type': 'multipart/form-data'},
      }).then(response => {
        let saveFileName = response.data;
        data.fileName = saveFileName;

        axios.post(store.dbURL + '/icon-list.json', data, {
          onUploadProgress: (progress) => {
            data.progress = (progress.loaded / progress.total) * 100
          }
        }).then(response => {
          data.pathName = response.data.name;
          
          if (response.statusText == 'OK') {
            let setFinderInfo = store.setFinderInfo;
            setFinderInfo((prev) => {
              let tempObj = {};
              tempObj.yn = prev.yn;
              tempObj.id = prev.id;
              tempObj.name = prev.name;
              tempObj.items = prev.items;
              tempObj.items.push(data);
              return tempObj;
            });
          }
        });
      })
    }
  }

  // 파일명 변경
  const fileRename = () => {
    let selectIconList = store.selectIconList;
    let find = store.iconList.find(x => x.pathName == selectIconList[0]);
    store.setEditIcon((prev) => {
      let data = {...prev};
      data.mode = true;
      data.id = find.pathName;
      data.name = find.name;

      setTimeout(() => document.querySelector('#renameIconInput').focus(), 0);
      return data;
    });
  }

  // 선택 파일 삭제
  const fileRemove = () => {
    let selectIconList = store.selectIconList;
    selectIconList.forEach(selectIcon => {
      axios.delete(store.dbURL + '/icon-list/' + selectIcon + '.json').then((response) => {
        if (response.statusText == 'OK') {
          let setFinderInfo = store.setFinderInfo;
          setFinderInfo((prev) => {
            let tempObj = {};
            tempObj.yn = prev.yn;
            tempObj.id = prev.id;
            tempObj.name = prev.name;
            tempObj.items = prev.items;
            tempObj.items = tempObj.items.filter(x => x.pathName != selectIcon);
            return tempObj;
          });
        }
      });
    });

    store.setSelectIconList([]);

    setTimeout(() => {
      const fileIconList = document.querySelectorAll('article.activeIcon');
      fileIconList.forEach(fileIcon => fileIcon.classList.remove('activeIcon'));
    }, 1000);
  }
  
  // 새폴더 추가
  const addFolder = () => {
    axios.post(store.dbURL + '/icon-list.json', {
      fileName: 'none',
      icon: 'folder.png',
      id: useMaxArr(store.iconList, 'id').id + 1,
      name: '새폴더',
      parent: store.finderInfo.id,
      type: 'folder'
    }).then((response) => {
      if (response.statusText == 'OK') {
        store.getIconList();
        setTimeout(() => document.querySelector('button.reload').click(), 500);
      }
      
      document.querySelector('button.addFolder').disabled = true;
      setTimeout(() => {
        document.querySelector('button.addFolder').disabled = false;
      }, 2000);
    });
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
          <HeaderOption backDisabled={backDisabled}>
            <button className="back" disabled={backDisabled} onClick={backClick} title="뒤로가기">
              <i className={Fontawesome.back} />
            </button>
            <button className="reload" title="새로고침" onClick={finderReload}>
              <i className={Fontawesome.reload} />
            </button>
            <button className="addFolder" title="새폴더" onClick={addFolder}>
              <i className={Fontawesome.folder} />
            </button>
            <button className="upload" title="파일 업로드">
              <label htmlFor="finderUploadBtn">
                <i className={Fontawesome.cloudUpload} />
              </label>
            </button>
            <input type="file" id="finderUploadBtn" multiple hidden onChange={fileUpload} />
            {store.selectIconList.length > 0 ? (
              <button className="edit" title="파일명 변경" onClick={fileRename}>
                <i className={Fontawesome.edit} />
              </button>
            ) : (
              <></>
            )}
            {store.selectIconList.length > 0 ? (
              <button className="remove" title="선택파일 삭제" onClick={fileRemove}>
                <i className={Fontawesome.trash} />
              </button>
            ) : (
              <></>
            )}
          </HeaderOption>
        </Header>
        <Contents ref={finderContents}>
          {items.map((item, i) => <IconComponent po={'finder'} key={i} info={item} />)}
        </Contents>
        <Footer>

        </Footer>
      </Wrap>
    </Finder>
  )
}

export default FinderComponent;

const style = {
  headerH: 80,
  footerH: 50,
};

const Finder = Styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
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
const HeaderOption = Styled.div`
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  align-items: center;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 39px;
    height: 39px;
    border: none;
    background: none;
    font-size: 18px;
  }
  button.back {
    color: ${(props) => props.backDisabled ? '#ccc' : '#999'};
    cursor: ${(props) => props.backDisabled ? 'default' : 'pointer'};
    ${props => (
      props.backDisabled ? '' : 
      '&:hover { color: #222 }'
    )}
  }
  button.upload {
    & > label {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #999;
      cursor: pointer;
    }
    &:hover > label {
      color: #444;
    }
  }
  button.reload,
  button.remove {
    cursor: pointer;
    color: #999;
    &:hover {
      color: #444;
    }
  }
  button.edit {
    cursor: pointer;
    color: #999;
    &:hover {
      color: #444;
    }
  }
  button.addFolder {
    cursor: pointer;
    color: #999;
    &:hover {
      color: #555;
    }
  }
`;
const Contents = Styled.label`
  display: block;
  height: calc(100% - ${style.headerH + style.footerH}px);
  overflow: auto;
  position: relative;
`;
const Footer = Styled.footer`
  height: ${style.footerH}px;
  border-top: 1px solid #aaaaaa40;
`;