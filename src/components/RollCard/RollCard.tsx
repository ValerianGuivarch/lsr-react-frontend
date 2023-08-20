import React from 'react';
import {Roll} from "../../domain/models/Roll";
import {FaDiceFive, FaDiceFour, FaDiceOne, FaDiceSix, FaDiceThree, FaDiceTwo} from 'react-icons/fa6';
import {SkillStat} from "../../domain/models/SkillStat";
import styled from "styled-components";
import {UtilsRules} from "../../utils/UtilsRules";


function Dice(props: { value: number }) {
    const DiceIcon = [FaDiceOne, FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive, FaDiceSix][props.value - 1];

    return <DiceIcon size="2em"/>;
}


export interface RollCardProps {
    roll: Roll,
    mjDisplay: boolean,
    originRoll?: Roll,
    clickOnResist?: (p:{stat: "chair"|"esprit"|"essence",
                     resistRoll: string}) => void
    clickOnSubir?: (p:{roll: Roll, originRoll?: Roll}) => void
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
    return (
        <Container>
            <Avatar src={props.roll.picture} alt={props.roll.rollerName}/>
            <RollDisplay>
                <TextPartOne>
                    <span>{roll.secret ? '(secret) ' : ''} </span>
                    <span>
                        <b>
                            {roll.rollerName
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ') + ' '
                            }
                        </b>
                    </span>
                    <span>
                        {
                            displayParts.map((part, index) => {
                                if (index % 2 === 1) {
                                    return <em key={index}>{part}</em>;
                                } else {
                                    return <span key={index}>{part}</span>;
                                }
                            })
                        }
                    </span>
                    <span>
                        {getRollEffectText(roll)}
                    </span>
                    {
                        roll.stat === SkillStat.CUSTOM
                            ? <span>
            <em>{roll.data}</em>
                                {'.'}
          </span>
                            : roll.success !== null
                                ? <span>
                {' et obtient '}
                                    <em>{roll.success}</em>
                                    {' succès.'}
              </span>
                                : '.'
                    }

                    {
                        (roll.stat && props.clickOnResist && (roll.stat === SkillStat.CHAIR || roll.stat === SkillStat.ESPRIT || roll.stat === SkillStat.ESSENCE)) &&
                        <>
                            [<ClickableStat onClick={() => props.clickOnResist && props.clickOnResist({stat:"chair", resistRoll:roll.id})}>R-Chair</ClickableStat>]
                            [<ClickableStat onClick={() => props.clickOnResist && props.clickOnResist({stat:"esprit", resistRoll:roll.id})}>R-Esprit</ClickableStat>]
                            [<ClickableStat onClick={() => props.clickOnResist && props.clickOnResist({stat:"essence", resistRoll:roll.id})}>R-Essence</ClickableStat>]
                        </>
                    }
                    {
                        (roll.stat && props.clickOnSubir && (roll.stat === SkillStat.CHAIR || roll.stat === SkillStat.ESPRIT || roll.stat === SkillStat.ESSENCE)) &&
                        <>
                            [<ClickableStat onClick={() => props.clickOnSubir && props.clickOnSubir({roll:roll, originRoll:props.originRoll})}>Subir {UtilsRules.getDegats(roll, props.originRoll)}</ClickableStat>]
                        </>
                    }
                </TextPartOne>
                {
                    (roll.displayDices || props.mjDisplay) && <DicesDisplay>
                        {
                            roll.result.map((dice, index) => {
                                if (roll.stat === SkillStat.CHAIR || roll.stat === SkillStat.ESPRIT || roll.stat === SkillStat.ESSENCE)
                                    return <Dice value={dice} key={index}/>
                                else if (roll.stat === SkillStat.EMPIRIQUE || roll.stat === SkillStat.CUSTOM)
                                    return <span key={index}>[{dice}]</span>
                            })
                        }
                    </DicesDisplay>
                }
                <Rolls>
                    {roll.resistRolls && roll.resistRolls.map((subRoll: Roll) => (
                        <div key={subRoll.id}>
                            <RollCard mjDisplay={props.mjDisplay} roll={subRoll} originRoll={roll} clickOnResist={undefined} clickOnSubir={props.clickOnSubir}/>
                        </div>
                    ))}
                </Rolls>
            </RollDisplay>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  border-top: 1px solid #ccc;
  padding: 6px 6px 2px 6px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
`;

const RollDisplay = styled.div`
`;

const TextPartOne = styled.div`
`;

const DicesDisplay = styled.div`
`;

const ClickableStat = styled.span`
  color: #007BFF;  // Typical hyperlink blue color
  font-weight: bold;
  text-decoration: none;  // Links might not always be underlined
  cursor: pointer;

  &:hover {
    color: #0056b3;  // Darken the color a bit on hover
    text-decoration: underline;
  }

  &:active {
    color: #004085;  // Further darken for active state
  }
`;


const Rolls = styled.div`
`;



