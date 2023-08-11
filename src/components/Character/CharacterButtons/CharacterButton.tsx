import React from 'react';
import styled from 'styled-components';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface CharacterButtonProps {
    cardDisplay: boolean;
    column?: boolean;
    name: string;
    selected?: boolean;
    value?: number;
    maxValue?: number;
    onClickDecr?: () => void;
    onClickBtn?: () => void;
    onClickIncr?: () => void;
}

export function CharacterButton(props: CharacterButtonProps) {
    return (
        <MainContainer>
            {props.onClickDecr && (
                <Change cardDisplay={props.cardDisplay} left={true} onClick={props.onClickDecr}>
                    <FaMinus />
                </Change>
            )}
            <ButtonSelectable
                columnDisplay={props.column || false}
                cardDisplay={props.cardDisplay}
                selected={props.selected}
                onClick={props.onClickBtn}
            >
                <ButtonName>{props.name}&nbsp; </ButtonName>
                {props.value && (
                    <div>
                        {props.value}
                        {props.maxValue && ` / ${props.maxValue}`}
                    </div>
                )}
            </ButtonSelectable>
            {props.onClickIncr && (
                <Change cardDisplay={props.cardDisplay} left={false} onClick={props.onClickIncr}>
                    <FaPlus />
                </Change>
            )}
        </MainContainer>
    );
};


const MainContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Change = styled.div<{ cardDisplay: boolean, left: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.cardDisplay ? '8px' : '24px')};
  height: ${(props) => (props.cardDisplay ? '8px' : '24px')};
  border-radius: 50%;
  background-color: #f0f0f0;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: perspective(1px) scale(1.02);
  transition: transform 0.3s ease;
  margin-right: ${(props) => (props.cardDisplay ? (props.left ? '0px' : '4px') : (props.left ? '4px' : '8px'))};
  margin-left: ${(props) => (props.cardDisplay ? (props.left ? '4px' : '0px') : (props.left ? '8px' : '4px'))};

  &:hover {
    transform: perspective(1px) scale(1.05);
  }
`;




const ButtonSelectable = styled.div<{ cardDisplay: boolean, columnDisplay: boolean, selected?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.cardDisplay && props.columnDisplay ? 'column' : 'row')};
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  padding: ${(props) => (props.cardDisplay ? '2px' : '8px')};
  border-radius: 4px;
  margin: 4px;
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: perspective(1px) scale(1.02);
  transition: transform 0.3s ease;

  ${({ selected }) => selected && `background-color: #ccc;`}

  &:hover {
    transform: perspective(1px) scale(1.05);
  }
`;

const ButtonName = styled.div`
  font-weight: bold;
  margin: 2px 0 2px 0;
`;