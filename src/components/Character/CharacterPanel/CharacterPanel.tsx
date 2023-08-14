import React, {useState} from 'react';
import {Character} from "../../../domain/models/Character";
import {useDispatch} from "react-redux";
import {UtilsString} from "../../../utils/UtilsString";
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
import {CharacterViewModel} from "../../../domain/models/CharacterViewModel";
import {setStateForCharacter} from "../../../data/store/character-slice";
import {ApotheoseState} from "../../../domain/models/ApotheoseState";
import {ApotheoseModal} from "./ApotheoseModal";
import { FaSkullCrossbones } from 'react-icons/fa';

export function CharacterPanel(props: {
    cardDisplay: boolean,
    characterViewModel: CharacterViewModel,
}) {
    const dispatch = useDispatch();
    const [isApotheoseModalOpen, setIsApotheoseModalOpen] = useState(false);
    const [isRestModalOpen, setIsRestModalOpen] = useState(false);
    const [isLongRestModalOpen, setIsLongRestModalOpen] = useState(false);
    const [isEmpiriqueRollModalOpen, setIsEmpiriqueRollModalOpen] = useState(false);

    const state: CharacterState = props.characterViewModel.state;
    console.log(state.bonus)
    const currentCharacter: Character = props.characterViewModel.character;

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
            if(response.error) {
                alert(response.message);
            } else {
            dispatch(setStateForCharacter({
                characterName: currentCharacter.name,
                characterState : {
                    ...state,
                    focusActivated: false,
                    powerActivated: false,
                    bonus: state.bonusActivated ? state.bonus : 0,
                    malus: state.malusActivated ? state.malus : 0,
                }}
            ));
            }
        })
    }

    const apotheose = currentCharacter.apotheoseName ? currentCharacter.apotheoses.find((apotheose: Apotheose) => apotheose.name === currentCharacter.apotheoseName) : undefined;
    if(currentCharacter.apotheoseState === ApotheoseState.COST_TO_PAY && !isApotheoseModalOpen) {
        setIsApotheoseModalOpen(true);
    }
    if(currentCharacter.apotheoseState !== ApotheoseState.COST_TO_PAY && isApotheoseModalOpen) {
        console.log("hihi");
        setIsApotheoseModalOpen(false);
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
                            description={skill.description}
                            name={
                                (props.cardDisplay ? skill.shortName : (skill.longName ? skill.longName : skill.name))
                                + (skill.dailyUse !== null ? (
                                    " ("+skill.dailyUse+")"
                                ) : "")
                        }
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
                            description={proficiency.description}
                            name={props.cardDisplay ? proficiency.shortName :proficiency.name}
                            onClickBtn={() => {
                                dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {
                                    ...state,
                                    proficiencies: state.proficiencies.set(proficiency.name, !state.proficiencies.get(proficiency.name))
                                }}
                                ));
                            }}
                        />
                    ))}
                    {apotheoses.map((apotheose: Apotheose) => (
                        <CharacterButton
                            cardDisplay={props.cardDisplay}
                            selected={currentCharacter.apotheoseName === apotheose.name}
                            key={apotheose.name}
                            description={apotheose.description}
                            name={props.cardDisplay ? apotheose.shortName :apotheose.name}
                            onClickBtn={() => {
                                if(currentCharacter.apotheoseName === null) {
                                    ApiL7RProvider.updateCharacter({
                                        ...currentCharacter,
                                        apotheoseName: apotheose.name
                                    }).then(() => {
                                    })
                                } else {
                                    ApiL7RProvider.updateCharacter({
                                        ...currentCharacter,
                                        apotheoseName: null,
                                        apotheoseState: ApotheoseState.ALREADY_USED
                                    }).then(() => {
                                    })
                                }
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
                        bonusValue={currentCharacter.chairBonus}
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
                        icon={FaSkullCrossbones}
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
                            if(currentCharacter.pv === 0) {
                                sendRoll("KO");
                            }
                        }}/>
                    <CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "bn" : "bonus"}
                        selected={state.bonusActivated}
                        value={state.bonus}
                        onClickIncr={() => {
                            dispatch(setStateForCharacter({
                                characterName: currentCharacter.name,
                                characterState : {...state, bonus: state.bonus + 1}}));
                        }}
                        onClickDecr={() => {
                            dispatch(setStateForCharacter({
                                characterName: currentCharacter.name,
                                characterState : {...state, bonus: state.bonus - 1}}));
                        }}
                        onClickBtn={() => {
                            if (currentCharacter.pf > 0) {
                                dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, bonusActivated: !state.bonusActivated}}));
                            }
                        }}/>

                </ButtonsRow>
                <ButtonsRow cardDisplay={props.cardDisplay}>
                    <CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "sp" : "esprit"}
                        value={currentCharacter.esprit}
                        bonusValue={currentCharacter.espritBonus}
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
                                dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, focusActivated: !state.focusActivated}}));
                            }
                        }}
                    />

                    <CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "ml" : "malus"}
                        selected={state.malusActivated}
                        value={state.malus}
                        onClickIncr={() => {
                            dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, malus: state.malus + 1}}));
                        }}
                        onClickDecr={() => {
                            dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, malus: state.malus - 1}}));
                        }}

                        onClickBtn={() => {
                            if (currentCharacter.pf > 0) {
                                dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, malusActivated: !state.malusActivated}}));
                            }
                        }}/>
                </ButtonsRow>
                <ButtonsRow cardDisplay={props.cardDisplay}>
                    <CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "es" : "essence"}
                        value={currentCharacter.essence}
                        bonusValue={currentCharacter.essenceBonus}
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
                                dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, powerActivated: !state.powerActivated}}));
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
                            dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, lux: !state.lux}}));
                        }}
                    />
                    <
                        CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={"umbra"}
                        selected={state.umbra}
                        onClickBtn={() => {
                            dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, umbra: !state.umbra}
                            }))
                        }}
                    /><
                    CharacterButton
                        cardDisplay={props.cardDisplay}
                    name={"secunda"}
                    selected={state.secunda}
                    onClickBtn={() => {
                        dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, secunda: !state.secunda}}));
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
                            dispatch(setStateForCharacter({
                                    characterName: currentCharacter.name,
                                    characterState : {...state, secret: !state.secret}}));
                        }}
                    />
                    <
                        CharacterButton
                        cardDisplay={props.cardDisplay}
                        name={props.cardDisplay ? "rp" : "repos"}
                        onClickBtn={() => {
                            ApiL7RProvider.rest(currentCharacter).then(() => {
                            setIsRestModalOpen(true);
                        })
                        }}
                    />
                    {!props.cardDisplay && (
                        <
                        CharacterButton
                            cardDisplay={props.cardDisplay}
                        name={"repos long"}
                        onClickBtn={() => {
                            ApiL7RProvider.updateCharacter({
                                ...currentCharacter,
                                pv: currentCharacter.pvMax,
                                pf: currentCharacter.pfMax,
                                pp: currentCharacter.ppMax,
                            }).then(() => {
                                ApiL7RProvider.rest(currentCharacter).then(() => {
                                setIsLongRestModalOpen(true);
                            })
                            })

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
                    displayCategoryName={"Arcanes " + currentCharacter.arcanes + "/" + currentCharacter.arcanesMax}
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
            {apotheose && (
                <ApotheoseModal
                currentCharacter={currentCharacter}
                apotheose={apotheose}
                isOpen={isApotheoseModalOpen}
                stopApotheose={() => {
                    ApiL7RProvider.updateCharacter({
                        ...currentCharacter,
                        apotheoseName: null,
                        apotheoseState: ApotheoseState.ALREADY_USED
                    }).then(() => {
                        setIsApotheoseModalOpen(false);
                    })
                }}
                onRequestClose={() => {
                    ApiL7RProvider.updateCharacter({
                        ...currentCharacter,
                        apotheoseState: ApotheoseState.COST_PAID
                    }).then(() => {
                        setIsApotheoseModalOpen(false);
                    })

                }}/>
            )}
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
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: ${(props) => (props.cardDisplay ? '0px' : '4px')};
`;

const CharacterBlocks = styled.div`
   
`;