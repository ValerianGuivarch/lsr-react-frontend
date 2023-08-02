import React, {useEffect} from 'react';
import './App.css';
import {useDispatch} from "react-redux";
import { Outlet } from "react-router-dom";
// @ts-ignore
import s from "./style.module.css";
import {L7RApi} from "./data/L7RApi";
import {setPreviewPjsList} from "./data/store/preview-pjs-slice";

export function App() {
  const dispatch = useDispatch();

  async function fetchAllCharacterPreview() {
    const characterPreviewRaws = await L7RApi.getPJs();
    dispatch(setPreviewPjsList(characterPreviewRaws));
  }
  useEffect(() => {
      fetchAllCharacterPreview().then(r => {});
  }, []);

  return (
      <div className="container-fluid">
        <div className={s.outlet_container}>
            <Outlet />
        </div>
      </div>
  );
}

