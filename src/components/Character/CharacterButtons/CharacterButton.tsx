import React from 'react';
import styled from 'styled-components';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface CharacterButtonProps {
    name: string;
    selected?: boolean;
    value?: number;
    maxValue?: number;
    onClickDecr?: () => void;
    onClickBtn?: () => void;
    onClickIncr?: () => void;
}

export const CharacterButton: React.FC<CharacterButtonProps> = (
    {
       name,
       selected,
       value,
       maxValue,
       onClickDecr,
       onClickBtn,
       onClickIncr
    }) => {

    return (
        <MainContainer>
            {onClickDecr && (
                <Change onClick={onClickDecr}>
                    <FaMinus />
                </Change>
            )}
            <ButtonSelectable
                selected={selected}
                onClick={onClickBtn}
            >
                <ButtonName>{name}</ButtonName>
                {value && (
                    <div>
                        {value}
                        {maxValue && ` / ${maxValue}`}
                    </div>
                )}
            </ButtonSelectable>
            {onClickIncr && (
                <Change onClick={onClickIncr}>
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

const Change = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: perspective(1px) scale(1.02);
  transition: transform 0.3s ease;

  &:hover {
    transform: perspective(1px) scale(1.05);
  }
`;

const ButtonSelectable = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  margin-right: 8px;
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
  margin-right: 4px;
`;
