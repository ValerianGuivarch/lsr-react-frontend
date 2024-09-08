import React from "react";
import { Flip } from "../../domain/models/hp/Flip";
import { FaDiceD20 } from "react-icons/fa6";
import styled from "styled-components";

export interface FlipCardProps {
  flip: Flip;
}

export default function FlipCard(props: FlipCardProps) {
  return (
    <Container>
      <Avatar
        src={"/l7r/" + props.flip.wizardName + ".png"}
        alt={props.flip.wizardName}
      />
      <FlipDisplay>
        <span>{props.flip.text}</span>
        <Result>
          <FaDiceD20 size="1.5em" />
          <ResultValue>{getTextFromFlip(props.flip)}</ResultValue>
        </Result>
      </FlipDisplay>
    </Container>
  );
}

function getTextFromFlip(flip: Flip) {
  if (flip.base === 1) {
    return "Echec critique";
  } else if (flip.base === 20) {
    return "Succès critique";
  } else {
    return flip.base + "+" + flip.modif + "=" + flip.result;
  }
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
  object-fit: cover;
  object-position: center top;
`;

const FlipDisplay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Result = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

const ResultValue = styled.span`
  font-size: 1.5em;
  margin-left: 8px;
  font-weight: bold;
`;
