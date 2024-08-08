import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import {
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaDAndD,
} from "react-icons/fa";
import { MdEdit, MdSave } from "react-icons/md";
import { GiReturnArrow } from "react-icons/gi";

const API_URL = "https://l7r.fr/api/v1/diaries";
const CHARACTER_LIMIT = 300;

interface Entry {
  id?: string;
  year: number;
  month: number;
  day: number;
  text: string;
}

interface TileContentProps {
  date: Date;
  view: string;
}

const Diary: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [entries, setEntries] = useState<{ [key: number]: Entry }>({});
  const [missingDates, setMissingDates] = useState<
    { day: number; month: number; year: number }[]
  >([]);
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [newText, setNewText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    fetchEntries();
    fetchMissingDates();
  }, [date]);

  const fetchEntries = async () => {
    try {
      /*const response = await axios.get(
        `${API_URL}?day=${date.getDate()}&month=${date.getMonth() + 1}`,
      );
      const data = response.data;*/
      const data =
        '[{"id":"013211e3-3dae-472b-b757-dfa759537f66","text":"Bon cette fois, pas de technique spéciale hier, du coup gueule de bois la journée. Je recommence Avatar (c’est trop bien) et je continue les The Good Place avec Chéri, rien de nouveau donc… BlastoDice avec Nico et Flo le soir, on kiffe même un jeu basé sur les couleurs !","day":7,"month":8,"year":2021,"lastUpdate":"2024-06-15T12:24:37.000Z"},{"id":"7a144318-9214-49ce-9c9f-7c6083da298a","text":"Dernier petit dej à Tivoli, on se pose un peu en bord de piscine puis on finit par partir. Etrangement, pas de souci de checkout avec l’hôtel ! On prend un “Uberto”, puis sous 40° on atteint l’aéroport, on mange des pasteis de nata, on attend, et enfin vol puis on rejoint la famille de Chéri !","day":7,"month":8,"year":2023,"lastUpdate":"2024-06-15T12:24:38.000Z"},{"id":"62100e76-1214-417c-8869-edb78a241202","text":"Dès le réveil, c’est parti : je finis Smallville ! Un sentiment étrange, après 10 saisons… Mais c’était quand même pas ouf ^^ Et on continue l’installation de la chambre d’amis, avec des boîtes dans des boîtes dans des boîtes.. Mais ça rend bien :) Roi Lion 2 le soir avec Chéri !","day":7,"month":8,"year":2022,"lastUpdate":"2024-06-15T12:39:37.000Z"},{"id":"b778834b-aa43-4804-847b-5044204bcabc","text":"journée efficace au boulot, me suis lancé dans la généricité du système d\'annonces et messages, quelle usine à gazes... Je tue Séphitoth à KH1 en rentrant, et je me lance dans le leveling du 2. Soirée Umbrella avec Chéri, il a enfin fini par accrocher à la série !","day":7,"month":8,"year":2020,"lastUpdate":"2024-06-23T08:24:01.000Z"}]';
      const dataJson = JSON.parse(data);
      const entriesByYear = dataJson.reduce(
        (acc: { [key: number]: Entry }, entry: Entry) => {
          acc[entry.year] = entry;
          return acc;
        },
        {},
      );
      setEntries(entriesByYear);

      const currentYear = date.getFullYear();
      const updatedYears = Array.from(
        { length: currentYear - 2020 + 1 },
        (_, i) => currentYear - i,
      ).filter((year) => year <= currentYear);
      setYears(updatedYears);
    } catch (error) {
      console.error("Error fetching entries", error);
    }
  };

  const fetchMissingDates = async () => {
    try {
      const response = await axios.get(`${API_URL}/missing`);
      setMissingDates(response.data);
    } catch (error) {
      console.error("Error fetching missing dates", error);
    }
  };

  const handlePrevDay = () => {
    setDate(new Date(date.setDate(date.getDate() - 1)));
  };

  const handleNextDay = () => {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow <= new Date()) {
      setDate(tomorrow);
    }
  };

  const handleToday = () => {
    setDate(new Date());
  };

  const handleEditClick = (year: number, text: string) => {
    setEditingYear(year);
    setNewText(text);
  };

  const handleSaveClick = async (year: number) => {
    const existingEntry = entries[year];
    if (existingEntry) {
      // Update existing entry
      try {
        await axios.put(`${API_URL}/${existingEntry.id}`, {
          ...existingEntry,
          text: newText,
        });
        fetchEntries();
      } catch (error) {
        console.error("Error updating entry", error);
      }
    } else {
      // Create new entry
      try {
        await axios.post(API_URL, {
          text: newText,
          day: date.getDate(),
          month: date.getMonth() + 1,
          year,
        });
        fetchEntries();
      } catch (error) {
        console.error("Error creating entry", error);
      }
    }
    setEditingYear(null);
    setNewText("");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewText(e.target.value);
  };

  const formattedDate = format(date, "d MMMM", { locale: fr });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof Date
    ) {
      setDate(value[0]);
    }
    closeModal();
  };

  const goToLastMissingDate = () => {
    if (missingDates.length > 0) {
      const lastMissingDate = missingDates[missingDates.length - 1];
      setDate(
        new Date(
          lastMissingDate.year,
          lastMissingDate.month - 1,
          lastMissingDate.day,
        ),
      );
    }
  };

  const getTileContent = ({ date, view }: TileContentProps) => {
    if (view === "month") {
      const isMissing = missingDates.some(
        (missingDate) =>
          missingDate.day === date.getDate() &&
          missingDate.month === date.getMonth() + 1,
      );

      if (isMissing) {
        return <span style={{ color: "red", fontWeight: "bold" }}>•</span>;
      }
    }
    return null;
  };

  return (
    <DiaryContainer>
      <DateNavigation>
        <Button onClick={goToLastMissingDate}>
          <GiReturnArrow />
        </Button>
        <Button onClick={openModal}>
          <FaCalendar />
        </Button>
        <Button onClick={handlePrevDay}>
          <FaChevronLeft />
        </Button>
        <DateDisplay>{formattedDate}</DateDisplay>
        <Button onClick={handleNextDay}>
          <FaChevronRight />
        </Button>
        <Button onClick={handleToday}>
          <FaDAndD />
        </Button>
      </DateNavigation>
      <DiaryEntry>
        {years.map((year) => (
          <EntryContainer key={year}>
            <EntryYear>{year}</EntryYear>
            {editingYear === year ? (
              <>
                <TextArea value={newText} onChange={handleTextChange} />
                <EditButton onClick={() => handleSaveClick(year)}>
                  <MdSave />
                </EditButton>
              </>
            ) : (
              <>
                <EntryText>{entries[year]?.text || "À remplir"}</EntryText>
                <EditButton
                  onClick={() =>
                    handleEditClick(year, entries[year]?.text || "")
                  }
                >
                  <MdEdit />
                </EditButton>
              </>
            )}
          </EntryContainer>
        ))}
      </DiaryEntry>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Select Date"
      >
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={getTileContent}
        />
        <Button onClick={closeModal}>Fermer</Button>
      </Modal>
    </DiaryContainer>
  );
};

// Styles
const DiaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 100vw;
  overflow-x: hidden;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  button {
    flex: 1;
    min-width: 40px;
    max-width: 80px;
    white-space: pre-wrap; /* Allow button text to wrap */
  }
`;

const DateDisplay = styled.span`
  margin: 0 10px;
  @media (max-width: 768px) {
    margin: 5px 0;
    flex-basis: 100%;
    text-align: center;
  }
`;

const DiaryEntry = styled.div`
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 10px;
  }
`;

const EntryContainer = styled.div`
  margin-bottom: 10px;
  word-break: break-word; /* Ensure text does not overflow */
`;

const EntryYear = styled.h2`
  margin: 10px 0;
`;

const EntryText = styled.p`
  white-space: pre-wrap; /* preserve whitespace */
  word-break: break-word; /* Ensure text does not overflow */
`;

const Button = styled.button`
  margin: 0 5px;
  @media (max-width: 768px) {
    margin: 5px 0;
    width: 100%;
  }
`;

const EditButton = styled.button`
  margin-left: 10px;
  @media (max-width: 768px) {
    margin: 10px 0;
    width: 100%;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  @media (max-width: 768px) {
    width: calc(100% - 20px);
    padding: 10px;
  }
`;

export default Diary;
