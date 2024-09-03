import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import styled from "styled-components";
import { Wizard } from "../../domain/models/Wizard";
import { Flip } from "../../domain/models/Flip";
import { WizardBanner } from "../../components/Hp/WizardBanner";
import { WizardPanel } from "../../components/Character/CharacterPanel/WizardPanel";
import FlipCard from "../../components/Hp/FlipCard";

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

  async function handleUpdateWizard(newWizard: Wizard) {
    try {
      if (wizard) {
        await ApiL7RProvider.updateWizard(newWizard);
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
  });

  useSSEFlips({
    name: wizardName || "",
    callback: (flips: Flip[]) => {
      setFlips(flips);
    },
  });*/

  async function handleSendFlip(p: { knowledgeId?: string; statId?: string }) {
    try {
      if (wizard) {
        await ApiL7RProvider.sendFlip({
          knowledgeId: p.knowledgeId,
          statId: p.statId,
          wizardId: wizard.id,
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
          <WizardPanel
            wizard={wizard}
            sendFlip={handleSendFlip}
            updateWizard={handleUpdateWizard}
          />
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

const MainContainer = styled.div``;

const Flips = styled.div``;
