import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  className?: string;
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
        {
          "bg-success/10 text-success": status === "In Stock",
          "bg-warning/10 text-warning": status === "Low Stock",
          "bg-error/10 text-error": status === "Out of Stock",
        },
        className
      )}
    >
      {status}
    </span>
  );
}
