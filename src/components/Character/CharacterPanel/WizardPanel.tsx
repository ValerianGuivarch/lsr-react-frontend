import React from "react";
import { Wizard } from "../../../domain/models/Wizard";
import styled from "styled-components";

export function WizardPanel(props: {
  wizard: Wizard;
  sendFlip: (p: { knowledgeId?: string; statId?: string }) => void;
  updateWizard: (newWizard: Wizard) => void;
}) {
  function handleOnClickStat(statId: string) {
    props.sendFlip({ statId });
  }

  function handleOnClickKnowledge(knowledgeId: string) {
    props.sendFlip({ knowledgeId });
  }

  return (
    <MainContainerButtons>
      <WizardBlocks>
        <CategoryTitle>Stats</CategoryTitle>
        {props.wizard.stats.map((wizardStat) => (
          <StatButton
            key={wizardStat.stat.id}
            color={wizardStat.stat.color}
            onClick={() => handleOnClickStat(wizardStat.stat.id)}
          >
            {wizardStat.stat.name} [{wizardStat.level}]
          </StatButton>
        ))}
      </WizardBlocks>
      <WizardBlocks>
        <CategoryTitle>Knowledges</CategoryTitle>
        {props.wizard.knowledges.map((wizardKnowledge) => (
          <KnowledgeButton
            key={wizardKnowledge.knowledge.id}
            color={wizardKnowledge.knowledge.stat.color}
            onClick={() => handleOnClickKnowledge(wizardKnowledge.knowledge.id)}
          >
            {wizardKnowledge.knowledge.name} [{wizardKnowledge.level}]
          </KnowledgeButton>
        ))}
      </WizardBlocks>
    </MainContainerButtons>
  );
}

const MainContainerButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 600px;
  font-size: 1em;
`;

const WizardBlocks = styled.div`
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h3`
  text-align: center;
  margin-bottom: 10px;
`;

const StatButton = styled.button<{ color: string }>`
  background-color: ${(props) => props.color};
  color: white;
  border: none;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
  font-size: 1em;
  border-radius: 5px;
  min-width: 100px;

  &:hover {
    opacity: 0.8;
  }
`;

const KnowledgeButton = styled(StatButton)`
  // Identique à StatButton mais permet une différenciation facile si nécessaire
`;
