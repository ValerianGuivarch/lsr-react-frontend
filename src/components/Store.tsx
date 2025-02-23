import React from "react";
import styled from "styled-components";
import axios from "axios";

const API_URL = "https://l7r.fr/api/v1/diaries/store";

const StoreControl: React.FC = () => {
  const handleAction = async (store: string, action: string) => {
    try {
      await axios.post(`${API_URL}/${store}/${action}`);
      alert(`${store} : commande ${action} envoyée.`);
    } catch (error) {
      alert(`Erreur lors de l'envoi de la commande à ${store}`);
    }
  };

  return (
    <ControlContainer>
      <StoreContainer>
        <h3>Store Salon</h3>
        <Button onClick={() => handleAction("StoreSalon", "UP")}>Monter</Button>
        <Button onClick={() => handleAction("StoreSalon", "STOP")}>
          Stop/My
        </Button>
        <Button onClick={() => handleAction("StoreSalon", "DOWN")}>
          Descendre
        </Button>
      </StoreContainer>
      <StoreContainer>
        <h3>Store Cuisine</h3>
        <Button onClick={() => handleAction("StoreCuisine", "UP")}>
          Monter
        </Button>
        <Button onClick={() => handleAction("StoreCuisine", "STOP")}>
          Stop/My
        </Button>
        <Button onClick={() => handleAction("StoreCuisine", "DOWN")}>
          Descendre
        </Button>
      </StoreContainer>
    </ControlContainer>
  );
};

const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`;

const StoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  h3 {
    margin: 0;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
`;

export default StoreControl;
