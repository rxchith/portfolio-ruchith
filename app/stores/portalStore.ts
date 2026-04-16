import { create } from 'zustand';

interface PortalStore {
  activePortalId: string | null;
  uiPortalNode: HTMLDivElement | null;
  setActivePortal: (activePortalId: string | null) => void;
  setUiPortalNode: (node: HTMLDivElement | null) => void;
}

export const usePortalStore = create<PortalStore>((set) => ({
  activePortalId: null,
  uiPortalNode: null,
  setActivePortal: (activePortalId) => set(() => ({ activePortalId })),
  setUiPortalNode: (uiPortalNode) => set(() => ({ uiPortalNode })),
}))
