import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signOut: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: "/",
  })),
}));

describe("Navbar", () => {
  it("renders the logo", () => {
    render(
      <SessionProvider session={null}>
        <Navbar />
      </SessionProvider>,
    );

    expect(screen.getByText("Care.xyz")).toBeInTheDocument();
  });

  it("shows sign in and get started buttons when not authenticated", () => {
    render(
      <SessionProvider session={null}>
        <Navbar />
      </SessionProvider>,
    );

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(
      <SessionProvider session={null}>
        <Navbar />
      </SessionProvider>,
    );

    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Caregivers")).toBeInTheDocument();
  });
});
