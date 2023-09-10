import React from "react";
import styled from "styled-components";

export interface CharacterNotesProps {}

export function CharacterNotes(props: CharacterNotesProps) {
  const [notes, setNotes] = React.useState<string>("");
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(e.target.value);
  };

  return (
    <Container>
      <NotesInput type="text" />
    </Container>
  );
}
const NotesInput = styled.input`
  width: 100%; // Prend toute la largeur du conteneur
  padding: 10px;
  font-size: 16px;
  box-sizing: border-box; // Inclut les paddings dans la largeur totale
  height: 100px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 520px; // Largeur maximale de 600px
  margin: 10px;
  box-sizing: border-box; // Inclut les marges et les bordures dans la largeur totale
`;
