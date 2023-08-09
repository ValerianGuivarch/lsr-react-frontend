import React, {useEffect, useState} from 'react';
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {setCharacter, setState} from "../../data/store/character-slice";
import CharacterBanner from "../../components/Character/CharacterBanner/CharacterBanner";
import CharacterNotes from "../../components/Character/CharacterNotes/CharacterNotes";
import {MutableCharacterButton} from "../../components/Character/CharacterButtons/MutableCharacterButton";
import {UnmutableCharacterButton} from "../../components/Character/CharacterButtons/UnmutableCharacterButton";
import {setRolls} from "../../data/store/rolls-slice";
import RollCard from "../../components/RollCard/RollCard";
import {Roll} from "../../domain/models/Roll";
import {Character} from "../../domain/models/Character";
import {Skill} from "../../domain/models/Skill";
import {CharacterState} from "../../domain/models/CharacterState";
import {useSSERolls} from "../../data/useSSERolls";
import {useSSECharacterByName} from "../../data/useSSECharacterByName";
import {ApiL7RProvider} from "../../data/api/ApiL7RProvider";
import {DisplayCategory} from "../../domain/models/DisplayCategory";
import ReactModal from 'react-modal';
import {Apotheose} from "../../domain/models/Apotheose";
import {UtilsString} from "../../utils/UtilsString";

