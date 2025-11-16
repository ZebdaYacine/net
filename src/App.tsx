import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Moon, Sun, Printer } from "lucide-react";

import { Button } from "./components/ui/button";
import { Toaster, toast } from "./components/ui/sonner";

import { useTheme } from "./context/theme-context";
import { Device, DeviceProps } from "./components/layout/Device";

type DeviceModel = DeviceProps & { id: string };

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

const generateDeviceId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;

type SelectedPortEntry = {
  deviceId: string;
  portNumber: number;
};

type PortLink = [SelectedPortEntry, SelectedPortEntry];

const isBrowser = typeof window !== "undefined";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [devices, setDevices] = useState<DeviceModel[]>(() =>
    isBrowser
      ? safeParse<DeviceModel[]>(
          window.localStorage.getItem(STORAGE_KEYS.devices),
          defaultDevices
        )
      : defaultDevices
  );
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState<DeviceProps>(() =>
    createEmptyDevice()
  );
  const [selectedPorts, setSelectedPorts] = useState<SelectedPortEntry[]>([]);
  const [links, setLinks] = useState<PortLink[]>(() =>
    isBrowser
      ? safeParse<PortLink[]>(
          window.localStorage.getItem(STORAGE_KEYS.links),
          []
        )
      : []
  );

  useEffect(() => {
    if (!isBrowser) return;
    window.localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    if (!isBrowser) return;
    window.localStorage.setItem(STORAGE_KEYS.links, JSON.stringify(links));
  }, [links]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => {
      switch (name) {
        case "name":
          return { ...prev, name: value };
        case "location":
          return { ...prev, location: value };
        case "portType":
          return { ...prev, portType: value };
        case "order":
          return { ...prev, order: value as DeviceProps["order"] };
        case "nbrPort":
          return { ...prev, nbrPort: Math.max(1, Number(value)) };
        default:
          return prev;
      }
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (devices.length >= MAX_DEVICES) {
      toast.error("Limit reached", {
        description: "Only two devices can be displayed. Remove one first.",
      });
      return;
    }
    const deviceWithId: DeviceModel = {
      ...formState,
      id: generateDeviceId(),
    };
    setDevices((prev) => [...prev, deviceWithId]);
    setFormState(createEmptyDevice());
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormState(createEmptyDevice());
  };

  const handleOpenModal = () => {
    if (devices.length >= MAX_DEVICES) {
      toast.error("Limit reached", {
        description: "Only two devices can be displayed. Remove one first.",
      });
      return;
    }
    setShowModal(true);
  };

  const handleRemoveDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((device) => device.id !== deviceId));
    setSelectedPorts((prev) =>
      prev.filter((entry) => entry.deviceId !== deviceId)
    );
    setLinks((prev) =>
      prev.filter((link) => !link.some((entry) => entry.deviceId === deviceId))
    );
  };

  const handleClearAll = () => {
    setDevices([]);
    setSelectedPorts([]);
    setLinks([]);
  };

  const isPortLinked = (deviceId: string, portNumber: number) =>
    links.some((link) =>
      link.some(
        (entry) =>
          entry.deviceId === deviceId && entry.portNumber === portNumber
      )
    );

  const handleTogglePort = (deviceId: string, portNumber: number) => {
    if (isPortLinked(deviceId, portNumber)) {
      return;
    }
    setSelectedPorts((prev) => {
      const exists = prev.some(
        (entry) =>
          entry.deviceId === deviceId && entry.portNumber === portNumber
      );
      if (exists) {
        return prev.filter(
          (entry) =>
            !(entry.deviceId === deviceId && entry.portNumber === portNumber)
        );
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, { deviceId, portNumber }];
    });
  };

  const deviceNameLookup = devices.reduce<Record<string, string>>(
    (acc, device) => {
      acc[device.id] = device.name;
      return acc;
    },
    {}
  );
  const selectionLocked = selectedPorts.length >= 2;
  const linkedPortsMap = links.reduce<Record<string, number[]>>((acc, link) => {
    link.forEach(({ deviceId, portNumber }) => {
      if (!acc[deviceId]) acc[deviceId] = [];
      if (!acc[deviceId].includes(portNumber)) {
        acc[deviceId].push(portNumber);
      }
    });
    return acc;
  }, {});

  const getDeviceSelectedPorts = (deviceId: string) =>
    selectedPorts
      .filter((entry) => entry.deviceId === deviceId)
      .map((entry) => entry.portNumber)
      .sort((a, b) => a - b);

  const formatPortLabel = (entry: SelectedPortEntry) =>
    `${deviceNameLookup[entry.deviceId] ?? entry.deviceId} · Port ${
      entry.portNumber
    }`;

  const handleUndoLink = () => setSelectedPorts([]);

  const handleCommitLink = () => {
    if (selectedPorts.length !== 2) return;
    setLinks((prev) => [...prev, [selectedPorts[0], selectedPorts[1]]]);
    setSelectedPorts([]);
  };

  const handlePrintCommittedLinks = () => {
    if (!isBrowser) return;
    window.print();
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.1),transparent_50%)]">
        <div className="fixed left-4 top-4 z-50">
          <Button
            variant="secondary"
            className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2 shadow-lg shadow-black/10 backdrop-blur cursor-pointer"
            aria-label="Toggle site theme"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
            <span className="text-lg font-semibold uppercase tracking-wide text-foreground">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </Button>
        </div>

        <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12">
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={handleClearAll}
              disabled={devices.length === 0}
            >
              Clear all
            </Button>
            <Button onClick={handleOpenModal}>Insert device</Button>
          </div>
          {selectedPorts.length > 0 && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-50/30 p-4 text-xs text-emerald-900 space-y-2">
              <div>
                <p className="font-semibold uppercase tracking-wide text-emerald-700">
                  Selected ports
                </p>
                <p>
                  {selectedPorts
                    .map((entry) => formatPortLabel(entry))
                    .join(", ")}
                </p>
              </div>
              {selectedPorts.length === 2 ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-semibold text-emerald-800">
                    {`${formatPortLabel(
                      selectedPorts[0]
                    )} link to ${formatPortLabel(selectedPorts[1])}`}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleUndoLink}
                    >
                      Undo
                    </Button>
                    <Button size="sm" onClick={handleCommitLink}>
                      Commit link
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-emerald-700">
                  Select one more port to define a link.
                </p>
              )}
            </div>
          )}
          {links.length > 0 && (
            <div
              id="committed-links-card"
              className="rounded-md border border-border/60 bg-card/60 p-4 text-sm text-foreground space-y-2"
            >
              <p className="font-semibold uppercase tracking-wide text-muted-foreground">
                Committed links
              </p>
              <ul className="space-y-1 text-sm">
                {links.map((link, index) => (
                  <li
                    key={`link-${index}`}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {formatPortLabel(link[0])} ↔ {formatPortLabel(link[1])}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end pt-3">
                <Button
                  variant="secondary"
                  className="inline-flex items-center gap-2"
                  onClick={handlePrintCommittedLinks}
                >
                  <Printer className="h-4 w-4" />
                  Print label
                </Button>
              </div>
            </div>
          )}
          {devices.map((device) => {
            const { id, ...deviceProps } = device;
            const selected = getDeviceSelectedPorts(id);
            return (
              <Device
                key={id}
                {...deviceProps}
                onRemove={() => handleRemoveDevice(id)}
                selectedPorts={selected}
                onTogglePort={(port) => handleTogglePort(id, port)}
                selectionLocked={selectionLocked}
                linkedPorts={linkedPortsMap[id] ?? []}
              />
            );
          })}
        </main>

        {showModal && (
          <>
            <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Insert device
                  </h2>
                  <button
                    type="button"
                    className="text-muted-foreground transition hover:text-foreground"
                    onClick={closeModal}
                    aria-label="Close insert device modal"
                  >
                    ×
                  </button>
                </div>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">
                      Name
                    </label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Device name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">
                      Location
                    </label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                      name="location"
                      value={formState.location}
                      onChange={handleChange}
                      placeholder="Rack / Room"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">
                        Number of ports
                      </label>
                      <input
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        name="nbrPort"
                        type="number"
                        min={1}
                        value={formState.nbrPort}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-foreground">
                        Order
                      </label>
                      <select
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        name="order"
                        value={formState.order}
                        onChange={handleChange}
                      >
                        <option value="sv">sv</option>
                        <option value="sh">sh</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-foreground">
                      Port type
                    </label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                      name="portType"
                      value={formState.portType}
                      onChange={handleChange}
                      placeholder="Gigabit Ethernet"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create device</Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </>
  );
}

export default App;
