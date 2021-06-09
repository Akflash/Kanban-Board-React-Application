import React , {useState,useEffect,useRef}from "react";
import ReactDOM from "react-dom";

import data from "./data.json";
import { useDebounce } from 'use-debounce';
import Board from "react-trello";


export default function App() {
   const latestData = JSON.parse( localStorage.getItem('latest-data')) ||data
   const visibleData = JSON.parse( localStorage.getItem('visible-data')) || data
   const searchValue = localStorage.getItem('search') || ""
  const [boarddata, setData] = useState(visibleData);
  const [orgData, setOrgData] = useState(latestData);
  const [filter, setFilter] = useState(searchValue);
  const [cardChanged, setCardChanged] = useState(true);
  const [cardDrag, setCardDrag] = useState(true);
  const [hideDel, setHideDel] =useState(false);
  const debouncedSearchTerm = useDebounce(filter, 350);
  
  useEffect(() => {
        setCardChanged(false)
        filterFunction(debouncedSearchTerm[0].trim());
  
  }, [debouncedSearchTerm[0]]);


  React.useEffect(() => {
   localStorage.setItem('latest-data', JSON.stringify(orgData));
    localStorage.setItem('visible-data', JSON.stringify(boarddata));
    localStorage.setItem('search', filter);
  }, [orgData,boarddata]);


  const filterFunction = (str) => {
    if (str) {
      setHideDel(true)
      setCardDrag(false)
      let board = orgData.lanes.map((elem) => {
        if (elem.cards) {
          var cards = elem.cards.filter((obj) => {
            return obj.description.includes(str);
          });
        }

        return { ...elem, cards };
      });
     
      setData({ lanes: board });
    } else {
      setCardDrag(true)
      setHideDel(false)
      setData(orgData);
      setCardChanged(true)
    }
  };
  
  return (
    <div className="App">
      <h1>KANBAN BOARD</h1>
      <div>
        <input
          className=" px-2 my-2 w-1/2 py-2 outline-none"
          value={filter}
          placeholder={`Search By Description`}
          style={{
            backgroundColor: "#eee",
           
          }}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
      </div>
      <Board
       cardDraggable={cardDrag}
        editable
        hideCardDeleteIcon={hideDel}
        handleDragStart ={()=>{
          if(filter)return
        }}
        handleDragEnd = {()=> {
           setCardChanged(true)
        }}
        data={boarddata}
        onDataChange={(newData) => {

          if (!filter &&cardChanged ) setOrgData(newData);
          setData(newData);
          newData.lanes.map((elem) => {
            elem.label = elem.cards.length.toString();
          });
        }}
        style={{
          backgroundColor: "#eee"
        }}
      />
    </div>
  );
}


