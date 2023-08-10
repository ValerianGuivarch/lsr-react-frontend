import React, {useState} from 'react';
// @ts-ignore
import style_classic from './style.module.css';
// @ts-ignore
import style_mj from './style_mj.module.css';
import {Character} from "../../../domain/models/Character";
import {useDispatch, useSelector} from "react-redux";
import {UtilsString} from "../../../utils/UtilsString";
import {UnmutableCharacterButton} from "../CharacterButtons/UnmutableCharacterButton";
import {setState} from "../../../data/store/character-slice";
import {MutableCharacterButton} from "../CharacterButtons/MutableCharacterButton";
import {ApiL7RProvider} from "../../../data/api/ApiL7RProvider";
import {CharacterState} from "../../../domain/models/CharacterState";
import {DisplayCategory} from "../../../domain/models/DisplayCategory";
import {Skill} from "../../../domain/models/Skill";
import {Apotheose} from "../../../domain/models/Apotheose";
import {RestModal} from "./RestModal";
import {LongRestModal} from "./LongRestModal";
import {EmpiriqueRollModal} from "./EmpiriqueRollModal";
import {Separator} from "./Separator";

export function CharacterPanel(props : {
    mj: boolean
}) {
    const s = props.mj ? style_mj : style_classic;
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
        <div className={s.main_container_buttons}>
            <div>
                {currentCharacter.apotheoseName && (
                    <div className={s.characterApotheose}>
                        {UtilsString.capitalize(currentCharacter.apotheoseName)}
                    </div>
                )}
            </div>
            <div className={s.characterBlocks}>
                    <Separator text={"Stats"}/>
                <div className={s.buttons_row}>
                    <
                        UnmutableCharacterButton
                        name={"chair"}
                        value={currentCharacter.chair}
                        onClick={() => {
                            sendRoll("chair");
                        }}
                    />
                    <UnmutableCharacterButton
                        name={"esprit"}
                        value={currentCharacter.esprit}
                        onClick={() => {
                            sendRoll("esprit");
                        }}
                    />
                    <UnmutableCharacterButton
                        name={"essence"}
                        value={currentCharacter.essence}
                        onClick={() => {
                            sendRoll("essence");
                        }}
                    />
                </div>
                <div className={s.buttons_row}>
                    <
                        UnmutableCharacterButton
                        name={"lux"}
                        selected={state.lux}
                        onClick={() => {
                            dispatch(setState({...state, lux: !state.lux}));
                        }}
                    />
                    <
                        UnmutableCharacterButton
                        name={"umbra"}
                        selected={state.umbra}
                        onClick={() => {
                            dispatch(setState({...state, umbra: !state.umbra}));
                        }}
                    /><
                    UnmutableCharacterButton
                    name={"secunda"}
                    selected={state.secunda}
                    onClick={() => {
                        dispatch(setState({...state, secunda: !state.secunda}));
                    }}
                />
                </div>
                <div className={s.buttons_row}>
                    <MutableCharacterButton
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
                    <MutableCharacterButton
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
                    <MutableCharacterButton
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
                </div>
                <div className={s.buttons_row}>
                    <MutableCharacterButton
                        name={"bonus"}
                        selected={false}
                        value={state.bonus}
                        onClickIncr={() => {
                            dispatch(setState({...state, bonus: state.bonus + 1}));
                        }}
                        onClickDecr={() => {
                            dispatch(setState({...state, bonus: state.bonus - 1}));
                        }}/>
                    <MutableCharacterButton
                        name={"malus"}
                        selected={false}
                        value={state.malus}
                        onClickIncr={() => {
                            dispatch(setState({...state, malus: state.malus + 1}));
                        }}
                        onClickDecr={() => {
                            dispatch(setState({...state, malus: state.malus - 1}));
                        }}/>
                    <MutableCharacterButton
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
                </div>
                <div className={s.buttons_row}>
                    <
                        UnmutableCharacterButton
                        name={"empirique"}
                        onClick={() => {
                            setIsEmpiriqueRollModalOpen(true);
                        }}
                    />
                    <
                        UnmutableCharacterButton
                        name={"secret"}
                        selected={state.secret}
                        onClick={() => {
                            dispatch(setState({...state, secret: !state.secret}));
                        }}
                    />
                    <
                        UnmutableCharacterButton
                        name={"repos"}
                        onClick={() => {
                            setIsRestModalOpen(true);
                        }}
                    />
                    <
                        UnmutableCharacterButton
                        name={"repos long"}
                        onClick={() => {
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
                </div>
            </div>

            {Character.hasDisplayCategory(currentCharacter, DisplayCategory.MAGIE) && (
                <div className={s.characterBlocks}>
                        <Separator text={"Magie"}/>
                    <div className={s.buttons_row}>
                        {Character.getSkills(currentCharacter, DisplayCategory.MAGIE).map((skill: Skill) => (
                            <UnmutableCharacterButton
                                key={skill.name}
                                name={skill.name}
                                onClick={() => {
                                    sendRoll(skill.name);
                                }}
                            />
                        ))}
                        {Character.getProficiencies(currentCharacter, DisplayCategory.MAGIE).map((skill: Skill) => (
                            <UnmutableCharacterButton
                                selected={state.proficiencies.get(skill.name)}
                                key={skill.name}
                                name={skill.name}
                                onClick={() => {
                                    dispatch(setState({
                                        ...state,
                                        proficiencies: state.proficiencies.set(skill.name, !state.proficiencies.get(skill.name))
                                    }));
                                }}
                            />
                        ))}
                        {Character.getApotheoses(currentCharacter, DisplayCategory.MAGIE).map((apotheose: Apotheose) => (
                            <UnmutableCharacterButton
                                selected={currentCharacter.apotheoseName === apotheose.name}
                                key={apotheose.name}
                                name={apotheose.name}
                                onClick={() => {
                                    ApiL7RProvider.updateCharacter({
                                        ...currentCharacter,
                                        apotheoseName: apotheose.name
                                    }).then(() => {
                                    })
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
            {Character.hasDisplayCategory(currentCharacter, DisplayCategory.ARCANES) && (
                <div className={s.characterBlocks}>
                        <Separator text={"Arcanes " + currentCharacter.arcanes + " / " + currentCharacter.arcanesMax}/>
                    <div className={s.buttons_row}>
                        {Character.getSkills(currentCharacter, DisplayCategory.ARCANES).map((skill: Skill) => (
                            <UnmutableCharacterButton
                                key={skill.name}
                                name={skill.name}
                                onClick={() => {
                                    sendRoll(skill.name);
                                }}
                            />
                        ))}
                        {Character.getProficiencies(currentCharacter, DisplayCategory.ARCANES).map((skill: Skill) => (
                            <UnmutableCharacterButton
                                key={skill.name}
                                selected={state.proficiencies.get(skill.name)}
                                name={skill.name}
                                onClick={() => {
                                    dispatch(setState({
                                        ...state,
                                        proficiencies: state.proficiencies.set(skill.name, !state.proficiencies.get(skill.name))
                                    }));
                                }}
                            />
                        ))}
                    </div>
                </div>
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
        </div>
    )
}
