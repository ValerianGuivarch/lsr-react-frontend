import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {CharacterPreview} from "../../domain/models/CharacterPreview";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {setPreviewPjsList} from "../../data/store/preview-pjs-slice";
import styled from "styled-components";


export default function CharacterSelection() {

    const dispatch = useDispatch();

    async function fetchAllCharacterPreview() {
        const characterPreviewRaws = await ApiL7RProvider.getPJs();
        dispatch(setPreviewPjsList(characterPreviewRaws));
    }
    useEffect(() => {
        fetchAllCharacterPreview().then(() => {});
    }, []);


    // @ts-ignore
    const pjsList = useSelector((store) => store.PREVIEW_PJS.previewPjsList);
    const [selectedPlayerName, setSelectedPlayerName] = React.useState<string>("");
    const [selectedName, setSelectedName] = React.useState<string>("");
    const navigate = useNavigate();
    const playerNames: string[] = Array.from(new Set(pjsList.map((item: CharacterPreview) => item.playerName)));
    const handlePlayerNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlayerName(event.target.value);
        setSelectedName("");
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedName(event.target.value);
    };



    return (
        <PageSelectionContainer>
            <form>
                <label>
                    Player Name:
                    <select value={selectedPlayerName} onChange={handlePlayerNameChange}>
                        <option value="">Select Player Name</option>
                        {playerNames.map((playerName: string, index: number) => (
                            <option key={index} value={playerName}>
                                {playerName}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Name:
                    <select value={selectedName} onChange={handleNameChange} disabled={!selectedPlayerName}>
                        <option value="">Select Name</option>
                        {pjsList
                            .filter((item: any) => item.playerName === selectedPlayerName)
                            .map((item: any, index: number) => (
                                <option key={index} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                    </select>
                </label>
                <br />
                <button
                    disabled={!selectedPlayerName || !selectedName}
                    onClick={() => navigate("/characters/" + selectedName)}
                >
                    Go to {selectedName}
                </button>
                <p>OU</p>
                <button
                    onClick={() => {
                        const confirmed = window.confirm("Êtes-vous sûr de vouloir devenir MJ ?");
                        if (confirmed) {
                            navigate("/mj/")
                        }
                    }}
                >
                    Devenir MJ !
                </button>
            </form>
        </PageSelectionContainer>
    );
}




const PageSelectionContainer = styled.div`
  display: flex;
`;