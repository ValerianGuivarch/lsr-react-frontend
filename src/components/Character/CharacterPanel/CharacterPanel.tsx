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
import {Proficiency} from "../../../domain/models/Proficiency";

export function CharacterPanel(props: {
    cardDisplay: boolean
}) {
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

    function CharacterBlockBtn(props: {
        cardDisplay: boolean,
        displayCategory: DisplayCategory,
        displayCategoryName: string
    }) {
        const skills = Character.getSkills(currentCharacter, props.displayCategory);
        const proficiencies = Character.getProficiencies(currentCharacter, props.displayCategory);
        const apotheoses = Character.getApotheoses(currentCharacter, props.displayCategory);
        return (
            <CharacterBlocks>
                <Separator text={props.displayCategoryName} display={!props.cardDisplay && (skills.length>0 || proficiencies.length>0 || apotheoses.length>0)}/>
                <ButtonsRow cardDisplay={props.cardDisplay}>
                    {skills.map((skill: Skill) => (
                        <CharacterButton
                            cardDisplay={props.cardDisplay}
                            key={skill.name}
                            name={props.cardDisplay ? skill.shortName : skill.name}
                            onClickBtn={() => {
                                sendRoll(skill.name);
                            }}
                        />
                    ))}
                    {proficiencies.map((proficiency: Proficiency) => (
                        <CharacterButton
                            cardDisplay={props.cardDisplay}
                            selected={state.proficiencies.get(proficiency.name)}
                            key={proficiency.name}
                            name={props.cardDisplay ? proficiency.shortName :proficiency.name}
                            onClickBtn={() => {
                                dispatch(setState({
                                    ...state,
                                    proficiencies: state.proficiencies.set(proficiency.name, !state.proficiencies.get(proficiency.name))
                                }));
                            }}
                        />
                    ))}
                    {apotheoses.map((apotheose: Apotheose) => (
                        <CharacterButton
                            cardDisplay={props.cardDisplay}
                            selected={currentCharacter.apotheoseName === apotheose.name}
                            key={apotheose.name}
                            name={props.cardDisplay ? apotheose.shortName :apotheose.name}
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
        )
    }

    return (
        <MainContainerButtons cardDisplay={props.cardDisplay}>
            <div>
                {currentCharacter.apotheoseName && (
                    <CharacterApotheose>
                        {UtilsString.capitalize(currentCharacter.apotheoseName)}
                    </CharacterApotheose>
                )}
            </div>
            <CharacterBlocks>
                <Separator text={"Stats"} display={!props.cardDisplay}/>
                <ButtonsRow cardDisplay={props.cardDisplay}>
                    <
                        CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "ch" : "chair"}
                        value={currentCharacter.chair}
                        onClickBtn={() => {
                            sendRoll("chair");
                        }}
                    />
                    <CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={"pv"}
                        column={true}
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
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "bn" : "bonus"}
                        selected={false}
                        value={state.bonus}
                        onClickIncr={() => {
                            dispatch(setState({...state, bonus: state.bonus + 1}));
                        }}
                        onClickDecr={() => {
                            dispatch(setState({...state, bonus: state.bonus - 1}));
                        }}/>
                </ButtonsRow>
                <ButtonsRow cardDisplay={props.cardDisplay}>
                    <CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "sp" : "esprit"}
                        value={currentCharacter.esprit}
                        onClickBtn={() => {
                            sendRoll("esprit");
                        }}
                    />
                    <CharacterButton
                        cardDisplay={props.cardDisplay}
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
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "ml" : "malus"}
                        selected={false}
                        value={state.malus}
                        onClickIncr={() => {
                            dispatch(setState({...state, malus: state.malus + 1}));
                        }}
                        onClickDecr={() => {
                            dispatch(setState({...state, malus: state.malus - 1}));
                        }}/>
                </ButtonsRow>
                <ButtonsRow cardDisplay={props.cardDisplay}>
                    <CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "es" : "essence"}
                        value={currentCharacter.essence}
                        onClickBtn={() => {
                            sendRoll("essence");
                        }}
                    />

                    <CharacterButton
                        cardDisplay={props.cardDisplay}
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
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "dt" : "dettes"}
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
                {!props.cardDisplay && (
                    <ButtonsRow cardDisplay={props.cardDisplay}>
                    <
                        CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={"lux"}
                        selected={state.lux}
                        onClickBtn={() => {
                            dispatch(setState({...state, lux: !state.lux}));
                        }}
                    />
                    <
                        CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={"umbra"}
                        selected={state.umbra}
                        onClickBtn={() => {
                            dispatch(setState({...state, umbra: !state.umbra}));
                        }}
                    /><
                    CharacterButton
                        cardDisplay={props.cardDisplay}
                    name={"secunda"}
                    selected={state.secunda}
                    onClickBtn={() => {
                        dispatch(setState({...state, secunda: !state.secunda}));
                    }}
                />
                </ButtonsRow>
                )}
                <ButtonsRow cardDisplay={props.cardDisplay}>
                    <
                        CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "emp" : "empirique"}
                        onClickBtn={() => {
                            setIsEmpiriqueRollModalOpen(true);
                        }}
                    />
                    <
                        CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "sc" : "secret"}
                        selected={state.secret}
                        onClickBtn={() => {
                            dispatch(setState({...state, secret: !state.secret}));
                        }}
                    />
                    <
                        CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "rp" : "repos"}
                        onClickBtn={() => {
                            setIsRestModalOpen(true);
                        }}
                    />
                    {props.cardDisplay && (
                        <
                        CharacterButton
                            cardDisplay={props.cardDisplay}
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
                        )}
                </ButtonsRow>
            </CharacterBlocks>

            {Character.hasDisplayCategory(currentCharacter, DisplayCategory.MAGIE) && (
                <CharacterBlockBtn
                    displayCategory={DisplayCategory.MAGIE}
                    displayCategoryName={"Magie"}
                    cardDisplay={props.cardDisplay}/>
            )}
            {Character.hasDisplayCategory(currentCharacter, DisplayCategory.ARCANES) && (
                <CharacterBlockBtn
                    displayCategory={DisplayCategory.ARCANES}
                    displayCategoryName={"Arcanes"}
                    cardDisplay={props.cardDisplay}/>
            )}
            {Character.hasDisplayCategory(currentCharacter, DisplayCategory.PACIFICATEURS) && (
                <CharacterBlockBtn
                    displayCategory={DisplayCategory.PACIFICATEURS}
                    displayCategoryName={"Pacification"}
                    cardDisplay={props.cardDisplay}/>
            )}
            {Character.hasDisplayCategory(currentCharacter, DisplayCategory.SOLDATS) && (
                <CharacterBlockBtn
                    displayCategory={DisplayCategory.SOLDATS}
                    displayCategoryName={"Soldat"}
                    cardDisplay={props.cardDisplay}/>
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


const MainContainerButtons = styled.div<{ cardDisplay: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    max-width: ${(props) => (props.cardDisplay ? '200px' : '800px')};
    font-size: ${(props) => (props.cardDisplay ? '0.7em' : '1em')};
`;

const CharacterApotheose = styled.div`
    color: #f00;
    font-weight: bold;
    text-align: center;
`;

const ButtonsRow = styled.div<{ cardDisplay: boolean }>`
    display: ${(props) => (props.cardDisplay ? 'inline-flex' : 'flex')};
    flex-direction: row;
    justify-content: center;
    margin-bottom: ${(props) => (props.cardDisplay ? '0px' : '4px')};
`;

const CharacterBlocks = styled.div`
   
`;