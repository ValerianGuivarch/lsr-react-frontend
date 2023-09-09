import React from 'react';
import {CharacterState} from "../../../domain/models/CharacterState";
import {DisplayCategory} from "../../../domain/models/DisplayCategory";
import {Skill} from "../../../domain/models/Skill";
import {Apotheose} from "../../../domain/models/Apotheose";
import {Separator} from "./Separator";
import {CharacterButton} from "../CharacterButtons/CharacterButton";
import styled from "styled-components";
import {Proficiency} from "../../../domain/models/Proficiency";
import {Character} from "../../../domain/models/Character";

export  function CharacterBlockBtn(props: {
    characterState: CharacterState,
    character: Character,
        cardDisplay: boolean,
    displayCategoryName: string,
        displayCategory: DisplayCategory,
    onClickSkill: (skill: Skill) => void,
    onClickProficiency: (proficiencyName: string) => void,
    onClickApotheose: (apotheoseName: string) => void,
    updateState: (newState: CharacterState) => void
}) {
    const { characterState, character, cardDisplay, displayCategoryName, displayCategory} = props;
        const skills = character.skills.filter((skill) => skill.displayCategory === displayCategory)
        const proficiencies = character.proficiencies.filter((skill) => skill.displayCategory === displayCategory)
        const apotheoses = character.apotheoses.filter((skill) => skill.displayCategory === displayCategory)
        return (
            <CharacterBlocks>
                <Separator text={displayCategoryName} display={!cardDisplay && (skills.length>0 || proficiencies.length>0 || apotheoses.length>0)}/>
                <ButtonsRow cardDisplay={cardDisplay}>
                    {skills.map((skill: Skill) => {
                        const shouldDisplayButton = skill.dailyUse !== 0 || skill.dailyUseMax !== undefined;

                        if (!shouldDisplayButton) {
                            return null; // Skip rendering the button
                        }

                        return (
                            <CharacterButton
                                cardDisplay={cardDisplay}
                                key={skill.name}
                                description={skill.description}
                                name={
                                    (cardDisplay ? skill.shortName : skill.longName || skill.name) +
                                    (skill.dailyUse !== undefined ? ` (${skill.dailyUse}${skill.dailyUseMax !== undefined ? `/${skill.dailyUseMax}` : ''})` : '')
                                }
                                onClickBtn={() => {
                                    props.onClickSkill(skill);
                                }}
                            />
                        );
                    })}
                    {proficiencies.map((proficiency: Proficiency) => (
                        <CharacterButton
                            cardDisplay={cardDisplay}
                            selected={characterState.proficiencies.get(proficiency.name)}
                            key={proficiency.name}
                            description={proficiency.description}
                            name={cardDisplay ? proficiency.shortName :proficiency.name}
                            onClickBtn={() => {
                                props.onClickProficiency(proficiency.name)
                               /* updateState({
                                    ...characterState,
                                    proficiencies: characterState.proficiencies.set(proficiency.name, !characterState.proficiencies.get(proficiency.name))
                                })*/
                            }}
                        />
                    ))}
                    {apotheoses.map((apotheose: Apotheose) => (
                        <CharacterButton
                            cardDisplay={cardDisplay}
                            selected={character.apotheoseName === apotheose.name}
                            key={apotheose.name}
                            description={apotheose.description}
                            name={cardDisplay ? apotheose.shortName :apotheose.name}
                            onClickBtn={() => {
                                props.onClickApotheose(apotheose.name)
                                /*if(currentCharacter.apotheoseName === null) {
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
                                }*/
                            }}
                        />
                    ))}
                </ButtonsRow>
            </CharacterBlocks>
        )
    }



const ButtonsRow = styled.div<{ cardDisplay: boolean }>`
    display: ${(props) => (props.cardDisplay ? 'inline-flex' : 'flex')};
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: ${(props) => (props.cardDisplay ? '0px' : '4px')};
`;

const CharacterBlocks = styled.div`
   
`;