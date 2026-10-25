// src/components/ModalViews/ModalProvider.tsx
"use client";
import { useModal } from "../../hooks/useModal";
import ModalWrapper from "./ModalWrapper";

export function ModalProvider() {
  const { request, closeModal } = useModal();

  if (!request) return null;

  return <ModalWrapper request={request} closeModal={closeModal} />;
}
