import React, {useState} from 'react';
import {Character} from "../../../domain/models/Character";
import {useDispatch, useSelector} from "react-redux";
import {UtilsString} from "../../../utils/UtilsString";
import {setState} from "../../../data/store/character-slice";
import {ApiL7RProvider} from "../../../data/api/ApiL7RProvider";
import {CharacterState} from "../../../domain/models/CharacterState";
import {DisplayCategory} from "../../../domain/models/DisplayCategory";
import {Skill} from "../../../domain/models/Skill";
import {Apotheose} from "../../../domain/models/Apotheose";
import {RestModal} from "./RestModal";
import {LongRestModal} from "./LongRestModal";
import {Separator} from "./Separator";
import {CharacterButton} from "../CharacterButtons/CharacterButton";
import {EmpiriqueRollModal} from "./EmpiriqueRollModal";
import styled from "styled-components";

export function CharacterPanel() {
    const dispatch = useDispatch();
    const [isRestModalOpen, setIsRestModalOpen] = useState(false);
    const [isLongRestModalOpen, setIsLongRestModalOpen] = useState(false);
    const [isEmpiriqueRollModalOpen, setIsEmpiriqueRollModalOpen] = useState(false);

    const state: CharacterState = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.state
    );
    // @ts-ignore
    const currentCharacter: Character = useSelector((store) => store.CHARACTER.character);

    function sendRoll(skillName: string, empiriqueRoll?: string) {
        const bonus = state.bonus + (state.lux ? 1 : 0) + (state.secunda ? 1 : 0);
        const malus = state.malus + (state.umbra ? 1 : 0);
        const hasProficiency = Array.from(state.proficiencies.values()).some((value) => value);
        ApiL7RProvider.sendRoll({
            characterName: currentCharacter.name,
            skillName: skillName,
            focus: state.focusActivated,
            power: state.powerActivated,
            proficiency: hasProficiency,
            secret: state.secret,
            bonus: bonus,
            malus: malus,
            empiriqueRoll: empiriqueRoll
        }).then((response) => {
            console.log(response);
        })
    }

    return (
        <MainContainerButtons>
            <div>
                {currentCharacter.apotheoseName && (
                    <CharacterApotheose>
                        {UtilsString.capitalize(currentCharacter.apotheoseName)}
                    </CharacterApotheose>
                )}
            </div>
            <CharacterBlocks>
                <Separator text={"Stats"}/>
                <ButtonsRow>
                    <
                        CharacterButton
                        name={"chair"}
                        value={currentCharacter.chair}
                        onClickBtn={() => {
                            sendRoll("chair");
                        }}
                    />
                    <CharacterButton
                        name={"pv"}
                        selected={false}
                        value={currentCharacter.pv}
                        maxValue={currentCharacter.pvMax}
                        onClickIncr={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                pv: currentCharacter.pv + 1

                            }).then(() => {
                            })
                        }}
                        onClickDecr={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                pv: currentCharacter.pv - 1
                            }).then(() => {
                            })
                        }}
                        onClickBtn={() => {
                            // TODO jet de sauv vs la mort si 0
                        }}/>
                    <CharacterButton
                        name={"bonus"}
                        selected={false}
                        value={state.bonus}
                        onClickIncr={() => {
                            dispatch(setState({...state, bonus: state.bonus + 1}));
                        }}
                        onClickDecr={() => {
                            dispatch(setState({...state, bonus: state.bonus - 1}));
                        }}/>
                </ButtonsRow>
                <ButtonsRow>
                    <CharacterButton
                        name={"esprit"}
                        value={currentCharacter.esprit}
                        onClickBtn={() => {
                            sendRoll("esprit");
                        }}
                    />
                    <CharacterButton
                        name={"pf"}
                        selected={state.focusActivated}
                        value={currentCharacter.pf}
                        maxValue={currentCharacter.pfMax}
                        onClickIncr={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                pf: currentCharacter.pf + 1
                            }).then(() => {
                            })
                        }}
                        onClickDecr={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                pf: currentCharacter.pf - 1
                            }).then(() => {
                            })
                        }}
                        onClickBtn={() => {
                            if (currentCharacter.pf > 0) {
                                dispatch(setState({...state, focusActivated: !state.focusActivated}));
                            }
                        }}
                    />

                    <CharacterButton
                        name={"malus"}
                        selected={false}
                        value={state.malus}
                        onClickIncr={() => {
                            dispatch(setState({...state, malus: state.malus + 1}));
                        }}
                        onClickDecr={() => {
                            dispatch(setState({...state, malus: state.malus - 1}));
                        }}/>
                </ButtonsRow>
                <ButtonsRow>
                    <CharacterButton
                        name={"essence"}
                        value={currentCharacter.essence}
                        onClickBtn={() => {
                            sendRoll("essence");
                        }}
                    />

                    <CharacterButton
                        name={"pp"}
                        selected={state.powerActivated}
                        value={currentCharacter.pp}
                        maxValue={currentCharacter.ppMax}
                        onClickIncr={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                pp: currentCharacter.pp + 1
                            }).then(() => {
                            })
                        }}
                        onClickDecr={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                pp: currentCharacter.pp - 1
                            }).then(() => {
                            })
                        }}
                        onClickBtn={() => {
                            if (currentCharacter.pp > 0) {
                                dispatch(setState({...state, powerActivated: !state.powerActivated}));
                            }
                        }}
                    />
                    <CharacterButton
                        name={"dettes"}
                        selected={false}
                        value={currentCharacter.dettes}
                        onClickIncr={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                dettes: currentCharacter.dettes + 1
                            }).then(() => {
                            })
                        }}
                        onClickDecr={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                dettes: currentCharacter.dettes - 1
                            }).then(() => {
                            })
                        }}/>
                </ButtonsRow>
                <ButtonsRow>
                    <
                        CharacterButton
                        name={"lux"}
                        selected={state.lux}
                        onClickBtn={() => {
                            dispatch(setState({...state, lux: !state.lux}));
                        }}
                    />
                    <
                        CharacterButton
                        name={"umbra"}
                        selected={state.umbra}
                        onClickBtn={() => {
                            dispatch(setState({...state, umbra: !state.umbra}));
                        }}
                    /><
                    CharacterButton
                    name={"secunda"}
                    selected={state.secunda}
                    onClickBtn={() => {
                        dispatch(setState({...state, secunda: !state.secunda}));
                    }}
                />
                </ButtonsRow>
                <ButtonsRow>
                    <
                        CharacterButton
                        name={"empirique"}
                        onClickBtn={() => {
                            setIsEmpiriqueRollModalOpen(true);
                        }}
                    />
                    <
                        CharacterButton
                        name={"secret"}
                        selected={state.secret}
                        onClickBtn={() => {
                            dispatch(setState({...state, secret: !state.secret}));
                        }}
                    />
                    <
                        CharacterButton
                        name={"repos"}
                        onClickBtn={() => {
                            setIsRestModalOpen(true);
                        }}
                    />
                    <
                        CharacterButton
                        name={"repos long"}
                        onClickBtn={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                pv: currentCharacter.pvMax,
                                pf: currentCharacter.pfMax,
                                pp: currentCharacter.ppMax
                            }).then(() => {
                            })
                            setIsLongRestModalOpen(true);
                        }}
                    />
                </ButtonsRow>
            </CharacterBlocks>

            {Character.hasDisplayCategory(currentCharacter, DisplayCategory.MAGIE) && (
                <CharacterBlocks>
                        <Separator text={"Magie"}/>
                    <ButtonsRow>
                        {Character.getSkills(currentCharacter, DisplayCategory.MAGIE).map((skill: Skill) => (
                            <CharacterButton
                                key={skill.name}
                                name={skill.name}
                                onClickBtn={() => {
                                    sendRoll(skill.name);
                                }}
                            />
                        ))}
                        {Character.getProficiencies(currentCharacter, DisplayCategory.MAGIE).map((skill: Skill) => (
                            <CharacterButton
                                selected={state.proficiencies.get(skill.name)}
                                key={skill.name}
                                name={skill.name}
                                onClickBtn={() => {
                                    dispatch(setState({
                                        ...state,
                                        proficiencies: state.proficiencies.set(skill.name, !state.proficiencies.get(skill.name))
                                    }));
                                }}
                            />
                        ))}
                        {Character.getApotheoses(currentCharacter, DisplayCategory.MAGIE).map((apotheose: Apotheose) => (
                            <CharacterButton
                                selected={currentCharacter.apotheoseName === apotheose.name}
                                key={apotheose.name}
                                name={apotheose.name}
                                onClickBtn={() => {
                                    ApiL7RProvider.updateCharacter({
                                        ...currentCharacter,
                                        apotheoseName: apotheose.name
                                    }).then(() => {
                                    })
                                }}
                            />
                        ))}
                    </ButtonsRow>
                </CharacterBlocks>
            )}
            {Character.hasDisplayCategory(currentCharacter, DisplayCategory.ARCANES) && (
                <CharacterBlocks>
                        <Separator text={"Arcanes " + currentCharacter.arcanes + " / " + currentCharacter.arcanesMax}/>
                    <ButtonsRow>
                        {Character.getSkills(currentCharacter, DisplayCategory.ARCANES).map((skill: Skill) => (
                            <CharacterButton
                                key={skill.name}
                                name={skill.name}
                                onClickBtn={() => {
                                    sendRoll(skill.name);
                                }}
                            />
                        ))}
                        {Character.getProficiencies(currentCharacter, DisplayCategory.ARCANES).map((skill: Skill) => (
                            <CharacterButton
                                key={skill.name}
                                selected={state.proficiencies.get(skill.name)}
                                name={skill.name}
                                onClickBtn={() => {
                                    dispatch(setState({
                                        ...state,
                                        proficiencies: state.proficiencies.set(skill.name, !state.proficiencies.get(skill.name))
                                    }));
                                }}
                            />
                        ))}
                    </ButtonsRow>
                </CharacterBlocks>
            )}
            <RestModal
                currentCharacter={currentCharacter}
                isOpen={isRestModalOpen}
                onRequestClose={() => {
                    setIsRestModalOpen(false);
                }}/>
            <LongRestModal
                currentCharacter={currentCharacter}
                isOpen={isLongRestModalOpen}
                onRequestClose={() => {
                    setIsLongRestModalOpen(false);
                }}/>
            <EmpiriqueRollModal
                currentCharacter={currentCharacter}
                isOpen={isEmpiriqueRollModalOpen}
                sendRoll={sendRoll}
                onRequestClose={() => {
                    setIsEmpiriqueRollModalOpen(false);
                }}/>
        </MainContainerButtons>
    )
}


const MainContainerButtons = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 800px;
`;

const CharacterApotheose = styled.div`
    color: #f00;
    font-weight: bold;
    text-align: center;
`;

const ButtonsRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 8px;
`;

const CharacterBlocks = styled.div`
    /* Add any required styling for this div */
`;