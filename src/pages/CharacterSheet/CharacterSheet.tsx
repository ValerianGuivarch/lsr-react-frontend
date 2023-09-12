import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RollCard from "../../components/RollCard/RollCard";
import { Roll } from "../../domain/models/Roll";
import { useSSERolls } from "../../data/api/useSSERolls";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import { CharacterPanel } from "../../components/Character/CharacterPanel/CharacterPanel";
import { useSSECharacterByName } from "../../data/api/useSSECharacterByName";
import { CharacterBanner } from "../../components/Character/CharacterBanner/CharacterBanner";
import { CharacterNotes } from "../../components/Character/CharacterNotes/CharacterNotes";
import styled from "styled-components";
import { UtilsRules } from "../../utils/UtilsRules";
import { Character } from "../../domain/models/Character";
import { CharacterState } from "../../domain/models/CharacterState";
import { useSSECharactersPreviewSession } from "../../data/api/useSSECharactersPreview";
import { CharacterPreview } from "../../domain/models/CharacterPreview";

export function CharacterSheet() {
  const { characterName } = useParams();
  const [characterState, setCharacterState] = useState<CharacterState>(
    new CharacterState({}),
  );
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [character, setCharacter] = useState<Character | undefined>(undefined);
  const [charactersSession, setCharactersSession] = useState<
    CharacterPreview[]
  >([]);

  useEffect(() => {
    fetchCharacter().then(() => {});
    fetchCharactersSession().then(() => {});
    fetchRolls(characterName ?? "").then(() => {});
  }, []);

  async function fetchCharacter() {
    try {
      const character = await ApiL7RProvider.getCharacterByName(
        characterName ?? "",
      );
      setCharacter(character);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
  }
  async function fetchCharactersSession() {
    try {
      const characters = await ApiL7RProvider.getSessionCharacters();
      setCharactersSession(characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  }

  async function fetchRolls(name: string) {
    try {
      const rolls = await ApiL7RProvider.getRolls(name);
      setRolls(rolls);
    } catch (error) {
      console.error("Error fetching rolls:", error);
    }
  }

  useSSECharacterByName({
    name: characterName || "",
    callback: (character: Character) => {
      setCharacter(character);
    },
  });

  useSSECharactersPreviewSession({
    callback: (charactersPreview: CharacterPreview[]) => {
      setCharactersSession(charactersPreview);
    },
  });

  useSSERolls({
    name: characterName || "",
    callback: (rolls: Roll[]) => {
      setRolls(rolls);
    },
  });

  async function handleSendRoll(p: {
    skillId: string;
    empiriqueRoll?: string;
  }) {
    try {
      if (character) {
        const bonus =
          characterState.bonus +
          (characterState.lux ? 1 : 0) +
          (characterState.secunda ? 1 : 0);
        const malus = characterState.malus + (characterState.umbra ? 1 : 0);
        const hasProficiency = Array.from(
          characterState.proficiencies.values(),
        ).some((value) => value);

        await ApiL7RProvider.sendRoll({
          skillId: p.skillId,
          characterName: character.name,
          focus: characterState.focusActivated,
          power: characterState.powerActivated,
          proficiency: hasProficiency,
          secret: characterState.secret,
          bonus: bonus,
          malus: malus,
          empiriqueRoll: p.empiriqueRoll,
        });
      }
    } catch (error) {
      console.error("Error sending roll:", error);
    }
  }

  async function handleUpdateState(newState: CharacterState) {
    setCharacterState(newState);
  }

  async function handleRest() {
    try {
      if (character) {
        await ApiL7RProvider.rest(character.name);
      }
    } catch (error) {
      console.error("Error resting character:", error);
    }
  }

  async function handleUpdateCharacter(newCharacter: Character) {
    try {
      if (character) {
        await ApiL7RProvider.updateCharacter(newCharacter);
      }
    } catch (error) {
      console.error("Error updating character:", error);
    }
  }

  async function handleSubir(p: { roll: Roll; originRoll?: Roll }) {
    try {
      if (character) {
        const degats = UtilsRules.getDegats(p.roll, p.originRoll);
        await ApiL7RProvider.updateCharacter({
          ...character,
          pv: Math.max(character.pv - degats, 0),
        });
      }
    } catch (error) {
      console.error("Error updating character:", error);
    }
  }

  async function handleHelp(p: { bonus: number; malus: number }) {
    characterState.bonus += p.bonus;
    characterState.malus += p.malus;
    await handleUpdateState({
      ...characterState,
      bonus: characterState.bonus,
      malus: characterState.malus,
    });
  }

  async function handleHealOnClick(p: { roll: Roll; characterName: string }) {
    try {
      const healPoint = p.roll.healPoint;
      if (healPoint && healPoint > 0) {
        const characterToHeal = await ApiL7RProvider.getCharacterByName(
          p.characterName,
        );
        await ApiL7RProvider.updateRoll({
          id: p.roll.id,
          healPoint: healPoint - 1,
        });
        await ApiL7RProvider.updateCharacter({
          ...characterToHeal,
          pv: Math.min(characterToHeal.pv + 1, characterToHeal.pvMax),
        });
      }
    } catch (error) {
      console.error("Error updating character:", error);
    }
  }

  async function handleResist(p: {
    stat: "chair" | "esprit" | "essence";
    resistRoll: string;
  }) {
    try {
      if (character) {
        await ApiL7RProvider.sendRoll({
          skillId:
            character.skills.find((skill) => skill.name === p.stat)?.id ?? "",
          characterName: character.name,
          focus: characterState.focusActivated,
          power: characterState.powerActivated,
          proficiency: Array.from(characterState.proficiencies.values()).some(
            (value) => value,
          ),
          secret: characterState.secret,
          bonus: characterState.bonus,
          malus: characterState.malus,
          resistRoll: p.resistRoll,
        });
      }
    } catch (error) {
      console.error("Error sending resist roll:", error);
    }
  }

  function handleUpdateCharacterNotes(text: string) {
    if (character) {
      console.log("Update character notes:", text);
      ApiL7RProvider.updateCharacter({
        ...character,
        notes: text,
      });
    }
  }

  return (
    <>
      {!character ? (
        <p>Loading...</p>
      ) : (
        <MainContainer>
          <CharacterBanner character={character} />
          <CharacterNotes
            text={character.notes}
            setText={handleUpdateCharacterNotes}
          />
          <CharacterPanel
            characterState={characterState}
            cardDisplay={false}
            character={character}
            sendRoll={handleSendRoll}
            updateCharacter={handleUpdateCharacter}
            updateState={handleUpdateState}
            rest={handleRest}
          />
          <Rolls>
            {rolls.map((roll: Roll) => (
              <div key={roll.id}>
                <RollCard
                  mjDisplay={false}
                  roll={roll}
                  clickOnResist={handleResist}
                  clickOnSubir={handleSubir}
                  charactersSession={charactersSession}
                  onHealClick={handleHealOnClick}
                  clickOnHelp={handleHelp}
                />
              </div>
            ))}
          </Rolls>
        </MainContainer>
      )}
    </>
  );
}

const MainContainer = styled.div``;

const Rolls = styled.div``;
