import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import styled from "styled-components";
import { Wizard } from "../../domain/models/hp/Wizard";
import { Flip } from "../../domain/models/hp/Flip";
import { WizardBanner } from "../../components/Hp/WizardBanner";
import { WizardPanel } from "../../components/Character/CharacterPanel/WizardPanel";
import FlipCard from "../../components/Hp/FlipCard";
import { Difficulty } from "../../domain/models/hp/Difficulty";
import { useSSEFlips } from "../../data/api/useSSEFlips";
import { House } from "../../domain/models/hp/House";
import { CharacterNotes } from "../../components/Character/CharacterNotes/CharacterNotes";

export function WizardSheet() {
  const { wizardName } = useParams();
  const [flips, setFlips] = useState<Flip[]>([]);
  const [wizard, setWizard] = useState<Wizard | undefined>(undefined);
  const [houses, setHouses] = useState<House[] | undefined>(undefined);

  const [isAdvantagesOpen, setIsAdvantagesOpen] = useState(false);

  const toggleAdvantages = () => setIsAdvantagesOpen(!isAdvantagesOpen);

  useEffect(() => {
    fetchWizard().then(() => {});
    fetchFlips().then(() => {});
    fetchHouses().then(() => {});
  }, []);

  async function fetchWizard() {
    try {
      const wizard = await ApiL7RProvider.getWizardByName(wizardName ?? "");
      setWizard(wizard);
    } catch (error) {
      console.error("Error fetching wizard:", error);
    }
  }

  async function fetchFlips() {
    try {
      const flips = await ApiL7RProvider.getFlips();
      setFlips(flips);
    } catch (error) {
      console.error("Error fetching flips:", error);
    }
  }

  async function fetchHouses() {
    try {
      const houses = await ApiL7RProvider.getHouses();
      console.log("houses", houses);
      setHouses(houses);
    } catch (error) {
      console.error("Error fetching houses:", error);
    }
  }

  /*  useSSEWizardByName({
    name: wizardName || "",
    callback: (wizard: Wizard) => {
      setWizard(wizard);
    },
  });

  useSSEWizardsPreviewSession({
    callback: (wizardsPreview: WizardPreview[]) => {
      setWizardsSession(wizardsPreview);
    },
  });*/

  useSSEFlips({
    callback: (flips: Flip[]) => {
      setFlips(flips);
    },
  });

  function handleUpdateWizardText(text: string) {
    if (wizard) {
      ApiL7RProvider.updateWizard(wizard.name, {
        text: text,
      });
    }
  }

  async function handleSendFlip(p: {
    knowledgeName?: string;
    spellName?: string;
    statName?: string;
    difficulty: Difficulty;
  }) {
    try {
      if (wizard) {
        await ApiL7RProvider.sendFlip({
          knowledgeName: p.knowledgeName,
          statName: p.statName,
          spellName: p.spellName,
          wizardName: wizard.name,
          difficulty: p.difficulty,
        });
      }
    } catch (error) {
      console.error("ERROR");
      console.error("Error sending flip:", error);
      alert(error);
    }
  }

  /*function handleUpdateWizardNotes(text: string) {
    if (wizard) {
      ApiL7RProvider.updateWizard({
        ...wizard,
        notes: text,
      });
    }
  }*/
  /*
<WizardNotes text={wizard.notes} setText={handleUpdateWizardNotes} />
 */
  return (
    <>
      {!wizard || !houses ? (
        <p>Loading...</p>
      ) : (
        <MainContainer>
          <WizardBanner
            wizard={wizard}
            poufsouffle={
              houses?.find((house) => house.name === "Poufsouffle")?.points ?? 8
            }
            serdaigle={
              houses?.find((house) => house.name === "Serdaigle")?.points ?? 0
            }
            gryffondor={
              houses?.find((house) => house.name === "Gryffondor")?.points ?? 0
            }
            serpentard={
              houses?.find((house) => house.name === "Serpentard")?.points ?? 0
            }
          />
          <CharacterNotes text={wizard.text} setText={handleUpdateWizardText} />

          {/* Menu déroulant pour les traits */}
          <WizardTraits>
            {/* Avantages */}
            <DropdownContainer>
              <DropdownHeader onClick={toggleAdvantages}>
                Avantages
              </DropdownHeader>
              {isAdvantagesOpen && (
                <ul>
                  {wizard.traits
                    .filter((trait) => !trait.startsWith("-"))
                    .map((advantage, index) => (
                      <li key={index}>{advantage}</li>
                    ))}
                </ul>
              )}
            </DropdownContainer>

            {/* Désavantages */}
            <DropdownContainer>
              <DropdownHeader onClick={toggleAdvantages}>
                Désavantages
              </DropdownHeader>
              {isAdvantagesOpen && (
                <ul>
                  {wizard.traits
                    .filter((trait) => trait.startsWith("-"))
                    .map((disadvantage, index) => (
                      <li key={index}>{disadvantage.substring(1)}</li>
                    ))}
                </ul>
              )}
            </DropdownContainer>
          </WizardTraits>
          <WizardPanel wizard={wizard} sendFlip={handleSendFlip} />
          <Flips>
            {flips.map((flip: Flip) => (
              <div key={flip.id}>
                <FlipCard flip={flip} />
              </div>
            ))}
          </Flips>
        </MainContainer>
      )}
    </>
  );
}

const MainContainer = styled.div`
  width: 700px;
  max-width: 100%; // Évite toute limitation de largeur
  padding: 20px;
  margin: 0 auto; // Centrer si nécessaire
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Flips = styled.div``;

const WizardTraits = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const DropdownContainer = styled.div`
  width: 48%;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const DropdownHeader = styled.h3`
  margin: 0;
  padding: 10px;
  font-size: 0.8rem;
  color: #333;
  background-color: #e6e6e6;
  cursor: pointer;
  text-align: center;
  border-radius: 8px 8px 0 0;
  user-select: none;

  &:hover {
    background-color: #d4d4d4;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 5px 0;
    font-size: 1rem;
    color: #555;
    padding-left: 15px;
    border-bottom: 1px solid #ddd;
  }

  ul li:last-child {
    border-bottom: none;
  }
`;
