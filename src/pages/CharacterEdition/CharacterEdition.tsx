import React, {useEffect, useState} from 'react';
// @ts-ignore
import s from './style.module.css';
import {useParams} from "react-router-dom";
import {Character} from "../../domain/models/Character";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {useDispatch, useSelector} from "react-redux";
import {setCharacter} from "../../data/store/character-slice";

export function CharacterEdition() {
    const dispatch = useDispatch();
    const {characterName} = useParams();

    async function fetchCurrentCharacter() {
        const currentCharacter = await ApiL7RProvider.getCharacterByName(characterName ? characterName : '');
        dispatch(setCharacter(currentCharacter));
    }


    useEffect(() => {
        fetchCurrentCharacter().then(() => {
        });
    }, []);

    const currentCharacter: Character = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.character
    );



    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const numberFields = [
            "chair", "esprit", "essence", "pv", "pvMax", "pf", "pfMax", "pp", "ppMax",
            "dettes", "arcanes", "arcanesMax", "niveau", "relance"
        ];
        const finalValue = numberFields.includes(name) ? Number(value) : value;
        dispatch(setCharacter({ ...currentCharacter, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        ApiL7RProvider.updateCharacter(currentCharacter).then(() => {});
    };

    if (!currentCharacter) {
        return <div>Loading...</div>;
    }

    return (
        <div className={s.editCharacter}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom :</label>
                    <span>{currentCharacter.name}</span> {/* Le nom est non modifiable */}
                </div>
                <div>
                    <label>Chair :</label>
                    <input type="number" name="chair" value={currentCharacter.chair} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Esprit :</label>
                    <input type="number" name="esprit" value={currentCharacter.esprit} onChange={handleInputChange} />
                </div>
                {/* ... Ajoutez les autres champs de la même manière ... */}
                {/* Exemple avec un champ texte : */}
                <div>
                    <label>Lux :</label>
                    <input type="text" name="lux" value={currentCharacter.lux} onChange={handleInputChange} />
                </div>
                <button type="submit">Mettre à jour</button>
            </form>
        </div>
    );
}