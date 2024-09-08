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

export function WizardSheet() {
  const { wizardName } = useParams();
  const [flips, setFlips] = useState<Flip[]>([]);
  const [wizard, setWizard] = useState<Wizard | undefined>(undefined);

  useEffect(() => {
    fetchWizard().then(() => {});
    fetchFlips().then(() => {});
  }, []);

  async function fetchWizard() {
    try {
      const wizard = await ApiL7RProvider.getWizardByName(wizardName ?? "");
      setWizard(wizard);
    } catch (error) {
      console.error("Error fetching wizard:", error);
    }
  }

  async function handleUpdateWizard(
    name: string,
    newWizard: {
      stats: { level: number; name: string }[];
      name: string;
      category: string;
      knowledges: { level: number; name: string }[];
      spells: { difficulty: Difficulty; name: string }[];
    },
  ) {
    try {
      if (wizard) {
        await ApiL7RProvider.updateWizard(name, newWizard);
      }
    } catch (error) {
      console.error("Error updating wizard:", error);
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
      {!wizard ? (
        <p>Loading...</p>
      ) : (
        <MainContainer>
          <WizardBanner wizard={wizard} />
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
