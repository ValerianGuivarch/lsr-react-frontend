import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaSyncAlt, FaExpand, FaCompress } from "react-icons/fa";

import config from "../../src/config/config";

const API_URL = `${config.BASE_URL}/wedding-photos`;

type PhotoItem = {
  id: string;
  url: string; // ex: "/api/wedding-photos/original/xxx.jpg" (ou autre)
  thumbUrl: string; // ex: "/api/wedding-photos/thumb/xxx_thumb.jpg" (ou autre)
  createdAt?: string;
};

const POLL_MS = 3000;
const LIMIT = 120;

function filenameFromPath(pathOrUrl: string): string {
  // prend le dernier segment après le dernier '/'
  const clean = (pathOrUrl || "").split("?")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || "";
}

function toThumbQueryUrl(it: PhotoItem): string {
  const name = filenameFromPath(it.thumbUrl || it.url);
  return `${API_URL}/thumb?name=${encodeURIComponent(name)}`;
}

function toOriginalQueryUrl(it: PhotoItem): string {
  const name = filenameFromPath(it.url || it.thumbUrl);
  return `${API_URL}/original?name=${encodeURIComponent(name)}`;
}

const WeddingWall: React.FC = () => {
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [status, setStatus] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const pollTimer = useRef<number | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const fetchLatest = async () => {
    try {
      const res = await axios.get(`${API_URL}/latest`, {
        params: { limit: LIMIT },
        timeout: 20_000,
      });
      const list: PhotoItem[] =
        res.data?.items ?? res.data?.data ?? res.data?.photos ?? [];
      setItems(list);
      setStatus(`Mur de photos — ${list.length} photos`);
    } catch (err: any) {
      setStatus(`Erreur chargement: ${err?.message ?? err}`);
    }
  };

  const startPolling = () => {
    stopPolling();
    pollTimer.current = window.setInterval(() => {
      void fetchLatest();
    }, POLL_MS);
  };

  const stopPolling = () => {
    if (pollTimer.current) {
      window.clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  };

  const startSSE = () => {
    try {
      stopSSE();
      const es = new EventSource(`${API_URL}/stream`);
      esRef.current = es;

      es.addEventListener("refresh", () => {
        void fetchLatest();
      });
      es.addEventListener("error", () => {
        startPolling();
      });
    } catch {
      startPolling();
    }
  };

  const stopSSE = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  };

  useEffect(() => {
    void fetchLatest();
    startSSE();
    startPolling();

    return () => {
      stopSSE();
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // ignore
    }
  };

  return (
    <Page>
      <Header>
        <HeaderLeft>{status || "Mur de photos"}</HeaderLeft>
        <HeaderRight>
          <HeaderButton onClick={() => void fetchLatest()} title="Rafraîchir">
            <FaSyncAlt />
          </HeaderButton>
          <HeaderButton onClick={toggleFullscreen} title="Plein écran">
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </HeaderButton>
        </HeaderRight>
      </Header>

      <Grid>
        {items.map((it) => {
          const src = toThumbQueryUrl(it);

          // Optionnel: clic pour ouvrir l'original
          const original = toOriginalQueryUrl(it);

          return (
            <a key={it.id} href={original} target="_blank" rel="noreferrer">
              <Thumb src={src} alt="" loading="lazy" />
            </a>
          );
        })}
      </Grid>
    </Page>
  );
};

const Page = styled.div`
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: #111;
  color: #fff;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
`;

const HeaderLeft = styled.div`
  font-weight: 600;
  opacity: 0.95;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 10px;
`;

const HeaderButton = styled.button`
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 10px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Thumb = styled.img`
  width: 100%;
  height: 16vw;
  object-fit: cover;
  border-radius: 10px;
  display: block;

  @media (max-width: 1100px) {
    height: 22vw;
  }
  @media (max-width: 700px) {
    height: 40vw;
  }
`;

export default WeddingWall;
