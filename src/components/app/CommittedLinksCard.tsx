import { Printer } from "lucide-react";

import type { PortLink } from "../../Appviewmodel";

import { Button } from "../ui/button";

type CommittedLinksCardProps = {
  links: PortLink[];
  formatPortLabel: (entry: PortLink[number]) => string;
  onPrint: () => void;
};

export function CommittedLinksCard({
  links,
  formatPortLabel,
  onPrint,
}: CommittedLinksCardProps) {
  return (
    <div
      id="committed-links-card"
      className="rounded-2xl border border-white/70  p-4 text-sm text-foreground shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl  dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-[0_25px_110px_rgba(0,0,0,0.65)]"
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
          onClick={onPrint}
        >
          <Printer className="h-4 w-4" />
          Print label
        </Button>
      </div>
    </div>
  );
}
