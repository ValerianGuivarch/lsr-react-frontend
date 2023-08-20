import React, {useState} from 'react';
import {Character} from "../../../domain/models/Character";
import {UtilsString} from "../../../utils/UtilsString";
import {CharacterState} from "../../../domain/models/CharacterState";
import {DisplayCategory} from "../../../domain/models/DisplayCategory";
import {Apotheose} from "../../../domain/models/Apotheose";
import {RestModal} from "./RestModal";
import {LongRestModal} from "./LongRestModal";
import {Separator} from "./Separator";
import {CharacterButton} from "../CharacterButtons/CharacterButton";
import {EmpiriqueRollModal} from "./EmpiriqueRollModal";
import styled from "styled-components";
import {ApotheoseState} from "../../../domain/models/ApotheoseState";
import {ApotheoseModal} from "./ApotheoseModal";
import { FaSkullCrossbones } from 'react-icons/fa';
import {Skill} from "../../../domain/models/Skill";
import {Proficiency} from "../../../domain/models/Proficiency";
import {CharacterBlockBtn} from "./CharacterBlockBtn";

export function CharacterPanel(props: {
    cardDisplay: boolean,
    character: Character,
    characterState: CharacterState,
    sendRoll: (p:{skillName: string, empiriqueRoll?: string}) => void,
    updateState: (newState: CharacterState) => void,
    updateCharacter: (newCharacter: Character) => void,
    rest?: () => void
}) {
    const [isApotheoseModalOpen, setIsApotheoseModalOpen] = useState(false);
    const [isRestModalOpen, setIsRestModalOpen] = useState(false);
    const [isLongRestModalOpen, setIsLongRestModalOpen] = useState(false);
    const [isEmpiriqueRollModalOpen, setIsEmpiriqueRollModalOpen] = useState(false);

    const { cardDisplay, character, characterState} = props;

    function handleApotheoseModalClose(continueApotheose: boolean) {
        if(continueApotheose) {
            props.updateCharacter({
                ...character,
                apotheoseState: ApotheoseState.COST_PAID
            })
        } else {
            props.updateCharacter({
                ...character,
                apotheoseName: null,
                apotheoseState: ApotheoseState.ALREADY_USED
            })
        }
        setIsApotheoseModalOpen(false);
        }

    function handleOnClickApotheose(apotheoseName: string) {
        const apotheose = character.apotheoses.find((apotheose: Apotheose) => apotheose.name === apotheoseName);
        if(apotheose) {
            props.updateCharacter({
                ...character,
                apotheoseName: apotheose.name,
                apotheoseState: ApotheoseState.COST_TO_PAY
            })
        }
    }

    function handleShortRest() {
        if(props.rest) {
            props.rest()
            setIsRestModalOpen(true);
        }
    }
    function handleLongRest() {
        props.updateCharacter({
            ...character,
            pv: character.pvMax,
            pf: character.pfMax,
            pp: character.ppMax,
        })
        handleShortRest()
        setIsLongRestModalOpen(true);
    }
    function handleOnClickProficiency(proficiencyName: string) {
        const proficiency = character.proficiencies.find((proficiency: Proficiency) => proficiency.name === proficiencyName);
        if(proficiency) {
            props.updateState({
                ...characterState,
                proficiencies: characterState.proficiencies.set(proficiency.name, !characterState.proficiencies.get(proficiency.name))
           })
        }
    }
    function handleOnClickSkill(skillName: string) {

        /*const bonus = characterState.bonus + (characterState.lux ? 1 : 0) + (characterState.secunda ? 1 : 0);
        const malus = characterState.malus + (characterState.umbra ? 1 : 0);
        const hasProficiency = Array.from(characterState.proficiencies.values()).some((value) => value);
        */
        const skill = character.skills.find((skill: Skill) => skill.name === skillName);
        if(skill) {
           /* if(skill.dailyUse !== null) {
                props.updateState.updateCharacter({
                    ...character,
                    skills: character.skills.map((skill: Skill) => {
                        if(skill.name === skillName) {
                            return {
                                ...skill,
                                dailyUse: skill.dailyUse - 1
                            }
                        }
                        return skill;
                    })
                }).then(() => {
                    props.sendRoll({skillName: skillName});
                })
            } else {*/
                props.sendRoll({skillName: skillName});
            props.updateState({
                ...characterState,
                focusActivated: false,
                powerActivated: false,
                lux: false,
                secunda: false,
                umbra: false,
                proficiencies: characterState.proficiencies,// TODO reset à false
                bonus: characterState.bonusActivated ? characterState.bonus : 0,
                malus: characterState.malusActivated ? characterState.malus : 0,
            })
           // }
        }
    }

    const apotheose = character.apotheoseName ? character.apotheoses.find((apotheose: Apotheose) => apotheose.name === character.apotheoseName) : undefined;
    if(character.apotheoseState === ApotheoseState.COST_TO_PAY && !isApotheoseModalOpen) {
        setIsApotheoseModalOpen(true);
    }
    if(character.apotheoseState !== ApotheoseState.COST_TO_PAY && isApotheoseModalOpen) {
        setIsApotheoseModalOpen(false);
    }

    return (
        <MainContainerButtons cardDisplay={cardDisplay}>
            <div>
                {character.apotheoseName && (
                    <CharacterApotheose>
                        {UtilsString.capitalize(character.apotheoseName)}
                    </CharacterApotheose>
                )}
            </div>
            <CharacterBlocks>
                <Separator text={"Stats"} display={!cardDisplay}/>
                <ButtonsRow cardDisplay={cardDisplay}>
                    <
                        CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "ch" : "chair"}
                        value={character.chair}
                        bonusValue={character.chairBonus}
                        onClickBtn={() => {
                            handleOnClickSkill("chair");
                        }}
                    />
                    <CharacterButton
                        cardDisplay={cardDisplay}
                        name={"pv"}
                        column={true}
                        selected={false}
                        value={character.pv}
                        maxValue={character.pvMax}
                        icon={FaSkullCrossbones}
                        onClickIncr={() => {
                            props.updateCharacter({
                                ...character,
                                pv: character.pv + 1
                            })
                        }}
                        onClickDecr={() => {
                            props.updateCharacter({
                                ...character,
                                pv: character.pv - 1
                            })
                        }}
                        onClickBtn={() => {
                            if(character.pv === 0) {
                                handleOnClickSkill("KO");
                            }
                        }}/>
                    <CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "bn" : "bonus"}
                        selected={characterState.bonusActivated}
                        value={characterState.bonus}
                        onClickIncr={() => {
                            props.updateState({...characterState, bonus: characterState.bonus + 1});
                        }}
                        onClickDecr={() => {
                            props.updateState({...characterState, bonus: characterState.bonus - 1});
                        }}
                        onClickBtn={() => {
                            if (character.pf > 0) {
                                props.updateState({...characterState, bonusActivated: !characterState.bonusActivated});
                            }
                        }}/>

                </ButtonsRow>
                <ButtonsRow cardDisplay={cardDisplay}>
                    <CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "sp" : "esprit"}
                        value={character.esprit}
                        bonusValue={character.espritBonus}
                        onClickBtn={() => {
                            handleOnClickSkill("esprit");
                        }}
                    />
                    <CharacterButton
                        cardDisplay={cardDisplay}
                        name={"pf"}
                        selected={characterState.focusActivated}
                        value={character.pf}
                        maxValue={character.pfMax}
                        onClickIncr={() => {
                            props.updateCharacter({
                                ...character,
                                pf: character.pf + 1
                            })
                        }}
                        onClickDecr={() => {
                            props.updateCharacter({
                                ...character,
                                pf: character.pf - 1
                            })
                        }}
                        onClickBtn={() => {
                            if (character.pf > 0) {
                                props.updateState({...characterState, focusActivated: !characterState.focusActivated});
                            }
                        }}
                    />

                    <CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "ml" : "malus"}
                        selected={characterState.malusActivated}
                        value={characterState.malus}
                        onClickIncr={() => {
                           props.updateState({...characterState, malus: characterState.malus + 1});
                        }}
                        onClickDecr={() => {
                            props.updateState({...characterState, malus: characterState.malus - 1});
                        }}

                        onClickBtn={() => {
                            if (character.pf > 0) {
                                props.updateState({...characterState, malusActivated: !characterState.malusActivated});
                            }
                        }}/>
                </ButtonsRow>
                <ButtonsRow cardDisplay={cardDisplay}>
                    <CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "es" : "essence"}
                        value={character.essence}
                        bonusValue={character.essenceBonus}
                        onClickBtn={() => {
                            handleOnClickSkill("essence");
                        }}
                    />

                    <CharacterButton
                        cardDisplay={cardDisplay}
                        name={"pp"}
                        selected={characterState.powerActivated}
                        value={character.pp}
                        maxValue={character.ppMax}
                        onClickIncr={() => {
                            props.updateCharacter({
                                ...character,
                                pp: character.pp - 1
                            })
                        }}
                        onClickDecr={() => {
                            props.updateCharacter({
                                ...character,
                                pp: character.pp + 1
                            })
                        }}
                        onClickBtn={() => {
                            if (character.pp > 0) {
                                props.updateState({...characterState, powerActivated: !characterState.powerActivated});
                            }
                        }}
                    />
                    <CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "dt" : "dettes"}
                        selected={false}
                        value={character.dettes}
                        onClickIncr={() => {
                            props.updateCharacter({
                                ...character,
                                dettes: character.dettes + 1
                            })
                        }}
                        onClickDecr={() => {
                            props.updateCharacter({
                                ...character,
                                dettes: character.dettes - 1
                            })
                        }}/>
                </ButtonsRow>
                {!cardDisplay && (
                    <ButtonsRow cardDisplay={cardDisplay}>
                    <
                        CharacterButton
                        cardDisplay={cardDisplay}
                        name={"lux"}
                        selected={characterState.lux}
                        onClickBtn={() => {
                            props.updateState({...characterState, lux: !characterState.lux});
                        }}
                    />
                    <
                        CharacterButton
                        cardDisplay={cardDisplay}
                        name={"umbra"}
                        selected={characterState.umbra}
                        onClickBtn={() => {
                            props.updateState({...characterState, umbra: !characterState.umbra});
                        }}
                    /><
                    CharacterButton
                        cardDisplay={cardDisplay}
                    name={"secunda"}
                    selected={characterState.secunda}
                    onClickBtn={() => {
                        props.updateState({...characterState, secunda: !characterState.secunda});
                    }}
                />
                </ButtonsRow>
                )}
                <ButtonsRow cardDisplay={cardDisplay}>
                    <
                        CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "emp" : "empirique"}
                        onClickBtn={() => {
                            setIsEmpiriqueRollModalOpen(true);
                        }}
                    />
                    <
                        CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "sc" : "secret"}
                        selected={characterState.secret}
                        onClickBtn={() => {
                            props.updateState({
                                ...characterState,
                                secret: !characterState.secret
                            })
                        }}
                    />
                    <
                        CharacterButton
                        cardDisplay={cardDisplay}
                        name={cardDisplay ? "rp" : "repos"}
                        onClickBtn={handleShortRest}
                    />
                    {!cardDisplay && (
                        <
                        CharacterButton
                            cardDisplay={cardDisplay}
                        name={"repos long"}
                        onClickBtn={handleLongRest}
                    />
                        )}
                </ButtonsRow>
            </CharacterBlocks>

            {Character.hasDisplayCategory(character, DisplayCategory.MAGIE) && (
                <CharacterBlockBtn
                    characterState={characterState}
                    character={character}
                    cardDisplay={cardDisplay}
                    displayCategoryName={"Magie"}
                    displayCategory={DisplayCategory.MAGIE}
                    onClickSkill={handleOnClickSkill}
                    onClickProficiency={handleOnClickProficiency}
                    onClickApotheose={handleOnClickApotheose}
                    updateState={props.updateState}
                />
            )}
            {Character.hasDisplayCategory(character, DisplayCategory.ARCANES) && (
                <CharacterBlockBtn
                    characterState={characterState}
                    character={character}
                    cardDisplay={cardDisplay}
                    displayCategoryName={"Arcanes " + character.arcanes + "/" + character.arcanesMax}
                    displayCategory={DisplayCategory.ARCANES}
                    onClickSkill={handleOnClickSkill}
                    onClickProficiency={handleOnClickProficiency}
                    onClickApotheose={handleOnClickApotheose}
                    updateState={props.updateState}
                />
            )}
            {Character.hasDisplayCategory(character, DisplayCategory.ARCANES_PRIMES) && (
                <CharacterBlockBtn
                    characterState={characterState}
                    character={character}
                    cardDisplay={cardDisplay}
                    displayCategoryName={"Arcanes Primes " + character.arcanePrimes + "/" + character.arcanePrimesMax}
                    displayCategory={DisplayCategory.ARCANES_PRIMES}
                    onClickSkill={handleOnClickSkill}
                    onClickProficiency={handleOnClickProficiency}
                    onClickApotheose={handleOnClickApotheose}
                    updateState={props.updateState}
                />
            )}
            {Character.hasDisplayCategory(character, DisplayCategory.PACIFICATEURS) && (
                <CharacterBlockBtn
                    characterState={characterState}
                    character={character}
                    cardDisplay={cardDisplay}
                    displayCategoryName={"Pacification"}
                    displayCategory={DisplayCategory.PACIFICATEURS}
                    onClickSkill={handleOnClickSkill}
                    onClickProficiency={handleOnClickProficiency}
                    onClickApotheose={handleOnClickApotheose}
                    updateState={props.updateState}
                />
            )}
            {Character.hasDisplayCategory(character, DisplayCategory.SOLDATS) && (
                <CharacterBlockBtn
                    characterState={characterState}
                    character={character}
                    cardDisplay={cardDisplay}
                    displayCategoryName={"Soldat"}
                    displayCategory={DisplayCategory.SOLDATS}
                    onClickSkill={handleOnClickSkill}
                    onClickProficiency={handleOnClickProficiency}
                    onClickApotheose={handleOnClickApotheose}
                    updateState={props.updateState}
                />
            )}
            <RestModal
                character={character}
                isOpen={isRestModalOpen}
                onRequestClose={() => {
                    setIsRestModalOpen(false);
                }}/>
            {apotheose && (
                <ApotheoseModal
                character={character}
                apotheose={apotheose}
                isOpen={isApotheoseModalOpen}
                stopApotheose={() => { handleApotheoseModalClose(false)}}
                onRequestClose={() => { handleApotheoseModalClose(true)}}/>
            )}
            <LongRestModal
                character={character}
                isOpen={isLongRestModalOpen}
                onRequestClose={() => {
                    setIsLongRestModalOpen(false);
                }}/>
            <EmpiriqueRollModal
                character={character}
                isOpen={isEmpiriqueRollModalOpen}
                sendRoll={(empiriqueRoll) => {
                    props.sendRoll({skillName: "empirique", empiriqueRoll: empiriqueRoll});
                }}
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