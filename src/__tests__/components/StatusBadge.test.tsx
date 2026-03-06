import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";

// StatusBadge component
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ONGOING":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
}

describe("StatusBadge Component", () => {
  it("renders pending status correctly", () => {
    render(<StatusBadge status="PENDING" />);
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });

  it("renders confirmed status correctly", () => {
    render(<StatusBadge status="CONFIRMED" />);
    expect(screen.getByText("CONFIRMED")).toBeInTheDocument();
  });

  it("renders ongoing status correctly", () => {
    render(<StatusBadge status="ONGOING" />);
    expect(screen.getByText("ONGOING")).toBeInTheDocument();
  });

  it("renders completed status correctly", () => {
    render(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();
  });

  it("renders cancelled status correctly", () => {
    render(<StatusBadge status="CANCELLED" />);
    expect(screen.getByText("CANCELLED")).toBeInTheDocument();
  });

  it("applies correct CSS classes for pending status", () => {
    const { container } = render(<StatusBadge status="PENDING" />);
    const badge = container.querySelector("span");
    expect(badge).toHaveClass("bg-yellow-100", "text-yellow-800");
  });

  it("applies correct CSS classes for confirmed status", () => {
    const { container } = render(<StatusBadge status="CONFIRMED" />);
    const badge = container.querySelector("span");
    expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
  });
});
