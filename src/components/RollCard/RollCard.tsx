import React from 'react';
// @ts-ignore
import s from './style.module.css';
import {Roll} from "../../domain/models/Roll";
import {FaDiceFive, FaDiceFour, FaDiceOne, FaDiceSix, FaDiceThree, FaDiceTwo} from 'react-icons/fa6';
import {SkillStat} from "../../domain/models/SkillStat";

function Dice(props: { value: number }) {
    const DiceIcon = [FaDiceOne, FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive, FaDiceSix][props.value - 1];

    return (
        <DiceIcon size="2em"/>
    );
}

export interface RollCardProps {
    roll: Roll
}

function getRollEffectText(roll: Roll) {
    let text = '(';
    if (roll.bonus > 0) {
        text += `${roll.bonus}b, `;
    }
    if (roll.malus > 0) {
        text += `${roll.malus}m, `;
    }
    if (roll.focus) {
        text += 'pf, ';
    }
    if (roll.power) {
        text += 'pp, ';
    }
    if (roll.proficiency) {
        text += 'h, ';
    }
    if (text !== '(') {
        text = text.slice(0, -2); // Supprime la virgule et l'espace en trop à la fin
        text += ')';
    } else {
        text = '';
    }
    return text;
}

export default function RollCard(props: RollCardProps) {
    const roll = props.roll
    const displayParts = roll.display.split('*');
    return <div className={s.container}>
        <img className={s.avatar} src={props.roll.picture} alt={props.roll.rollerName}/>
        <div className={s.rollDisplay}>
            <div className={s.textPartOne}>
                <span>{roll.secret ? '(secret) ' : ''} </span>
                <span><b>{roll.rollerName.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')} </b></span>
                <span>
                {displayParts.map((part, index) => {
                    if (index % 2 === 1) {
                        // Met en gras le texte entre les astérisques
                        return <em key={index}>{part}</em>;
                    } else {
                        return <span key={index}>{part}</span>;
                    }
                })}
    </span>
                <span>
                {getRollEffectText(roll)}
            </span>
                {
                    roll.success !== null ? <span>
                        {' et obtient '}
                        <em>{roll.success}</em>

                        {' succès.'}
                    </span> : '.'
                }
            </div>
            {
                roll.displayDices && <div className={s.dicesDisplay}>
                    {
                        roll.result.map((dice, index) => {
                            if(roll.stat === SkillStat.CHAIR || roll.stat === SkillStat.ESPRIT || roll.stat === SkillStat.ESSENCE)
                                return <Dice value={dice} key={index}/>
                            else if(roll.stat === SkillStat.EMPIRIQUE)
                                return <span key={index}>[{dice}]</span>
                        })
                    }
                </div>
            }
        </div>

    </div>
}