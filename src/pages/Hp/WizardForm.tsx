import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ApiL7RProvider } from "../../data/api/ApiL7RProvider";
import { SchoolCategory } from "../../domain/models/SchoolCategory";

export function WizardForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SchoolCategory | undefined>(
    undefined,
  );
  const [stats, setStats] = useState<any[]>([]);
  const [knowledges, setKnowledges] = useState<any[]>([]);
  const [wizardStats, setWizardStats] = useState<Record<string, number>>({});
  const [wizardKnowledges, setWizardKnowledges] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    fetchStats();
    fetchKnowledges();
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

  async function handleSubmit() {
    const toCreate = {
      name,
      category: category as string,
      stats: Object.entries(wizardStats).map(([id, level]) => ({ id, level })),
      knowledges: Object.entries(wizardKnowledges).map(([id, level]) => ({
        id,
        level,
      })),
    };

    try {
      await ApiL7RProvider.createWizard(toCreate);
      alert("Wizard created successfully!");
    } catch (error) {
      console.error("Error creating wizard:", error);
    }
  }

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
        <h3>Stats</h3>
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
      </FormSection>
      <FormSection>
        <h3>Knowledges</h3>
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
      </FormSection>
      <FormRow>
        <button onClick={handleSubmit}>Create Wizard</button>
      </FormRow>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  padding: 20px;
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
