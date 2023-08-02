// @ts-ignore
import s from './style.module.css';
import { useSelector } from "react-redux";
import React from "react";
import {Character} from "../../../domain/models/Character";


const CharacterBanner: React.FC = () => {
    // @ts-ignore
    const character: Character = useSelector((store) => store.CHARACTER.character);
    return (
        <div className={s.characterBannerBox}>
            <img src={character.background} alt="Background" className={s.characterBackground}/>
            <div className={s.characterBanner}>
                <img src={character.picture} alt="Avatar" className={s.characterAvatar}/>
                <div className={s.characterListInfo}>
                   <div className={s.characterName}>{character.getDisplayNameAndDescription()}</div>
                   <div className={s.characterInfo}>Lux: {character.lux}</div>
                   <div className={s.characterInfo}>Umbra: {character.umbra}</div>
                   <div className={s.characterInfo}>Secunda: {character.secunda}</div>
                </div>
            </div>
        </div>
    );
};

export default CharacterBanner;