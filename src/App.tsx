import React from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

export function App() {
  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: flex;
  width: 600px;
`;
