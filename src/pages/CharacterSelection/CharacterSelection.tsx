import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {CharacterPreview} from "../../domain/models/CharacterPreview";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {setPreviewPjsList} from "../../data/store/preview-pjs-slice";
import styled from "styled-components";
import {RootState} from "../../data/store";


export default function CharacterSelection() {

    const dispatch = useDispatch();

    async function fetchAllCharacterPreview() {
        const characterPreviewRaws = await ApiL7RProvider.getPJs();
        dispatch(setPreviewPjsList(characterPreviewRaws));
    }
    useEffect(() => {
        fetchAllCharacterPreview().then(() => {});
    }, []);


    const pjsList = useSelector((store: RootState) => store.PREVIEW_PJS.previewPjsList);
    const [selectedPlayerName, setSelectedPlayerName] = React.useState<string>("");
    const [selectedName, setSelectedName] = React.useState<string>("");
    const navigate = useNavigate();
    const playerNames: string[] = Array.from(new Set(pjsList.map((item: CharacterPreview) => item.playerName))) as string[];
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
                        <option value="">Joueuse</option>
                        {playerNames
                            .sort()
                            .map((playerName: string, index: number) => (
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
                        <option value="">Personnage</option>
                        {pjsList
                            .filter((item: any) => item.playerName === selectedPlayerName)
                            .sort()
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
                        const confirmed = window.confirm("Tu es sûr d'avoir le droit d'être MJ ?");
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