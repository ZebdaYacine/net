import type { ChangeEvent, FormEvent } from "react";

import type { DeviceProps } from "../layout/Device";
import { Button } from "../ui/button";

type DeviceModalProps = {
  isOpen: boolean;
  formState: DeviceProps;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export function DeviceModal({
  isOpen,
  formState,
  onClose,
  onSubmit,
  onChange,
}: DeviceModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 " />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-black  p-6 backdrop-blur-xl bg-white/80  ">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Insert device
            </h2>
            <button
              type="button"
              className="text-muted-foreground transition hover:text-foreground"
              onClick={onClose}
              aria-label="Close insert device modal"
            >
              ×
            </button>
          </div>

          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                name="name"
                value={formState.name}
                onChange={onChange}
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
                onChange={onChange}
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
                  onChange={onChange}
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
                  onChange={onChange}
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
                onChange={onChange}
                placeholder="Gigabit Ethernet"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create device</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
