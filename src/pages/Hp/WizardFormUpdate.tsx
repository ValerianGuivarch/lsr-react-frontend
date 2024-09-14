import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { WizardFormBase } from "./WizardFormBase";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import { WizardSpell } from "../../domain/models/hp/WizardSpell";
import { Difficulty } from "../../domain/models/hp/Difficulty";

export function WizardFormUpdate() {
  const { wizardName } = useParams<{ wizardName: string }>();
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    async function fetchWizard() {
      try {
        const wizard = await ApiL7RProvider.getWizardByName(wizardName ?? "");
        console.log("Wizard", wizard);
        setInitialData({
          name: wizard.name,
          category: wizard.category,
          stats: wizard.stats.reduce(
            (acc: Record<string, number>, stat: any) => {
              acc[stat.name] = stat.level;
              return acc;
            },
            {},
          ),
          knowledges: wizard.knowledges.reduce(
            (acc: Record<string, number>, knowledge: any) => {
              acc[knowledge.name] = knowledge.level;
              return acc;
            },
            {},
          ),
          spells: wizard.spells.map(
            (spell: any) =>
              new WizardSpell({
                spell,
                difficulty: spell.difficulty,
                xp: 0,
              }),
          ),
        });
      } catch (error) {
        console.error("Error fetching wizard:", error);
      }
    }

    fetchWizard();
  }, [wizardName]);

  async function handleUpdate(
    wizardData: Partial<{
      stats: { level: number; name: string }[];
      name: string;
      category: string;
      knowledges: { level: number; name: string }[];
      spells: { difficulty: Difficulty; name: string }[];
      text: string;
    }>,
  ) {
    try {
      await ApiL7RProvider.updateWizard(wizardName ?? "", wizardData);
      alert("Wizard updated successfully!");
    } catch (error) {
      console.error("Error updating wizard:", error);
    }
  }

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <WizardFormBase
      initialData={initialData}
      isUpdating
      onSubmit={handleUpdate}
    />
  );
}
