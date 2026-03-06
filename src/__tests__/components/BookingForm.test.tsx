import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Booking form validation schema
const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  caregiverId: z.string().min(1, "Caregiver is required"),
  startDate: z.string().min(1, "Start date is required"),
  durationType: z.enum(["HOURLY", "DAILY", "WEEKLY"]),
  durationValue: z.number().min(1, "Duration must be at least 1"),
  address: z.string().min(10, "Address must be at least 10 characters"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Simple booking form component for testing
function BookingForm({
  onSubmit,
}: {
  onSubmit: (data: BookingFormData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register("serviceId")}
          placeholder="Service ID"
          data-testid="service-input"
        />
        {errors.serviceId && (
          <span role="alert">{errors.serviceId.message}</span>
        )}
      </div>

      <div>
        <input
          {...register("caregiverId")}
          placeholder="Caregiver ID"
          data-testid="caregiver-input"
        />
        {errors.caregiverId && (
          <span role="alert">{errors.caregiverId.message}</span>
        )}
      </div>

      <div>
        <input
          {...register("startDate")}
          type="date"
          data-testid="date-input"
        />
        {errors.startDate && (
          <span role="alert">{errors.startDate.message}</span>
        )}
      </div>

      <div>
        <select {...register("durationType")} data-testid="duration-type">
          <option value="HOURLY">Hourly</option>
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
        </select>
      </div>

      <div>
        <input
          {...register("durationValue", { valueAsNumber: true })}
          type="number"
          placeholder="Duration"
          data-testid="duration-value"
        />
        {errors.durationValue && (
          <span role="alert">{errors.durationValue.message}</span>
        )}
      </div>

      <div>
        <textarea
          {...register("address")}
          placeholder="Address"
          data-testid="address-input"
        />
        {errors.address && <span role="alert">{errors.address.message}</span>}
      </div>

      <button type="submit" data-testid="submit-button">
        Submit
      </button>
    </form>
  );
}

describe("BookingForm Validation", () => {
  it("shows validation errors for empty form", async () => {
    const mockSubmit = jest.fn();
    render(<BookingForm onSubmit={mockSubmit} />);

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Service is required")).toBeInTheDocument();
      expect(screen.getByText("Caregiver is required")).toBeInTheDocument();
      expect(screen.getByText("Start date is required")).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("validates address minimum length", async () => {
    const mockSubmit = jest.fn();
    render(<BookingForm onSubmit={mockSubmit} />);

    const addressInput = screen.getByTestId("address-input");
    fireEvent.change(addressInput, { target: { value: "Short" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Address must be at least 10 characters"),
      ).toBeInTheDocument();
    });
  });

  it("validates duration value minimum", async () => {
    const mockSubmit = jest.fn();
    render(<BookingForm onSubmit={mockSubmit} />);

    const durationInput = screen.getByTestId("duration-value");
    fireEvent.change(durationInput, { target: { value: "0" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Duration must be at least 1"),
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const mockSubmit = jest.fn();
    render(<BookingForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByTestId("service-input"), {
      target: { value: "service-123" },
    });
    fireEvent.change(screen.getByTestId("caregiver-input"), {
      target: { value: "caregiver-456" },
    });
    fireEvent.change(screen.getByTestId("date-input"), {
      target: { value: "2026-03-15" },
    });
    fireEvent.change(screen.getByTestId("duration-value"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByTestId("address-input"), {
      target: { value: "123 Main Street, City" },
    });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      const callArgs = mockSubmit.mock.calls[0][0];
      expect(callArgs).toMatchObject({
        serviceId: "service-123",
        caregiverId: "caregiver-456",
        startDate: "2026-03-15",
        durationType: "HOURLY",
        durationValue: 4,
        address: "123 Main Street, City",
      });
    });
  });
});