export function CharacterSheet() {
    const dispatch = useDispatch();
    const {characterName} = useParams();
    const [empiriqueValue, setEmpiriqueValue] = useState('1d6');
    const [restValue, setRestValue] = useState<number>(0);
    const [longRestValue, setLongRestValue] = useState<number>(0);
    const [apotheoseValue, setApotheoseValue] = useState<number>(0);
    const [isEmpiriqueModalOpen, setIsEmpiriqueModalOpen] = useState(false);
    const [isRestModalOpen, setIsRestModalOpen] = useState(false);
    const [isLongRestModalOpen, setIsLongRestModalOpen] = useState(false);
    const [isApotheoseModalOpen, setIsApotheoseModalOpen] = useState(false);

    async function fetchCurrentCharacter() {
        const currentCharacter = await ApiL7RProvider.getCharacterByName(characterName ? characterName : '');
        dispatch(setCharacter(currentCharacter));
    }

    async function fetchRolls(): Promise<void> {
        const rolls = await ApiL7RProvider.getRolls();
        dispatch(setRolls(rolls));
    }
    const handleEmpiriqueClick = () => {
        setIsEmpiriqueModalOpen(true);
    };
    const handleEmpiriqueDialogClose = () => {
        setIsEmpiriqueModalOpen(false);
    };
    const handleEmpiriqueDialogConfirm = () => {
        setIsEmpiriqueModalOpen(false);
        sendRoll('empirique', empiriqueValue);
    }

    const handleRestClick = () => {
        setRestValue(currentCharacter.rest);
        setIsRestModalOpen(true);
    };
    const handleRestDialogConfirm = () => {
        setIsRestModalOpen(false);
    }

    async function handleApotheoseClick(apotheoseName: string): Promise<void> {
        ApiL7RProvider.updateCharacter( {
            ...currentCharacter,
            apotheoseName: apotheoseName
        }).then(() => {
        })
    }
    const handleLongRestClick = () => {
        ApiL7RProvider.updateCharacter({
            ...currentCharacter,
            pv: currentCharacter.pvMax,
            pf: currentCharacter.pfMax,
            pp: currentCharacter.ppMax
        }).then(() => {
        })
        setLongRestValue(currentCharacter.longRest);
        setIsLongRestModalOpen(true);
    };
    const handleLongRestDialogConfirm = () => {
        setIsLongRestModalOpen(false);
    }

    useEffect(() => {
        fetchCurrentCharacter().then(() => {
        });
        fetchRolls().then(() => {
        });
    }, []);

    useSSERolls();
    useSSECharacterByName({
        name: characterName ? characterName : 'viktor',
    });

    const loadingCharacter: boolean = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.loading
    );
    const currentCharacter: Character = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.character
    );
    const state: CharacterState = useSelector((store) =>
        // @ts-ignore
        store.CHARACTER.state
    );
    const rolls: Roll[] = useSelector((store) =>
        // @ts-ignore
        store.ROLLS.rolls
    );

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

    function Separator(props: { text: string }) {
        return (
            <div className={s.separator}>
                <hr className={s.line}/>
                <span className={s.text}>{props.text}</span>
                <hr className={s.line}/>
            </div>
        );
    }

    return (
        <>
            {loadingCharacter ? (
                <p>Loading...</p>
            ) : (
                <div className={s.main_container}>
                    <CharacterBanner/>
                    <CharacterNotes/>
                    {currentCharacter.apotheoseName && (
                    <div className={s.characterApotheose}>
                        {UtilsString.capitalize(currentCharacter.apotheoseName)}
                    </div>
                        )}
                    <div className={s.characterBlocks}>
                        <Separator text={"Stats"}/>
                        <div className={s.column}>
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
                        </div>
                        <div className={s.column}>
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
                        </div>
                        <div className={s.column}>
                            <div className={s.buttons_row}>
                                <MutableCharacterButton
                                    name={"pv"}
                                    selected={false}
                                    value={currentCharacter.pv}
                                    maxValue={currentCharacter.pvMax}
                                    onClickIncr={() => {
                                        ApiL7RProvider.updateCharacter( {
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
                                        // jet de sauv vs la mort si 0
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
                        </div>
                        <div className={s.column}>
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
                        </div>
                        <div className={s.column}>
                            <div className={s.buttons_row}>
                                <
                                    UnmutableCharacterButton
                                    name={"empirique"}
                                    onClick={handleEmpiriqueClick}
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
                                    onClick={handleRestClick}
                                />
                                <
                                    UnmutableCharacterButton
                                    name={"repos long"}
                                    onClick={handleLongRestClick}
                                />
                            </div>
                        </div>

                    </div>
                    <div className={s.characterBlocks}>
                        {currentCharacter && Character.hasDisplayCategory(currentCharacter, DisplayCategory.MAGIE) && (
                            <div>
                                <Separator
                                    text={"Magie"}/>
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
                                                dispatch(setState({...state, proficiencies: state.proficiencies.set(skill.name, !state.proficiencies.get(skill.name))}));
                                            }}
                                        />
                                    ))}
                                    {Character.getApotheoses(currentCharacter, DisplayCategory.MAGIE).map((apotheose: Apotheose) => (
                                        <UnmutableCharacterButton
                                            selected={currentCharacter.apotheoseName === apotheose.name}
                                            key={apotheose.name}
                                            name={apotheose.name}
                                            onClick={() => handleApotheoseClick(apotheose.name)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={s.characterBlocks}>
                        {currentCharacter && Character.hasDisplayCategory(currentCharacter, DisplayCategory.ARCANES) && (
                            <div>
                                <Separator
                                    text={"Arcanes " + currentCharacter.arcanes + " / " + currentCharacter.arcanesMax}/>
                                <div className={s.buttons_row} >
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
                                                dispatch(setState({...state, proficiencies: state.proficiencies.set(skill.name, !state.proficiencies.get(skill.name))}));
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={s.rolls}>
                        {rolls.map((roll: Roll) => (
                            <div key={roll.id}>
                                <RollCard roll={roll}/>
                            </div>
                        ))}
                    </div>
                    <ReactModal
                        className={s.modalEmpirique}
                        isOpen={isEmpiriqueModalOpen}
                        onRequestClose={handleEmpiriqueDialogClose}
                        contentLabel="Jet Empirique"
                    >
                        <div className={s.modalEmpiriqueTitle}>Jet Empirique</div>
                        <input
                            type="text"
                            value={empiriqueValue}
                            onChange={(e) => setEmpiriqueValue(e.target.value)}
                        />
                        <div className={s.modalEmpiriqueButtonValidation} onClick={handleEmpiriqueDialogConfirm}>Valider</div>
                        <div className={s.modalEmpiriqueButtonCancel} onClick={handleEmpiriqueDialogClose}>Annuler</div>
                    </ReactModal>
                    <ReactModal
                        className={s.modalEmpirique}
                        isOpen={isRestModalOpen}
                        onRequestClose={handleRestDialogConfirm}
                        contentLabel="Repos"
                    >
                        <div className={s.modalEmpiriqueTitle}>Repos : {restValue} / {currentCharacter.rest}</div>
                        <button onClick={() => {
                            if(currentCharacter.pv < currentCharacter.pvMax && restValue > 0) {
                                setRestValue(restValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pv: currentCharacter.pv + 1
                                }).then(() => {
                                })
                            }
                        }}>PV : {currentCharacter.pv} / {currentCharacter.pvMax}</button>
                        <button onClick={() => {
                            if(currentCharacter.pf < currentCharacter.pfMax && restValue > 0) {
                                setRestValue(restValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pf: currentCharacter.pf + 1
                                }).then(() => {
                                })
                            }
                        }}>PF : {currentCharacter.pf} / {currentCharacter.pfMax}</button>
                        <button onClick={() => {
                            if(currentCharacter.pp < currentCharacter.ppMax && restValue > 0) {
                                setRestValue(restValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pp: currentCharacter.pp + 1
                                }).then(() => {
                                })
                            }
                        }}>PP : {currentCharacter.pp} / {currentCharacter.ppMax}</button>
                        <div className={s.modalEmpiriqueButtonValidation} onClick={handleRestDialogConfirm}>Valider</div>
                    </ReactModal>
                    <ReactModal
                        className={s.modalEmpirique}
                        isOpen={isLongRestModalOpen}
                        onRequestClose={handleLongRestDialogConfirm}
                        contentLabel="Repos Long"
                    >
                        <div className={s.modalEmpiriqueTitle}>Repos : {longRestValue} / {currentCharacter.longRest}</div>
                        <button onClick={() => {
                            if(currentCharacter.pv > 0 && longRestValue > 0) {
                                setLongRestValue(longRestValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pv: currentCharacter.pv - 1
                                }).then(() => {
                                })
                            }
                        }}>PV : {currentCharacter.pv} / {currentCharacter.pvMax}</button>
                        <button onClick={() => {
                            if(currentCharacter.pf > 0 && longRestValue > 0) {
                                setLongRestValue(longRestValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pf: currentCharacter.pf - 1
                                }).then(() => {
                                })
                            }
                        }}>PF : {currentCharacter.pf} / {currentCharacter.pfMax}</button>
                        <button onClick={() => {
                            if(currentCharacter.pp > 0 && longRestValue > 0) {
                                setLongRestValue(longRestValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pp: currentCharacter.pp - 1
                                }).then(() => {
                                })
                            }
                        }}>PP : {currentCharacter.pp} / {currentCharacter.ppMax}</button>
                        <div className={s.modalEmpiriqueButtonValidation} onClick={handleLongRestDialogConfirm}>Valider</div>
                    </ReactModal>
                    <ReactModal
                        className={s.modalEmpirique}
                        isOpen={isApotheoseModalOpen}
                        onRequestClose={() => {}}
                        contentLabel="Apotheose"
                    >
                        <div className={s.modalEmpiriqueTitle}>Repos : {apotheoseValue}</div>
                        <button onClick={() => {
                            if(currentCharacter.pv < currentCharacter.pvMax && apotheoseValue > 0) {
                                setApotheoseValue(apotheoseValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pv: currentCharacter.pv + 1
                                }).then(() => {
                                })
                            }
                        }}>PV : {currentCharacter.pv} / {currentCharacter.pvMax}</button>
                        <button onClick={() => {
                            if(currentCharacter.pf < currentCharacter.pfMax && apotheoseValue > 0) {
                                setApotheoseValue(apotheoseValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pf: currentCharacter.pf + 1
                                }).then(() => {
                                })
                            }
                        }}>PF : {currentCharacter.pf} / {currentCharacter.pfMax}</button>
                        <button onClick={() => {
                            if(currentCharacter.pp < currentCharacter.ppMax && apotheoseValue > 0) {
                                setApotheoseValue(apotheoseValue - 1);
                                ApiL7RProvider.updateCharacter({
                                    ...currentCharacter,
                                    pp: currentCharacter.pp + 1
                                }).then(() => {
                                })
                            }
                        }}>PP : {currentCharacter.pp} / {currentCharacter.ppMax}</button>
                        <div className={s.modalEmpiriqueButtonValidation} onClick={() => {}}>Valider</div>
                    </ReactModal>
                </div>

            )}
        </>
    );

}
