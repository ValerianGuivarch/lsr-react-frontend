import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import { SchoolCategory } from "../../domain/models/SchoolCategory";
import { Difficulty } from "../../domain/models/Difficulty";
import { Spell } from "../../domain/models/Spell";
import { WizardSpell } from "../../domain/models/WizardSpell"; // Ensure you import WizardSpell

export function WizardForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SchoolCategory | undefined>(
    SchoolCategory.YEAR1,
  );
  const [stats, setStats] = useState<any[]>([]);
  const [knowledges, setKnowledges] = useState<any[]>([]);
  const [spells, setSpells] = useState<any[]>([]);
  const [wizardStats, setWizardStats] = useState<Record<string, number>>({});
  const [wizardKnowledges, setWizardKnowledges] = useState<
    Record<string, number>
  >({});
  const [selectedWizardSpells, setSelectedWizardSpells] = useState<
    WizardSpell[]
  >([]);

  useEffect(() => {
    fetchStats();
    fetchKnowledges();
    fetchSpells();
  }, []);

  async function fetchStats() {
    try {
      const statsData = await ApiL7RProvider.getStats();
      setStats(statsData);
      setWizardStats(
        statsData.reduce((acc: Record<string, number>, stat: any) => {
          acc[stat.id] = 0; // Default level
          return acc;
        }, {}),
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  async function fetchKnowledges() {
    try {
      const knowledgesData = await ApiL7RProvider.getKnowledges();
      setKnowledges(knowledgesData);
      setWizardKnowledges(
        knowledgesData.reduce((acc: Record<string, number>, knowledge: any) => {
          acc[knowledge.id] = 0; // Default level
          return acc;
        }, {}),
      );
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

  function handleSpellSelect(spellId: string) {
    const selectedSpell = spells.find((spell: Spell) => spell.id === spellId);
    if (selectedSpell) {
      const newWizardSpell = new WizardSpell({
        spell: selectedSpell,
        difficulty: Difficulty.NORMAL,
      });
      setSelectedWizardSpells((prev) => [...prev, newWizardSpell]);
    }
  }

  function handleSpellRemove(spellId: string) {
    setSelectedWizardSpells((prev) =>
      prev.filter((wizardSpell) => wizardSpell.spell.id !== spellId),
    );
  }

  function handleDifficultyChange(spellId: string, difficulty: Difficulty) {
    setSelectedWizardSpells((prev) =>
      prev.map((wizardSpell) =>
        wizardSpell.spell.id === spellId
          ? { ...wizardSpell, difficulty }
          : wizardSpell,
      ),
    );
  }

  function handleSubmit() {
    const toCreate = {
      name,
      category: category as string,
      stats: Object.entries(wizardStats).map(([id, level]) => ({ id, level })),
      knowledges: Object.entries(wizardKnowledges).map(([id, level]) => ({
        id,
        level,
      })),
      spells: selectedWizardSpells.map((wizardSpell) => ({
        id: wizardSpell.spell.id,
        difficulty: wizardSpell.difficulty,
      })),
    };

    try {
      ApiL7RProvider.createWizard(toCreate);
      alert("Wizard created successfully!");
    } catch (error) {
      console.error("Error creating wizard:", error);
    }
  }

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
      <FormRow>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      <FormSection>
        <h3>Stats: {statsSum}</h3>
        <p>Choisissez bien!</p>
        <MultiColumnGrid>
          {stats.map((stat) => (
            <FormRow key={stat.id}>
              <label>{stat.name}:</label>
              <input
                type="number"
                value={wizardStats[stat.id]}
                onChange={(e) =>
                  setWizardStats({
                    ...wizardStats,
                    [stat.id]: parseInt(e.target.value, 10),
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
            <FormRow key={knowledge.id}>
              <label>{knowledge.name}:</label>
              <input
                type="number"
                value={wizardKnowledges[knowledge.id]}
                onChange={(e) =>
                  setWizardKnowledges({
                    ...wizardKnowledges,
                    [knowledge.id]: parseInt(e.target.value, 10),
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
            <option key={spell.id} value={spell.id}>
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
        <button onClick={handleSubmit}>Create Wizard</button>
      </FormRow>
    </MainContainer>
  );
}

interface SpellsListProps {
  wizardSpells: WizardSpell[];
  removeSpell: (spellId: string) => void;
  updateDifficulty: (spellId: string, difficulty: Difficulty) => void;
}

export function SpellsList({
  wizardSpells,
  removeSpell,
  updateDifficulty,
}: SpellsListProps) {
  const difficultyOptions = [
    Difficulty.DESAVANTAGE,
    Difficulty.NORMAL,
    Difficulty.AVANTAGE,
  ];

  return (
    <SpellsContainer>
      {wizardSpells.map((wizardSpell) => (
        <SpellRow key={wizardSpell.spell.id}>
          <span>{wizardSpell.spell.name}</span>
          <select
            value={wizardSpell.difficulty}
            onChange={(e) =>
              updateDifficulty(
                wizardSpell.spell.id,
                e.target.value as Difficulty,
              )
            }
          >
            {difficultyOptions.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          <button onClick={() => removeSpell(wizardSpell.spell.id)}>
            Remove
          </button>
        </SpellRow>
      ))}
    </SpellsContainer>
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

  label {
    margin-right: 10px;
  }

  input[type="number"] {
    width: 50px;
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
  }
`;
