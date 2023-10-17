import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import { Skill } from "../../domain/models/Skill";
import { DisplayCategory } from "../../domain/models/DisplayCategory";
import { CharacterButton } from "../../components/Character/CharacterButtons/CharacterButton";
import { SkillStat } from "../../domain/models/SkillStat";

export function ArcanePrimesSheet() {
  const { characterName } = useParams();
  const [arcanePrimesList, setArcanePrimesList] = useState<Skill[]>([]);
  const [characterSkills, setCharacterSkills] = useState<Skill[]>([]);

  const handleValidation = () => {
    window.location.href = `/characters/${characterName ?? ""}`;
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const arcanePrimes = await ApiL7RProvider.getArcanePrimes(
          characterName ?? "",
        );
        const character = await ApiL7RProvider.getCharacterByName(
          characterName ?? "",
        );

        setArcanePrimesList(arcanePrimes);
        setCharacterSkills(character.skills);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [characterName]);

  async function handleSkillToggle(skillId: string, hasSkill: boolean) {
    const dailyUse = hasSkill ? 0 : 1;

    try {
      if (!hasSkill) {
        await ApiL7RProvider.updateCharacterSkillsAttribution(
          characterName ?? "",
          skillId,
          1,
          1,
          true,
        );
      } else {
        await ApiL7RProvider.updateCharacterSkillsAttribution(
          characterName ?? "",
          skillId,
          1,
          1,
          false,
        );
      }
      // Re-fetch the character's skills to update the UI.
      const updatedCharacter = await ApiL7RProvider.getCharacterByName(
        characterName ?? "",
      );
      setCharacterSkills(updatedCharacter.skills);
    } catch (error) {
      console.error("Error updating character's skill:", error);
    }
  }

  return (
    <Container>
      {arcanePrimesList.map((arcanePrime) => {
        const hasSkill = characterSkills.some(
          (skill) =>
            skill.name === arcanePrime.name &&
            skill.displayCategory === DisplayCategory.ARCANES_PRIMES,
        );
        return (
          <SkillRow key={arcanePrime.id}>
            <span>{arcanePrime.name}</span>
            <button onClick={() => handleSkillToggle(arcanePrime.id, hasSkill)}>
              {hasSkill ? "Enlever" : "Ajouter"}
            </button>
          </SkillRow>
        );
      })}
      <CharacterButton
        skillStat={SkillStat.FIXE}
        cardDisplay={false}
        onClickBtn={handleValidation}
        name={"Valider"}
      ></CharacterButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SkillRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
