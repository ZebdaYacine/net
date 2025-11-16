export type DeviceProps = {
  name: string;
  location: string;
  nbrPort: number;
  portType: string;
  order: "sh" | "sv";
};

type DeviceCardProps = DeviceProps & {
  onRemove?: () => void;
  selectedPorts: number[];
  onTogglePort: (portNumber: number) => void;
  selectionLocked: boolean;
  linkedPorts?: number[];
};

export function Device({
  name,
  location,
  nbrPort: nbr_port,
  portType,
  order,
  onRemove,
  selectedPorts,
  onTogglePort,
  selectionLocked,
  linkedPorts = [],
}: DeviceCardProps) {
  const ports = Array.from({ length: nbr_port }, (_, index) => index + 1);
  const half = Math.ceil(nbr_port / 2);
  const firstRow = ports.slice(0, half);
  const secondRow = ports.slice(half);
  const arrangedPorts =
    nbr_port < 8
      ? [ports]
      : order === "sv"
        ? [
            ports.filter((_, index) => index % 2 === 0),
            ports.filter((_, index) => index % 2 !== 0),
          ]
        : [firstRow, secondRow];
  const togglePort = (portNumber: number) => {
    onTogglePort(portNumber);
  };

  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-card p-4 text-sm text-muted-foreground w-full max-w-full overflow-x-auto">
      <div className="flex items-start justify-between gap-3">
        <div className="font-semibold text-foreground text-base sm:text-lg">
          {name}
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-semibold uppercase tracking-wide text-destructive transition hover:underline"
            aria-label={`Remove ${name}`}
          >
            Cancel
          </button>
        )}
      </div>
      <dl className="mt-2 space-y-1 text-xs sm:text-sm">
        <div className="flex justify-between">
          <dt>Location</dt>
          <dd>{location}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Ports</dt>
          <dd>{nbr_port}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Port type</dt>
          <dd>{portType}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Order</dt>
          <dd className="uppercase tracking-wide">{order}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg border p-3 shadow-inner w-full overflow-x-auto">
        <div className="flex items-center gap-4 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] ">
          <span>Link</span>
          <span>Act</span>
          <span>Gigabit</span>
        </div>

        <table className="mt-3 w-full border-collapse text-center text-[8px] sm:text-[10px]">
          <tbody>
            {arrangedPorts.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="h-8 sm:h-10">
                {row.map((portNumber) => {
                  const isActive = selectedPorts.includes(portNumber);
                  const isLinked = linkedPorts.includes(portNumber);
                  const isCellDisabled = (selectionLocked && !isActive) || isLinked;
                  return (
                    <td
                      key={portNumber}
                      className={`px-1 rounded transition-colors ${
                        isCellDisabled
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      } ${
                        isActive
                          ? "bg-emerald-100"
                          : isLinked
                            ? "bg-muted"
                            : ""
                      }`}
                      aria-disabled={isCellDisabled}
                      onClick={() => {
                        if (isCellDisabled) return;
                        togglePort(portNumber);
                      }}
                    >
                      <span className="text-lg font-bold">{portNumber}</span>
                      <div
                        className={`mx-auto flex h-9 w-9 sm:h-10 sm:w-10 flex-col items-center justify-center border text-xs sm:text-sm font-semibold shadow-md ${
                          isActive ? "bg-emerald-500 text-white" : ""
                        }`}
                      ></div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
