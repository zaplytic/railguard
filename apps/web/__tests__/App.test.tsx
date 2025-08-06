import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import App from "@/App";

test("renders app component", () => {
  render(<App />);
  // Adjust this based on your actual App component content
  const element = screen.getByRole("main"); // or whatever element you expect
  expect(element).toBeInTheDocument();
});
