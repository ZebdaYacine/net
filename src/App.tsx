import { ChangeEvent, FormEvent, useMemo } from "react";

import { Device } from "./components/layout/Device";
import { DeviceModal } from "./components/app/DeviceModal";
import { DeviceToolbar } from "./components/app/DeviceToolbar";
import { SelectedPortsCard } from "./components/app/SelectedPortsCard";
import { CommittedLinksCard } from "./components/app/CommittedLinksCard";
import { ThemeToggleButton } from "./components/app/ThemeToggleButton";
import { Toaster, toast } from "./components/ui/sonner";
import {
  useAppViewModel,
  type DeviceModel,
  type SelectedPortEntry,
} from "./Appviewmodel";

const defaultDevices: DeviceModel[] = [
  {
    id: "device-core-1",
    name: "Core Switch",
    nbrPort: 48,
    portType: "Gigabit Ethernet",
    order: "sv",
    location: "Data Center - Rack A",
  },
  {
    id: "device-core-2",
    name: "Core Switch",
    nbrPort: 24,
    portType: "Gigabit Ethernet",
    order: "sv",
    location: "Etage 1",
  },
];

const MAX_DEVICES = 2;
const isBrowser = typeof window !== "undefined";

function App() {
  const { state, actions } = useAppViewModel(defaultDevices);
  const { devices, links, selectedPorts, showModal, formState } = state;
  const {
    openModal,
    closeModal,
    updateForm,
    addDevice,
    removeDevice,
    togglePort,
    commitLink,
    undoSelection,
    clearAll,
  } = actions;

  const deviceNameLookup = useMemo(
    () =>
      devices.reduce<Record<string, string>>((acc, device) => {
        acc[device.id] = device.name;
        return acc;
      }, {}),
    [devices]
  );

  const linkedPortsMap = useMemo(
    () =>
      links.reduce<Record<string, number[]>>((acc, link) => {
        link.forEach(({ deviceId, portNumber }) => {
          if (!acc[deviceId]) acc[deviceId] = [];
          if (!acc[deviceId].includes(portNumber)) {
            acc[deviceId].push(portNumber);
          }
        });
        return acc;
      }, {}),
    [links]
  );

  const selectionLocked = selectedPorts.length >= 2;

  const getDeviceSelectedPorts = (deviceId: string) =>
    selectedPorts
      .filter((entry) => entry.deviceId === deviceId)
      .map((entry) => entry.portNumber)
      .sort((a, b) => a - b);

  const formatPortLabel = (entry: SelectedPortEntry) =>
    `${deviceNameLookup[entry.deviceId] ?? entry.deviceId} · Port ${
      entry.portNumber
    }`;

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    updateForm(name, value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (devices.length >= MAX_DEVICES) {
      toast.error("Limit reached", {
        description: "Only two devices can be displayed. Remove one first.",
      });
      return;
    }
    addDevice();
  };

  const handleOpenModal = () => {
    if (devices.length >= MAX_DEVICES) {
      toast.error("Limit reached", {
        description: "Only two devices can be displayed. Remove one first.",
      });
      return;
    }
    openModal();
  };

  const handlePrintCommittedLinks = () => {
    if (!isBrowser) return;
    window.print();
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_50%)]">
        <ThemeToggleButton />

        <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12">
          <DeviceToolbar
            canClear={devices.length > 0}
            onClear={clearAll}
            onInsert={handleOpenModal}
          />

          {selectedPorts.length > 0 && (
            <SelectedPortsCard
              selectedPorts={selectedPorts}
              formatPortLabel={formatPortLabel}
              onUndo={undoSelection}
              onCommit={commitLink}
            />
          )}

          {links.length > 0 && (
            <CommittedLinksCard
              links={links}
              formatPortLabel={formatPortLabel}
              onPrint={handlePrintCommittedLinks}
            />
          )}

          {devices.map((device) => {
            const { id, ...deviceProps } = device;
            const selected = getDeviceSelectedPorts(id);
            return (
              <Device
                key={id}
                {...deviceProps}
                onRemove={() => removeDevice(id)}
                selectedPorts={selected}
                onTogglePort={(port) => togglePort(id, port)}
                selectionLocked={selectionLocked}
                linkedPorts={linkedPortsMap[id] ?? []}
              />
            );
          })}
        </main>

        <DeviceModal
          isOpen={showModal}
          formState={formState}
          onClose={closeModal}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      </div>
      <Toaster />
    </>
  );
}

export default App;
