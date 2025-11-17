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
  const ports = Array.from({ length: nbr_port }, (_, i) => i + 1);

  //
  // GRID CONFIG (AUTO-SCALING)
  //
  const columns = Math.ceil(nbr_port / 2);

  // Button size depends on port count
  const buttonWidth = Math.max(50, 180 / columns); // min 50px
  const buttonHeight = buttonWidth * 1.2;

  //
  // ARRANGE PORTS INTO TWO ROWS (SH / SV)
  //
  const arrangedPorts =
    nbr_port < 8
      ? [ports]
      : order === "sv"
      ? [
          ports.filter((_, i) => i % 2 === 0),
          ports.filter((_, i) => i % 2 !== 0),
        ]
      : [ports.slice(0, columns), ports.slice(columns)];

  return (
    <div className="group relative w-full max-w-full overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-5 text-sm text-muted-foreground shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-[0_25px_110px_rgba(0,0,0,0.65)]">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Device
          </p>
          <h3 className="text-xl font-semibold text-foreground">{name}</h3>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full border border-destructive/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-destructive transition hover:bg-destructive/10"
          >
            Remove
          </button>
        )}
      </div>

      {/* Specs */}
      <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
        <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Location
          </dt>
          <dd className="text-sm text-foreground dark:text-white">
            {location}
          </dd>
        </div>

        <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Ports
          </dt>
          <dd className="text-sm text-foreground dark:text-white">
            {nbr_port}
          </dd>
        </div>

        <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Port Type
          </dt>
          <dd className="text-sm text-foreground dark:text-white">
            {portType}
          </dd>
        </div>

        <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Order
          </dt>
          <dd className="text-base font-semibold uppercase tracking-wide">
            {order}
          </dd>
        </div>
      </dl>

      {/* Ports Section */}
      <div className="mt-5 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-inner dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          <span>Link</span>
          <span>Act</span>
          <span>Gigabit</span>
        </div>

        {/* PORT GRID */}
        <div className="mt-4 space-y-2">
          {arrangedPorts.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${columns}, ${buttonWidth}px)`,
              }}
            >
              {row.map((portNumber) => {
                const isActive = selectedPorts.includes(portNumber);
                const isLinked = linkedPorts.includes(portNumber);
                const disabled = (selectionLocked && !isActive) || isLinked;

                const cellState = isActive
                  ? "border-emerald-400 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.45)]"
                  : isLinked
                  ? "border-transparent bg-muted text-muted-foreground dark:bg-white/10 dark:text-slate-400"
                  : "border-white/60 bg-white/80 text-slate-600 hover:border-primary/50 dark:border-white/10 dark:bg-white/10 dark:text-slate-100";

                return (
                  <button
                    key={portNumber}
                    disabled={disabled}
                    onClick={() => !disabled && onTogglePort(portNumber)}
                    style={{
                      width: buttonWidth,
                      height: buttonHeight,
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl border px-2 text-[10px] font-semibold uppercase tracking-[0.3em] transition
                      ${cellState}
                      ${
                        disabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }
                    `}
                  >
                    <span className="text-[9px]">Port</span>
                    <span className="text-lg tracking-normal">
                      {portNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
