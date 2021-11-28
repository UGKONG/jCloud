import React, { useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import Background from './img/bg.png';
import FinderComponent from './Finder';
import IconComponent from './Icon';
import axios from 'axios';
import BgDiv from './BgDiv';

const dbURL = 'https://sanguk-db-default-rtdb.firebaseio.com/jCloud';
export const Store = React.createContext({});

const App = () => {
  const [fileChange, setFileChange] = useState(false);
  const [bgYN, setBgYN] = useState(false);
  const [modalYN, setModalYN] = useState(false);
  const [iconList, setIconList] = useState([]);
  const [finderInfo, setFinderInfo] = useState({yn: false, id: '', name: '', items: []});
  const [parentSeq, setParentSeq] = useState(0);
  const [selectIconList, setSelectIconList] = useState([]);
  const [editIcon, setEditIcon] = useState({mode: false, id: ''});

  useEffect(() => {
    setInterval(() => {
      getIconList();
    }, 2000);
  }, [getIconList]);

  useEffect(() => getIconList(), [fileChange]);


  const getIconList = () => {
    axios.get(dbURL + '/icon-list.json').then((response) => {
      let temp = [];
      let keys = Object.keys(response.data);
      keys.forEach(key => {
        response.data[key].pathName = key;
        temp.push(response.data[key]);
      })
      setIconList(temp);
    });
  }

  const IconMemo = useMemo(() => {
    let filterList = [];
    if (iconList.length == 0) return;
    for (let i = 0; i < Object.keys(iconList).length; i++) {
      if (iconList[i]?.parent == 0) filterList.push(iconList[i]);
    }
    // let filterList = iconList.filter(x => x.parent == 0);
    if (filterList.length == 0) return;
    return (
      filterList.map(
        (d, i) => <IconComponent po={'bg'} info={d} key={i} />
      )
    )
  }, [iconList]);

  const FinderMemo = useMemo(() => (
    finderInfo.yn ? <FinderComponent id={finderInfo.id} name={finderInfo.name} items={finderInfo.items} /> : <></>
  ), [fileChange, finderInfo]);

  return (
    <Store.Provider value={{
      getIconList,
      selectIconList, setSelectIconList,
      fileChange, setFileChange,
      dbURL, setBgYN, iconList, setIconList,
      finderInfo, setFinderInfo, 
      modalYN, setModalYN,
      parentSeq, setParentSeq,
      editIcon, setEditIcon,

    }}>
      <Main bg={Background}>
        <BgDiv yn={bgYN} />
        { IconMemo }
        { FinderMemo }
      </Main>
    </Store.Provider>
  )
}

export default App;

const Main = Styled.main`
  background-image: url(${prop => prop.bg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;