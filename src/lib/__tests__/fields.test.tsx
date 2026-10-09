import {describe, expect, it} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {PhoneInput} from "@/components/ui/phone-input";

describe("Field + Input", () => {
  it("associates the label with the control", () => {
    render(
      <Field id="name" label="Your name" required>
        <Input />
      </Field>
    );
    expect(screen.getByLabelText(/Your name/)).toBeInTheDocument();
  });

  it("wires aria-describedby to the hint", () => {
    render(
      <Field id="name" label="Your name" hint="As it appears on WhatsApp">
        <Input />
      </Field>
    );
    const input = screen.getByLabelText(/Your name/);
    expect(input).toHaveAttribute("aria-describedby", "name-hint");
    expect(screen.getByText("As it appears on WhatsApp")).toHaveAttribute("id", "name-hint");
  });

  it("marks the control invalid and links the error message", () => {
    render(
      <Field id="phone" label="Phone" error="Enter a Nigerian mobile number, e.g. 0803 123 4567">
        <PhoneInput />
      </Field>
    );
    const input = screen.getByLabelText(/Phone/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "phone-error");
    expect(screen.getByText(/Enter a Nigerian mobile number/)).toBeInTheDocument();
  });

  it("shows the error instead of the hint when both are present", () => {
    render(
      <Field id="phone" label="Phone" hint="We call this number" error="Required">
        <PhoneInput />
      </Field>
    );
    expect(screen.queryByText("We call this number")).not.toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});

describe("PhoneInput", () => {
  it("renders the fixed +234 prefix", () => {
    render(<PhoneInput aria-label="Phone" />);
    expect(screen.getByText("+234")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toHaveAttribute("inputmode", "tel");
  });
});
