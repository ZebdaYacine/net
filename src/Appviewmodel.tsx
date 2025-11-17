// src/viewmodels/AppViewModel.ts
import { useEffect, useState } from "react";
import { DeviceProps } from "./components/layout/Device";

export type DeviceModel = DeviceProps & { id: string };
export type SelectedPortEntry = { deviceId: string; portNumber: number };
export type PortLink = [SelectedPortEntry, SelectedPortEntry];

const STORAGE_KEYS = {
  devices: "net-devices",
  links: "net-device-links",
};

const createEmptyDevice = (): DeviceProps => ({
  name: "",
  nbrPort: 8,
  portType: "",
  order: "sv",
  location: "",
});

const isBrowser = typeof window !== "undefined";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

const generateDeviceId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function useAppViewModel(defaultDevices: DeviceModel[]) {
  const [devices, setDevices] = useState<DeviceModel[]>(() =>
    isBrowser
      ? safeParse<DeviceModel[]>(
          localStorage.getItem(STORAGE_KEYS.devices),
          defaultDevices
        )
      : defaultDevices
  );

  const [links, setLinks] = useState<PortLink[]>(() =>
    isBrowser
      ? safeParse<PortLink[]>(localStorage.getItem(STORAGE_KEYS.links), [])
      : []
  );

  const [selectedPorts, setSelectedPorts] = useState<SelectedPortEntry[]>([]);
  const [formState, setFormState] = useState<DeviceProps>(createEmptyDevice());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.links, JSON.stringify(links));
  }, [links]);

  const actions = {
    openModal: () => setShowModal(true),
    closeModal: () => {
      setFormState(createEmptyDevice());
      setShowModal(false);
    },

    updateForm: (name: string, value: string | number) => {
      setFormState((prev) =>
        ({
          ...prev,
          [name]:
            name === "nbrPort"
              ? Math.max(1, Number(value))
              : value,
        }) as DeviceProps
      );
    },

    addDevice: () => {
      const newDevice: DeviceModel = { id: generateDeviceId(), ...formState };
      setDevices((prev) => [...prev, newDevice]);
      setFormState(createEmptyDevice());
      setShowModal(false);
    },

    removeDevice: (id: string) => {
      setDevices((prev) => prev.filter((d) => d.id !== id));
      setSelectedPorts((prev) => prev.filter((p) => p.deviceId !== id));
      setLinks((prev) =>
        prev.filter((link) => !link.some((p) => p.deviceId === id))
      );
    },

    togglePort: (deviceId: string, portNumber: number) => {
      setSelectedPorts((prev) => {
        const exists = prev.some(
          (p) => p.deviceId === deviceId && p.portNumber === portNumber
        );
        if (exists)
          return prev.filter(
            (p) => !(p.deviceId === deviceId && p.portNumber === portNumber)
          );
        if (prev.length >= 2) return prev;
        return [...prev, { deviceId, portNumber }];
      });
    },

    commitLink: () => {
      if (selectedPorts.length === 2) {
        setLinks((prev) => [...prev, [selectedPorts[0], selectedPorts[1]]]);
        setSelectedPorts([]);
      }
    },

    undoSelection: () => setSelectedPorts([]),

    clearAll: () => {
      setDevices([]);
      setSelectedPorts([]);
      setLinks([]);
    },
  };

  return {
    state: {
      devices,
      links,
      selectedPorts,
      showModal,
      formState,
    },
    actions,
  };
}
