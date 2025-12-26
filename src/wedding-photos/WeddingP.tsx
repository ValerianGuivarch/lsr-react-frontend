import React, { useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaCamera, FaRedo, FaCloudUploadAlt } from "react-icons/fa";
import config from "../../src/config/config";

const API_URL = `${config.BASE_URL}/wedding-photos`;

// Taille max côté client pour éviter d'exploser le réseau (en px)
const MAX_DIMENSION = 2000;
// Qualité JPEG (0..1)
const JPEG_QUALITY = 0.82;

const WeddingP: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [jpegBlob, setJpegBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<{
    kind: "idle" | "ok" | "err";
    text: string;
  }>({
    kind: "idle",
    text: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const reset = () => {
    setPreviewUrl(null);
    setJpegBlob(null);
    setStatus({ kind: "idle", text: "" });
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({ kind: "idle", text: "" });
    setPreviewUrl(null);
    setJpegBlob(null);

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { blob, dataUrl } = await fileToJpeg(
        file,
        MAX_DIMENSION,
        JPEG_QUALITY,
      );
      setJpegBlob(blob);
      setPreviewUrl(dataUrl);
    } catch (err: any) {
      setStatus({
        kind: "err",
        text: `Impossible de préparer la photo : ${err?.message ?? err}`,
      });
    }
  };

  const upload = async () => {
    if (!jpegBlob) return;

    setIsUploading(true);
    setStatus({ kind: "idle", text: "Envoi…" });

    try {
      const fd = new FormData();
      fd.append("file", jpegBlob, "photo.jpg");

      const url = `${API_URL}/upload`;
      const response = await axios.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60_000,
      });

      if (!response.data?.ok) throw new Error("Réponse API inattendue");

      setStatus({ kind: "ok", text: "✅ Merci ! Photo envoyée." });
    } catch (err: any) {
      setStatus({
        kind: "err",
        text: `❌ Échec de l’envoi : ${
          err?.response?.data?.message ?? err?.message ?? err
        }`,
      });
      setIsUploading(false);
      return;
    }

    setIsUploading(false);
  };

  return (
    <Page>
      <Card>
        <Title>📸 Photo</Title>
        <Subtitle>Prends une photo puis envoie-la.</Subtitle>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFileChange}
        />

        <ButtonRow>
          <ActionButton onClick={openCamera} disabled={isUploading}>
            <FaCamera /> Prendre une photo
          </ActionButton>

          <ActionButton onClick={reset} disabled={isUploading && !previewUrl}>
            <FaRedo /> Reprendre
          </ActionButton>
        </ButtonRow>

        {previewUrl && (
          <>
            <Preview>
              <img src={previewUrl} alt="Aperçu" />
            </Preview>

            <ButtonRow>
              <PrimaryButton
                onClick={upload}
                disabled={!jpegBlob || isUploading}
              >
                <FaCloudUploadAlt /> {isUploading ? "Envoi…" : "Envoyer"}
              </PrimaryButton>
            </ButtonRow>
          </>
        )}

        {status.text && <Status $kind={status.kind}>{status.text}</Status>}
      </Card>
    </Page>
  );
};

async function fileToJpeg(
  file: File,
  maxDim: number,
  quality: number,
): Promise<{ blob: Blob; dataUrl: string }> {
  // On passe par un <img> + canvas : souvent plus robuste sur mobile (y compris iOS)
  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);

  const { width, height } = fitWithin(
    img.naturalWidth,
    img.naturalHeight,
    maxDim,
  );
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non disponible");

  ctx.drawImage(img, 0, 0, width, height);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob a échoué"))),
      "image/jpeg",
      quality,
    );
  });

  // preview légère (pas forcément full quality)
  const preview = canvas.toDataURL("image/jpeg", 0.7);
  return { blob, dataUrl: preview };
}

function fitWithin(w: number, h: number, maxDim: number) {
  const scale = Math.min(1, maxDim / Math.max(w, h));
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

function readAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Lecture fichier impossible"));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image illisible"));
    img.src = src;
  });
}

// Styles (proche de ton Diary)
const Page = styled.div`
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

const Card = styled.div`
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  margin: 0 0 6px 0;
`;

const Subtitle = styled.p`
  margin: 0 0 14px 0;
  opacity: 0.85;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 0;

  button {
    flex: 1;
    min-width: 180px;

    @media (max-width: 768px) {
      width: 100%;
      min-width: unset;
    }
  }
`;

const ActionButton = styled.button`
  padding: 12px 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const PrimaryButton = styled(ActionButton)`
  font-weight: 700;
`;

const Preview = styled.div`
  margin-top: 10px;

  img {
    width: 100%;
    border-radius: 12px;
  }
`;

const Status = styled.p<{ $kind: "idle" | "ok" | "err" }>`
  margin-top: 12px;
  white-space: pre-wrap;
  color: ${(p) =>
    p.$kind === "ok" ? "green" : p.$kind === "err" ? "#b00020" : "inherit"};
`;

const Hint = styled.p`
  margin-top: 16px;
  opacity: 0.8;

  code {
    background: rgba(0, 0, 0, 0.06);
    padding: 2px 6px;
    border-radius: 6px;
  }
`;

export default WeddingP;
