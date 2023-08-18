import React from 'react';
import styled from 'styled-components';
import { FaMinus, FaPlus } from 'react-icons/fa';
import {IconType} from "react-icons";
import { css } from 'styled-components';

interface CharacterButtonProps {
    cardDisplay: boolean;
    description?: string;
    column?: boolean;
    name: string;
    selected?: boolean;
    value?: number;
    maxValue?: number;
    bonusValue? : number;
    icon?: IconType;
    onClickDecr?: () => void;
    onClickBtn?: () => void;
    onClickIncr?: () => void;
}

export function CharacterButton(props: CharacterButtonProps) {
    const shouldDisplayIcon = props.value === 0 && props.icon;
    const isActionButton = props.selected === undefined;

    return (
        <MainContainer card={props.cardDisplay}>
            {props.onClickDecr && (
                <Change card={props.cardDisplay} left={true} onClick={props.onClickDecr}>
                    <FaMinus />
                </Change>
            )}
            <ButtonSelectable
                columnDisplay={props.column || false}
                cardDisplay={props.cardDisplay}
                isActionButton={isActionButton}
                selected={props.selected}
                title={props.description}
                onClick={props.onClickBtn}
            >
                {shouldDisplayIcon ? (
                    <IconContainer>
                        <span>&nbsp;</span>{React.createElement(props.icon!)}<span>&nbsp;</span></IconContainer>
                ) : (
                    <>
                    <ButtonName>{props.name}&nbsp;</ButtonName>
                        {props.value !== undefined && (
                            <div>
                                {props.value}
                                {props.bonusValue ? ` (+${props.bonusValue})` : ''}
                                {props.maxValue && ` / ${props.maxValue}`}
                            </div>
                        )}
                    </>
                )}
            </ButtonSelectable>
            {props.onClickIncr && (
                <Change card={props.cardDisplay} left={false} onClick={props.onClickIncr}>
                    <FaPlus />
                </Change>
            )}
        </MainContainer>
    );
}


const MainContainer = styled.div<{ card: boolean }>`
  display: flex;
  align-items: center;
  margin: ${(props) => (props.card ? '0' : '0 6px 0 6px;')};
`;

const Change = styled.div<{ card: boolean, left: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.card ? '8px' : '24px')};
  height: ${(props) => (props.card ? '8px' : '24px')};
  border-radius: 50%;
  background-color: #f0f0f0;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: perspective(1px) scale(1.02);
  transition: transform 0.3s ease;
  margin-right: ${(props) => (props.card ? (props.left ? '0px' : '4px') : (props.left ? '4px' : '8px'))};
  margin-left: ${(props) => (props.card ? (props.left ? '4px' : '0px') : (props.left ? '8px' : '4px'))};

  &:hover {
    transform: perspective(1px) scale(1.05);
  }
`;





const ButtonSelectable = styled.div<{ cardDisplay: boolean, columnDisplay: boolean, selected?: boolean, isActionButton: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.cardDisplay && props.columnDisplay ? 'column' : 'row')};
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  padding: ${(props) => (props.cardDisplay ? '2px' : '8px')};
  border-radius: ${(props) => (props.isActionButton ? '20px' : '4px')}; /* CTA: Highly rounded, Selectable: Slightly rounded */
  margin: 4px;
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: ${(props) => (props.selected ? '0 2px 4px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.2)')}; /* Selected: Darker shadow */
  transition: transform 0.3s ease, background-color 0.2s ease;

  /* Selected state for a selectable button */
  ${({ selected, isActionButton }) => selected && !isActionButton && css`
    background-color: #e0e0e0; /* Darker Grey for Selected State */
  `}

    /* Hover state */
  &:hover {
    background-color: #e6e6e6;
  }

  /* Active state */
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }
`;




const ButtonName = styled.div`
  font-weight: bold;
  margin: 2px 0 2px 0;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;