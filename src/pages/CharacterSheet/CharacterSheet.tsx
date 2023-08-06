import React, {useEffect} from 'react';
// @ts-ignore
import s from './style.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {L7RApi} from "../../data/L7RApi";
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
import {SelectableCharacterButton} from "../../components/Character/CharacterButtons/SelectableCharacterButton";
import {CharacterState} from "../../domain/models/CharacterState";

export function CharacterSheet() {
    const dispatch = useDispatch();
    const {characterName} = useParams();

    async function fetchCurrentCharacter() {
        const currentCharacter = await L7RApi.getCharacterByName(characterName ? characterName : '');
        dispatch(setCharacter(currentCharacter));
    }

    async function fetchRolls() {
        const rolls = await L7RApi.getRolls();
        dispatch(setRolls(rolls));
    }

    useEffect(() => {
        fetchCurrentCharacter().then(r => {
        });
        fetchRolls().then(r => {
        });
    }, []);

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

    function sendRoll(skillName: string) {
        L7RApi.sendRoll(skillName, currentCharacter.name).then((response) => {
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
                    <div className={s.characterBlocks}>
                        <Separator text={"Stats"}/>
                        <div className={s.column}>
                            <div className={s.buttons_row}>
                                <UnmutableCharacterButton
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
                                <MutableCharacterButton
                                    name={"pv"}
                                    selected={false}
                                    value={currentCharacter.pv}
                                    maxValue={currentCharacter.pvMax}
                                    onClickIncr={() => {
                                        L7RApi.updateCharacter({
                                            ...currentCharacter,
                                            pv: currentCharacter.pv + 1
                                        }).then(r => {})
                                    }}
                                    onClickDecr={() => {
                                        L7RApi.updateCharacter({
                                            ...currentCharacter,
                                            pv: currentCharacter.pv - 1
                                        }).then(r => {})
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
                                        L7RApi.updateCharacter({
                                            ...currentCharacter,
                                            pf: currentCharacter.pf + 1
                                        }).then(r => {})
                                    }}
                                    onClickDecr={() => {
                                        L7RApi.updateCharacter({
                                            ...currentCharacter,
                                            pf: currentCharacter.pf - 1
                                        }).then(r => {})
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
                                        L7RApi.updateCharacter({
                                            ...currentCharacter,
                                            pp: currentCharacter.pp + 1
                                        }).then(r => {})
                                    }}
                                    onClickDecr={() => {
                                        L7RApi.updateCharacter({
                                            ...currentCharacter,
                                            pp: currentCharacter.pp - 1
                                        }).then(r => {})
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
                                        dispatch(setState({...state, bonus: state.malus + 1}));
                                    }}
                                    onClickDecr={() => {
                                        dispatch(setState({...state, bonus: state.malus - 1}));
                                    }}/>
                                <MutableCharacterButton
                                    name={"dettes"}
                                    selected={false}
                                    value={currentCharacter.dettes}
                                    onClickIncr={() => {
                                        L7RApi.updateCharacter({
                                            ...currentCharacter,
                                            dettes: currentCharacter.dettes + 1
                                        }).then(r => {})
                                    }}
                                    onClickDecr={() => {
                                        L7RApi.updateCharacter({
                                            ...currentCharacter,
                                            dettes: currentCharacter.dettes - 1
                                        }).then(r => {})
                                    }}/>
                            </div>
                        </div>
                    </div>
                    <div className={s.characterBlocks}>
                        {currentCharacter && currentCharacter.getArcaniqueSkills().length > 0 && (currentCharacter.getArcaniqueSkills().map((skill: Skill) => (
                            <div className={s.main_container_buttons} key={skill.name}>
                                <Separator
                                    text={"Arcanes " + currentCharacter.arcanes + " / " + currentCharacter.arcanesMax}/>
                                <div className={s.column}>
                                    <div className={s.buttons_row}>
                                        <UnmutableCharacterButton
                                            name={skill.name}
                                            onClick={() => {
                                                sendRoll(skill.name);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )))}
                    </div>
                    <div className={s.rolls}>
                        {rolls.map((roll: Roll) => (
                            <div key={roll.id}>
                            <RollCard roll={roll}/>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );

}
