import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 750px;
  margin: 10px;
`;

const NotesInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
`;

export interface CharacterNotesProps {}

export function CharacterNotes(props: CharacterNotesProps) {
    const [notes, setNotes] = React.useState<string>('');
    const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(e.target.value);
    };

    return (
        <Container>
            <NotesInput type="text" />
        </Container>
    );
};