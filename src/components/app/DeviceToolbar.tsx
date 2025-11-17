import { Button } from "../ui/button";

type DeviceToolbarProps = {
  canClear: boolean;
  onClear: () => void;
  onInsert: () => void;
};

export function DeviceToolbar({ canClear, onClear, onInsert }: DeviceToolbarProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={onClear} disabled={!canClear}>
        Clear all
      </Button>
      <Button onClick={onInsert}>Insert device</Button>
    </div>
  );
}
