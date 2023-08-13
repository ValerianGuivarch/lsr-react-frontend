import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {useDispatch, useSelector} from "react-redux";
import {setCharacters, setCharacter} from "../../data/store/character-slice";
import {RootState} from "../../data/store";
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";
import styled from "styled-components";

export function CharacterEdition() {
    const dispatch = useDispatch();
    const {characterName} = useParams();

    async function fetchCurrentCharacter() {
        const characterToEdit = await ApiL7RProvider.getCharacterByName(characterName ? characterName : '');
        dispatch(setCharacters([characterToEdit]));
    }


    useEffect(() => {
        fetchCurrentCharacter().then(() => {
        });
    }, []);

    const currentCharacter = useSelector((store: RootState) =>
        store.CHARACTERS.characterViewModels.find((characterViewModel: CharacterViewModel) => characterViewModel.character.name === characterName)?.character
    );

    if(!currentCharacter) {
        return <div>Loading...</div>;
    }


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
        ApiL7RProvider.updateCharacter(currentCharacter).then(() => {
            window.location.href = `/characters/${currentCharacter.name}`;
        });

    };

    if (!currentCharacter) {
        return <div>Loading...</div>;
    }

    return (
        <EditCharacterContainer>
            <Form onSubmit={handleSubmit}>
                <div>
                    <label>Nom :</label>
                    <span>{currentCharacter.name}</span>
                </div>
                <div>
                    <label>Niveau :</label>
                    <Input type="number" name="niveau" value={currentCharacter.niveau} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Chair :</label>
                    <input type="number" name="chair" value={currentCharacter.chair} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Esprit :</label>
                    <input type="number" name="esprit" value={currentCharacter.esprit} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Essence :</label>
                    <input type="number" name="essence" value={currentCharacter.essence} onChange={handleInputChange} />
                </div>
                <div>
                    <label>PV Max :</label>
                    <input type="number" name="pvMax" value={currentCharacter.pvMax} onChange={handleInputChange} />
                </div>
                <div>
                    <label>PF Max :</label>
                    <input type="number" name="pfMax" value={currentCharacter.pfMax} onChange={handleInputChange} />
                </div>
                <div>
                    <label>PP Max :</label>
                    <input type="number" name="ppMax" value={currentCharacter.ppMax} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Arcanes Max :</label>
                    <input type="number" name="arcanesMax" value={currentCharacter.arcanesMax} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Lux :</label>
                    <input type="text" name="lux" value={currentCharacter.lux} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Umbra :</label>
                    <input type="text" name="umbra" value={currentCharacter.umbra} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Secunda :</label>
                    <input type="text" name="secunda" value={currentCharacter.secunda} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Portrait :</label>
                    <input type="text" name="portrait" value={currentCharacter.picture} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Portrait apothéose :</label>
                    <input type="text" name="portraitApotheose" value={currentCharacter.pictureApotheose} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Background :</label>
                    <Input name="background" value={currentCharacter.background} onChange={handleInputChange} />
                </div>

                <Button type="submit">Mettre à jour</Button>
            </Form>
        </EditCharacterContainer>
    );
}

const EditCharacterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  padding: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Input = styled.input`
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;