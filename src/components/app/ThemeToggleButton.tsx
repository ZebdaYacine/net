import { Moon, Sun } from "lucide-react";

import { Button } from "../ui/button";
import { useTheme } from "../../context/theme-context";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed left-4 top-4 z-50 drop-shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
      <Button
        variant="secondary"
        className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-slate-800 shadow-[0_15px_40px_rgba(15,23,42,0.2)] backdrop-blur-lg transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
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
  );
}
