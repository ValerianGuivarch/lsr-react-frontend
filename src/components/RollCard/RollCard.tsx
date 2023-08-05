import React from 'react';
// @ts-ignore
import s from './style.module.css';
import {Roll} from "../../domain/models/Roll";
import {
    FaDiceD6,
    FaDiceFive,
    FaDiceFour,
    FaDiceOne,
    FaDiceSix,
    FaDiceThree,
    FaDiceTwo
} from 'react-icons/fa6';

function Dice(props: { value: number }) {
    const DiceIcon = [FaDiceOne, FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive, FaDiceSix][props.value-1];

    return (
        <DiceIcon size="2em" />
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
    return <div className={s.container}>
        <img className={s.avatar} src={props.roll.picture} alt={props.roll.rollerName}/>
        <div className={s.rollDisplay}>
            <div className={s.textPartOne}>
            <span>{roll.secret ? '(secret) ' : ''} </span>
            <span><b>{roll.rollerName.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')} </b></span>
            <span>
      {' fait un '}
                <em>{roll.display}</em>
    </span>
            <span>
                {getRollEffectText(roll)}
            </span>
            {
                roll.success ? <span>
                        {' et obtient '}
                        <em>{roll.success}</em>

                    {' succès '}
                    </span> : ''
        }
        </div>
        <div className={s.dicesDisplay}>
            {roll.result.map((dice, index) => {
                return dice.toString() + ' '
            })}
            {
                roll.result.map((dice, index) => {
                    return <Dice value={dice} key={index} />
                })
            }
        </div>
        </div>

    </div>
}