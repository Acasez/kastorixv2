// src/hooks/useModal.ts
import { create } from "zustand";
import type { ModalRequest } from "../components/ModalViews/modalTypes";

type ModalState = {
  request: ModalRequest | null;
  openModal: (request: ModalRequest) => void;
  closeModal: () => void;
};

export const useModal = create<ModalState>((set) => ({
  request: null,
  openModal: (request) => set({ request }),
  closeModal: () => set({ request: null }),
}));
