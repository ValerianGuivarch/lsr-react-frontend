import React from "react";
import styled from "styled-components";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Wizard } from "../../../domain/models/hp/Wizard";
import { Difficulty } from "../../../domain/models/hp/Difficulty"; // Icons for difficulty

export function WizardPanel({
  wizard,
  sendFlip,
}: {
  wizard: Wizard;
  sendFlip: (p: {
    knowledgeName?: string;
    statName?: string;
    spellName?: string;
    difficulty: string;
  }) => void;
}) {
  function handleClick(
    skillName: string,
    type: "stat" | "knowledge" | "spell",
    difficulty: string,
  ) {
    if (type === "spell") {
      sendFlip({ spellName: skillName, difficulty });
    } else if (type === "stat") {
      sendFlip({ statName: skillName, difficulty });
    } else if (type === "knowledge") {
      sendFlip({ knowledgeName: skillName, difficulty });
    } else {
      console.error("Unknown type");
    }
  }

  return (
    <PanelContainer>
      {/* Stats */}
      <Section>
        <h3>Stats</h3>
        {wizard.stats.map((statWizard) => (
          <TripleButton key={statWizard.stat.name}>
            <ActionButton
              onClick={() =>
                handleClick(statWizard.stat.name, "stat", "DESAVANTAGE")
              }
            >
              <FaArrowLeft />
            </ActionButton>
            <MainButton
              onClick={() =>
                handleClick(statWizard.stat.name, "stat", "NORMAL")
              }
            >
              {statWizard.stat.name} {statWizard.level} ({statWizard.xp})
            </MainButton>
            <ActionButton
              onClick={() =>
                handleClick(statWizard.stat.name, "stat", "AVANTAGE")
              }
            >
              <FaArrowRight />
            </ActionButton>
          </TripleButton>
        ))}
      </Section>

      {/* Knowledges */}
      <Section>
        <h3>Knowledges</h3>
        {wizard.knowledges.map((knowledgeWizard) => (
          <TripleButton key={knowledgeWizard.knowledge.name}>
            <ActionButton
              onClick={() =>
                handleClick(
                  knowledgeWizard.knowledge.name,
                  "knowledge",
                  "DESAVANTAGE",
                )
              }
              style={{ backgroundColor: knowledgeWizard.knowledge.color }}
            >
              <FaArrowLeft />
            </ActionButton>
            <MainButton
              onClick={() =>
                handleClick(
                  knowledgeWizard.knowledge.name,
                  "knowledge",
                  "NORMAL",
                )
              }
              style={{ backgroundColor: knowledgeWizard.knowledge.color }}
            >
              {knowledgeWizard.knowledge.name} {knowledgeWizard.level} (
              {knowledgeWizard.xp})
            </MainButton>
            <ActionButton
              onClick={() =>
                handleClick(
                  knowledgeWizard.knowledge.name,
                  "knowledge",
                  "AVANTAGE",
                )
              }
              style={{ backgroundColor: knowledgeWizard.knowledge.color }}
            >
              <FaArrowRight />
            </ActionButton>
          </TripleButton>
        ))}
      </Section>

      {/* Spells */}
      <Section>
        <h3>Spells</h3>
        {wizard.spells.map((spellWizard) => (
          <TripleButton key={spellWizard.spell.name}>
            <ActionButton
              onClick={() =>
                handleClick(spellWizard.spell.name, "spell", "DESAVANTAGE")
              }
            >
              <FaArrowLeft />
            </ActionButton>
            <MainButton
              onClick={() =>
                handleClick(spellWizard.spell.name, "spell", "NORMAL")
              }
            >
              {spellWizard.spell.name} ({spellWizard.difficulty})
            </MainButton>
            <ActionButton
              onClick={() =>
                handleClick(spellWizard.spell.name, "spell", "AVANTAGE")
              }
            >
              <FaArrowRight />
            </ActionButton>
          </TripleButton>
        ))}
      </Section>
    </PanelContainer>
  );
}

const PanelContainer = styled.div`
  width: 700px;
  max-width: 100%; // Évite toute limitation de largeur
  padding: 20px;
  margin: 0 auto; // Centrer si nécessaire
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Section = styled.div`
  width: 100%; // Assure que chaque section prend toute la largeur
  display: flex;
  flex-wrap: wrap;
  gap: 10px; // Ajoute de l'espacement entre les boutons
  justify-content: center; // Centre les éléments dans la section

  h3 {
    flex-basis: 100%; // Le titre prend toute la largeur
    margin-bottom: 10px;
    text-align: center; // Centre le titre
  }
`;

const TripleButton = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 0px;
  border-radius: 5px;
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: #ccc;
  cursor: pointer;

  &:hover {
    background-color: #bbb;
  }

  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

const MainButton = styled.button<{ color?: string }>`
  flex-grow: 1; // Le bouton principal prend toute la largeur restante
  height: 40px;
  padding: 0 10px;
  border: none;
  background-color: ${(props) =>
    props.color || "#eee"}; // Utilise la couleur prop si fournie
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  &:hover {
    background-color: #ddd;
  }
`;
