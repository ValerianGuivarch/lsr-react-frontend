import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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

export default function WeddingWallSlideshow() {
  const [current, setCurrent] = useState<PhotoItem | null>(null);
  const [next, setNext] = useState<PhotoItem | null>(null);
  const [fading, setFading] = useState(false);

  const timerRef = useRef<number | null>(null);

  const pickRandom = (items: PhotoItem[]) =>
    items[Math.floor(Math.random() * items.length)];

  const loadFirst = async () => {
    const res = await axios.get<LatestResponse>(`${API_URL}/latest`, {
      params: { limit: 200 },
      timeout: 20_000,
    });
    const items = res.data.items || [];
    if (items.length === 0) return;

    // 1ère fois : priorité au plus récent => items[0]
    setCurrent(items[0]);
  };

  const advance = async () => {
    const res = await axios.get<LatestResponse>(`${API_URL}/latest`, {
      params: { limit: 200 },
      timeout: 20_000,
    });
    const items = res.data.items || [];
    if (items.length === 0) return;

    const item = pickRandom(items);

    if (!current) {
      setCurrent(item);
      return;
    }

    setNext(item);
    setFading(true);

    window.setTimeout(() => {
      setCurrent(item);
      setNext(null);
      setFading(false);
    }, FADE_MS);
  };

  useEffect(() => {
    void loadFirst();

    timerRef.current = window.setInterval(() => {
      void advance();
    }, DISPLAY_MS);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <Page>
      <Stage onClick={() => void advance()}>
        {current && <Layer $src={current.url} $visible={!fading} />}
        {next && <Layer $src={next.url} $visible={fading} />}
      </Stage>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden; /* ✅ supprime le scroll horizontal */
  background: #000;
`;

const Stage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
`;
