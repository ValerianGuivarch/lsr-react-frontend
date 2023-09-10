import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import { useSSECharacterByName } from "../../data/api/useSSECharacterByName";
import { CharacterBanner } from "../../components/Character/CharacterBanner/CharacterBanner";
import styled from "styled-components";
import { Character } from "../../domain/models/Character";
import { Skill } from "../../domain/models/Skill";
import { CharacterButton } from "../../components/Character/CharacterButtons/CharacterButton";

export function CharacterCartouchesSheet() {
  const { characterName } = useParams();
  const [cartouchesList, setCartouchesList] = useState<Skill[]>([]);
  const [character, setCharacter] = useState<Character | undefined>(undefined);

  useEffect(() => {
    fetchCharacter().then(() => {});
  }, []);

  async function fetchCharacter() {
    try {
      const character = await ApiL7RProvider.getCharacterByName(
        characterName ?? "",
      );
      setCharacter(character);
      const cartouchesList = character.skills.filter(
        (skill) => skill.dailyUse !== undefined,
      );
      setCartouchesList(cartouchesList);
    } catch (error) {
      console.error("Error fetching character:", error);
    }
  }

  useSSECharacterByName({
    name: characterName || "",
    callback: (character: Character) => {
      setCharacter(character);
    },
  });

  async function handleCartouchesEvolution(
    cartoucheName: string,
    evolution: number,
  ) {
    const cartouche = cartouchesList.find(
      (cartouche) => cartouche.name === cartoucheName,
    );
    if (
      character &&
      cartouche &&
      cartouche.dailyUse !== undefined &&
      cartouche.dailyUse + evolution >= 0
    ) {
      const dailyUse = cartouche.dailyUse + evolution;
      await ApiL7RProvider.updateCharacterSkillsAttribution(
        characterName ?? "",
        cartoucheName,
        dailyUse,
      );
      fetchCharacter().then(() => {});
    }
  }
  const handleValidation = () => {
    window.location.href = `/characters/${characterName ?? ""}`;
  };

  return (
    <>
      {!character ? (
        <p>Loading...</p>
      ) : (
        <MainContainer>
          <CharacterBanner character={character} />
          {cartouchesList.map((cartouches) => (
            <div key={cartouches.name}>
              <CharacterButton
                cardDisplay={false}
                name={cartouches.name + " : " + cartouches.dailyUse}
                onClickDecr={() => {
                  handleCartouchesEvolution(cartouches.name, -1);
                }}
                onClickIncr={() => {
                  handleCartouchesEvolution(cartouches.name, 1);
                }}
                large={true}
              />
            </div>
          ))}
          <CharacterButton
            cardDisplay={false}
            onClickBtn={handleValidation}
            name={"Valider"}
          ></CharacterButton>
        </MainContainer>
      )}
    </>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw; /* Change the width to 100vw */
  max-width: 600px;
  margin: auto;
  padding: 20px;
`;
const CartouchesRemaining = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;
