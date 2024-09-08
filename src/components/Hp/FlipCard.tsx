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
          <ResultValue flipResult={getFinalResult(props.flip)}>
            {getTextFromFlip(props.flip)}
          </ResultValue>
        </Result>
      </FlipDisplay>
    </Container>
  );
}

// Nouvelle fonction pour obtenir le résultat final en fonction de la difficulté
function getFinalResult(flip: Flip): number {
  if (flip.difficulty === "AVANTAGE") {
    return Math.max(flip.result, flip.resultBis ?? flip.result);
  } else if (flip.difficulty === "DESAVANTAGE") {
    return Math.min(flip.result, flip.resultBis ?? flip.result);
  } else {
    return flip.result;
  }
}

function getTextFromFlip(flip: Flip) {
  let resultText;

  // Affichage du résultat selon la difficulté
  if (flip.difficulty === "NORMAL") {
    resultText = <BoldText>{flip.result}</BoldText>;
  } else if (flip.difficulty === "AVANTAGE") {
    const highestResult = Math.max(flip.result, flip.resultBis ?? flip.result);

    // On garde flip.resultBis en premier mais on stylise en fonction de la plus grande valeur
    resultText = (
      <span>
        (
        {flip.resultBis === highestResult ? (
          <BoldText>{flip.resultBis}</BoldText>
        ) : (
          <NonBoldText>{flip.resultBis}</NonBoldText>
        )}{" "}
        |{" "}
        {flip.result === highestResult ? (
          <BoldText>{flip.result}</BoldText>
        ) : (
          <NonBoldText>{flip.result}</NonBoldText>
        )}
        )
      </span>
    );
  } else if (flip.difficulty === "DESAVANTAGE") {
    const lowestResult = Math.min(flip.result, flip.resultBis ?? flip.result);

    // On garde flip.resultBis en premier mais on stylise en fonction de la plus petite valeur
    resultText = (
      <span>
        (
        {flip.resultBis === lowestResult ? (
          <BoldText>{flip.resultBis}</BoldText>
        ) : (
          <NonBoldText>{flip.resultBis}</NonBoldText>
        )}{" "}
        |{" "}
        {flip.result === lowestResult ? (
          <BoldText>{flip.result}</BoldText>
        ) : (
          <NonBoldText>{flip.result}</NonBoldText>
        )}
        )
      </span>
    );
  }

  // Ajouter le modificateur et le résultat final
  return (
    <span>
      {resultText} + <BoldText>{flip.modif}</BoldText> ={" "}
      <FinalResult flipResult={getFinalResult(flip)}>
        {getFinalResult(flip)}
      </FinalResult>
      {flip.base === 1 && " -> ÉCHEC CRITIQUE"}
      {flip.base === 20 && " -> SUCCÈS MAJEUR"}
    </span>
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

const ResultValue = styled.span<{ flipResult: number }>`
  font-size: 1.5em;
  margin-left: 8px;
  font-weight: bold;
  color: ${({ flipResult }) => (flipResult < 12 ? "red" : "green")};
`;

// Composant pour le texte en gras (par défaut tout est gras)
const BoldText = styled.span`
  font-weight: bold;
`;

// Composant pour le texte en non-gras (pour les valeurs faibles)
const NonBoldText = styled.span`
  font-weight: normal;
`;

// Composant qui change la couleur du résultat final en fonction de la valeur
const FinalResult = styled.span<{ flipResult: number }>`
  font-weight: bold;
  color: ${({ flipResult }) => (flipResult < 12 ? "red" : "green")};
`;
