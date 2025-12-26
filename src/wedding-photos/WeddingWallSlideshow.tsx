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
    overflow: hidden;
    background: #000;
  }
  *, *::before, *::after { box-sizing: border-box; }
`;

function normalizeUrl(u: string): string {
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return `${config.BASE_URL}${u}`;
  return u;
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function pickRandomDifferent(items: PhotoItem[], lastId?: string): PhotoItem {
  if (items.length === 1) return items[0];
  const candidates = lastId ? items.filter((it) => it.id !== lastId) : items;
  const pool = candidates.length > 0 ? candidates : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function WeddingWallSlideshow() {
  const [current, setCurrent] = useState<PhotoItem | null>(null);
  const [next, setNext] = useState<PhotoItem | null>(null);
  const [nextOpacity, setNextOpacity] = useState(0); // ✅ contrôle fin, sans toucher current
  const [status, setStatus] = useState<string>("Chargement…");

  const currentRef = useRef<PhotoItem | null>(null);
  const runningRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const fetchItems = async (): Promise<PhotoItem[]> => {
    const res = await axios.get<LatestResponse>(`${API_URL}/latest`, {
      params: { limit: 200 },
      timeout: 20_000,
    });
    const items = res.data?.items ?? [];
    return items.map((it) => ({
      ...it,
      url: normalizeUrl(it.url),
      thumbUrl: normalizeUrl(it.thumbUrl),
    }));
  };

  const showFirst = async () => {
    try {
      const items = await fetchItems();
      if (items.length === 0) {
        setStatus("En attente de photos…");
        return;
      }
      const first = items[0]; // priorité au plus récent
      await preloadImage(first.url);

      currentRef.current = first;
      setCurrent(first);
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

      const lastId = currentRef.current?.id;
      const chosen = pickRandomDifferent(items, lastId);

      // 1ère image si aucune
      if (!currentRef.current) {
        await preloadImage(chosen.url);
        currentRef.current = chosen;
        setCurrent(chosen);
        setStatus("");
        runningRef.current = false;
        return;
      }

      // Précharge
      await preloadImage(chosen.url);

      // Monte "next" au-dessus, opacity 0 => 1
      setNext(chosen);
      setNextOpacity(0);

      requestAnimationFrame(() => {
        // un frame après, on lance le fade-in
        setNextOpacity(1);
      });

      // Après fade: commit sans re-fader
      window.setTimeout(() => {
        currentRef.current = chosen;
        setCurrent(chosen);
        setNext(null);
        setNextOpacity(0);
        runningRef.current = false;
      }, FADE_MS);
    } catch (e: any) {
      setStatus(`Erreur latest: ${e?.message ?? e}`);
      runningRef.current = false;
    }
  };

  useEffect(() => {
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
          {/* current reste stable, jamais d’opacité animée => plus de "2e flash" */}
          {current && <Layer $src={current.url} $opacity={1} />}

          {/* next fade-in par dessus */}
          {next && <Layer $src={next.url} $opacity={nextOpacity} $isNext />}

          {!current && (
            <Empty>
              <EmptyText>{status}</EmptyText>
            </Empty>
          )}
        </Stage>
      </Page>
    </>
  );
}

const Page = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  overflow: hidden;
`;

const Stage = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const Layer = styled.div<{ $src: string; $opacity: number; $isNext?: boolean }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.$src});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  opacity: ${(p) => p.$opacity};
  transition: ${(p) => (p.$isNext ? `opacity ${FADE_MS}ms ease` : "none")};
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
