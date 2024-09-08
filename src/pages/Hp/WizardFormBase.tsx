import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import { SchoolCategory } from "../../domain/models/SchoolCategory";
import { Difficulty } from "../../domain/models/hp/Difficulty";
import { Spell } from "../../domain/models/hp/Spell";
import { WizardSpell } from "../../domain/models/hp/WizardSpell";
import { SpellsList } from "./WizardForm"; // Ensure you import WizardSpell

interface WizardFormProps {
  initialData?: {
    name: string;
    category: SchoolCategory;
    stats: Record<string, number>;
    knowledges: Record<string, number>;
    spells: WizardSpell[];
  };
  isUpdating?: boolean;
  onSubmit: (wizardData: {
    stats: { level: number; name: string }[];
    name: string;
    category: string;
    knowledges: { level: number; name: string }[];
    spells: { difficulty: Difficulty; name: string }[];
  }) => void;
}

export function WizardFormBase({
  initialData,
  isUpdating = false,
  onSubmit,
}: WizardFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState<SchoolCategory>(
    initialData?.category || SchoolCategory.YEAR1,
  );
  const [stats, setStats] = useState<any[]>([]);
  const [knowledges, setKnowledges] = useState<any[]>([]);
  const [spells, setSpells] = useState<any[]>([]);
  const [wizardStats, setWizardStats] = useState<Record<string, number>>(
    initialData?.stats || {},
  );
  const [wizardKnowledges, setWizardKnowledges] = useState<
    Record<string, number>
  >(initialData?.knowledges || {});
  const [selectedWizardSpells, setSelectedWizardSpells] = useState<
    WizardSpell[]
  >(initialData?.spells || []);

  useEffect(() => {
    fetchStats();
    fetchKnowledges();
    fetchSpells();
  }, [initialData]);

  async function fetchStats() {
    try {
      const statsData = await ApiL7RProvider.getStats();
      setStats(statsData);

      // Si initialData est fourni, on le complète avec les stats manquantes initialisées à 0
      setWizardStats((prevStats) => {
        return statsData.reduce((acc: Record<string, number>, stat: any) => {
          acc[stat.name] = prevStats?.[stat.name] ?? 0; // Valeur par défaut à 0
          return acc;
        }, {});
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  async function fetchKnowledges() {
    try {
      const knowledgesData = await ApiL7RProvider.getKnowledges();
      setKnowledges(knowledgesData);

      // Si initialData est fourni, on le complète avec les knowledges manquantes initialisées à 0
      setWizardKnowledges((prevKnowledges) => {
        return knowledgesData.reduce(
          (acc: Record<string, number>, knowledge: any) => {
            acc[knowledge.name] = prevKnowledges?.[knowledge.name] ?? 0; // Valeur par défaut à 0
            return acc;
          },
          {},
        );
      });
    } catch (error) {
      console.error("Error fetching knowledges:", error);
    }
  }

  async function fetchSpells() {
    try {
      const spellsData = await ApiL7RProvider.getSpells();
      setSpells(spellsData);
    } catch (error) {
      console.error("Error fetching spells:", error);
    }
  }

  function handleSubmit() {
    const wizardData = {
      name,
      category: category as string,
      stats: Object.entries(wizardStats).map(([name, level]) => ({
        name,
        level,
      })),
      knowledges: Object.entries(wizardKnowledges).map(([name, level]) => ({
        name,
        level,
      })),
      spells: selectedWizardSpells.map((wizardSpell) => ({
        name: wizardSpell.spell.name,
        difficulty: wizardSpell.difficulty,
      })),
    };
    onSubmit(wizardData);
  }

  function handleSpellSelect(spellName: string) {
    const selectedSpell = spells.find(
      (spell: Spell) => spell.name === spellName,
    );
    if (selectedSpell) {
      const newWizardSpell = new WizardSpell({
        spell: selectedSpell,
        difficulty: Difficulty.NORMAL,
      });
      setSelectedWizardSpells((prev) => [...prev, newWizardSpell]);
    }
  }

  function handleSpellRemove(spellName: string) {
    setSelectedWizardSpells((prev) =>
      prev.filter((wizardSpell) => wizardSpell.spell.name !== spellName),
    );
  }

  function handleDifficultyChange(spellName: string, difficulty: Difficulty) {
    setSelectedWizardSpells((prev) =>
      prev.map((wizardSpell) =>
        wizardSpell.spell.name === spellName
          ? { ...wizardSpell, difficulty }
          : wizardSpell,
      ),
    );
  }
  // Remaining handlers like handleSpellSelect, handleSpellRemove, etc.

  const statsSum = Object.values(wizardStats).reduce(
    (acc, val) => acc + val,
    0,
  );
  const knowledgesSum = Object.values(wizardKnowledges).reduce(
    (acc, val) => acc + val,
    0,
  );
  return (
    <MainContainer>
      {/* Form UI here */}
      <FormRow>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUpdating} // Disable input if updating
        />
      </FormRow>
      <FormRow>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as SchoolCategory)}
        >
          {Object.values(SchoolCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </FormRow>
      {/* Stats, knowledges, and spells logic here */}

      <FormSection>
        <h3>Stats: {statsSum}</h3>
        <p>Choisissez bien!</p>
        <MultiColumnGrid>
          {stats.map((stat) => (
            <FormRow key={stat.name}>
              <label>{stat.name}:</label>
              <input
                type="number"
                value={wizardStats[stat.name]}
                onChange={(e) =>
                  setWizardStats({
                    ...wizardStats,
                    [stat.name]: parseInt(e.target.value, 10),
                  })
                }
              />
            </FormRow>
          ))}
        </MultiColumnGrid>
      </FormSection>
      <FormSection>
        <h3>Knowledges: {knowledgesSum}</h3>
        <p>Choisissez bien!</p>
        <MultiColumnGrid>
          {knowledges.map((knowledge) => (
            <FormRow key={knowledge.name}>
              <label>{knowledge.name}:</label>
              <input
                type="number"
                value={wizardKnowledges[knowledge.name]}
                onChange={(e) =>
                  setWizardKnowledges({
                    ...wizardKnowledges,
                    [knowledge.name]: parseInt(e.target.value, 10),
                  })
                }
              />
            </FormRow>
          ))}
        </MultiColumnGrid>
      </FormSection>
      <FormSection>
        <h3>Spells</h3>
        <select onChange={(e) => handleSpellSelect(e.target.value)}>
          <option value="">Select a spell</option>
          {spells.map((spell: Spell) => (
            <option key={spell.name} value={spell.name}>
              {spell.name}
            </option>
          ))}
        </select>
        <SpellsList
          wizardSpells={selectedWizardSpells}
          removeSpell={handleSpellRemove}
          updateDifficulty={handleDifficultyChange}
        />
      </FormSection>
      <FormRow>
        <button onClick={handleSubmit}>
          {isUpdating ? "Update Wizard" : "Create Wizard"}
        </button>
      </FormRow>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: 20px;
`;
const FormRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* Pour forcer le retour à la ligne si l'espace est insuffisant */

  label {
    margin-right: 10px;
    min-width: 100px; /* Définit une largeur minimale pour les labels */
    white-space: nowrap; /* Empêche les labels de se diviser sur plusieurs lignes */
  }

  input[type="text"],
  input[type="number"],
  select {
    flex: 1;
    min-width: 150px; /* Ajoute une largeur minimale pour les inputs */
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const MultiColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  max-width: 1000px;
  margin: 0 auto;
`;

const SpellsContainer = styled.div`
  margin-top: 20px;
`;

const SpellRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;

  select {
    margin-left: 10px;
    margin-right: 10px;
  }

  button {
    margin-left: 10px;
    background-color: #ff6666;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #ff4d4d;
    }
  }
`;
