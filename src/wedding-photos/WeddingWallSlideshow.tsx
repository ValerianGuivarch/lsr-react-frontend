import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import config from "../../src/config/config";

const API_URL = `${config.BASE_URL}/wedding-photos`;

type PhotoItem = {
  id: string;
  createdAt: string;
  url: string;
  thumbUrl: string;
};

type LatestResponse = { ok: true; items: PhotoItem[] };

const DISPLAY_MS = 6000;
const FADE_MS = 900;

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    margin: 0;
    width: 100%;
    max-width: 100%;
    overflow: hidden; /* ✅ stop scroll horizontal */
  }
  *, *::before, *::after { box-sizing: border-box; }
`;

function normalizeUrl(u: string): string {
  // si ton API renvoie "/api/..." => on préfixe avec BASE_URL
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `${config.BASE_URL}${u}`;
  return u;
}

export default function WeddingWallSlideshow() {
  const [current, setCurrent] = useState<PhotoItem | null>(null);
  const [next, setNext] = useState<PhotoItem | null>(null);
  const [fading, setFading] = useState(false);
  const [status, setStatus] = useState<string>("Chargement…");

  const currentRef = useRef<PhotoItem | null>(null);
  const runningRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const pickRandom = (items: PhotoItem[]) =>
    items[Math.floor(Math.random() * items.length)];

  const fetchItems = async (): Promise<PhotoItem[]> => {
    const res = await axios.get<LatestResponse>(`${API_URL}/latest`, {
      params: { limit: 200 },
      timeout: 20_000,
    });
    return res.data?.items ?? [];
  };

  const showFirst = async () => {
    try {
      const items = await fetchItems();
      if (items.length === 0) {
        setStatus("En attente de photos…");
        return;
      }
      const first = items[0];
      const fixed = {
        ...first,
        url: normalizeUrl(first.url),
        thumbUrl: normalizeUrl(first.thumbUrl),
      };

      currentRef.current = fixed;
      setCurrent(fixed);
      setStatus("");
    } catch (e: any) {
      setStatus(`Erreur latest: ${e?.message ?? e}`);
    }
  };

  const advance = async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    try {
      const items = await fetchItems();
      if (items.length === 0) {
        setStatus("En attente de photos…");
        runningRef.current = false;
        return;
      }

      const chosen = pickRandom(items);
      const item = {
        ...chosen,
        url: normalizeUrl(chosen.url),
        thumbUrl: normalizeUrl(chosen.thumbUrl),
      };

      // Si on n’a pas encore de current -> on affiche direct
      if (!currentRef.current) {
        currentRef.current = item;
        setCurrent(item);
        setStatus("");
        runningRef.current = false;
        return;
      }

      setNext(item);
      setFading(true);

      window.setTimeout(() => {
        currentRef.current = item;
        setCurrent(item);
        setNext(null);
        setFading(false);
        runningRef.current = false;
      }, FADE_MS);
    } catch (e: any) {
      setStatus(`Erreur latest: ${e?.message ?? e}`);
      runningRef.current = false;
    }
  };

  useEffect(() => {
    // ✅ on lance UNE SEULE FOIS (plus de dépendance à current)
    void showFirst();

    timerRef.current = window.setInterval(() => {
      void advance();
    }, DISPLAY_MS);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <GlobalStyle />

      <Page>
        <Stage onClick={() => void advance()}>
          {current && <Layer $src={current.url} $visible={!fading} />}
          {next && <Layer $src={next.url} $visible={fading} />}

          {!current && (
            <Empty>
              <EmptyText>{status}</EmptyText>
            </Empty>
          )}

          {status && current && <Toast>{status}</Toast>}
        </Stage>
      </Page>
    </>
  );
}

/* ===== styles ===== */

const Page = styled.div`
  position: fixed;
  inset: 0; /* ✅ pas de dépassement */
  background: #000;
  overflow: hidden; /* ✅ */
`;

const Stage = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const Layer = styled.div<{ $src: string; $visible: boolean }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.$src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity ${FADE_MS}ms ease;
  will-change: opacity;
`;

const Empty = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
  text-align: center;
  padding: 16px;
`;

const EmptyText = styled.div`
  opacity: 0.85;
  font-size: 14px;
  overflow-wrap: anywhere;
`;

const Toast = styled.div`
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 13px;
  max-width: calc(100% - 24px);
  overflow-wrap: anywhere;
`;
