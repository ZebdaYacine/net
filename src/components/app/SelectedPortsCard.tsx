import type { SelectedPortEntry } from "../../Appviewmodel";

import { Button } from "../ui/button";

type SelectedPortsCardProps = {
  selectedPorts: SelectedPortEntry[];
  formatPortLabel: (entry: SelectedPortEntry) => string;
  onUndo: () => void;
  onCommit: () => void;
};

export function SelectedPortsCard({
  selectedPorts,
  formatPortLabel,
  onUndo,
  onCommit,
}: SelectedPortsCardProps) {
  const hasTwoPorts = selectedPorts.length === 2;

  return (
    <div className="rounded-2xl border   p-4 text-xs   ">
      <div>
        <p className="font-semibold uppercase tracking-wide ">Selected ports</p>
        <p>{selectedPorts.map((entry) => formatPortLabel(entry)).join(", ")}</p>
      </div>
      {hasTwoPorts ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-semibold ">
            {`${formatPortLabel(selectedPorts[0])} link to ${formatPortLabel(
              selectedPorts[1]
            )}`}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onUndo}>
              Undo
            </Button>
            <Button size="sm" onClick={onCommit}>
              Commit link
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm italic text-muted-foreground">
          Select one more port to define a link.
        </p>
      )}
    </div>
  );
}
