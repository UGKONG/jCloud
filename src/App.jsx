import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import Styled from 'styled-components';
import Background from './img/bg.png';
import FinderComponent from './Finder';
import IconComponent from './Icon';
import { useRest } from './hook';
import BgDiv from './BgDiv';
const dbURL = 'https://sanguk-db-default-rtdb.firebaseio.com/jCloud/';
export const Store = createContext({});

const App = () => {
  const [bgYN, setBgYN] = useState(false);
  const [modalYN, setModalYN] = useState(false);
  const [iconList, setIconList] = useState([]);
  const [finderInfo, setFinderInfo] = useState({yn: false, name: '', items: []});

  useEffect(() => {
    useRest({
      url: dbURL + 'icon-list.json',
      success: (data) => {
        setIconList(data);
      }
    })
  }, []);

  const IconMemo = useMemo(() => (
    iconList.map((d, i) => <IconComponent info={d} key={i} />)
  ), [iconList]);

  const FinderMemo = useMemo(() => (
    finderInfo.yn ? <FinderComponent name={finderInfo.name} items={finderInfo.items} /> : <></>
  ), [finderInfo]);

  return (
    <Store.Provider value={{
      dbURL, setBgYN, iconList, 
      finderInfo, setFinderInfo, 
      modalYN, setModalYN
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