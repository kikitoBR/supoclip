import { fireEvent, render, screen } from "@testing-library/react";

import { FontSelectOption } from "./font-select-option";

vi.mock("@/components/ui/select", () => ({
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("FontSelectOption", () => {
  it("shows a delete action for a user-uploaded font", () => {
    const onDelete = vi.fn();
    const font = {
      name: "usr-user-1-brand-font",
      display_name: "Brand Font",
      scope: "user" as const,
    };

    render(<FontSelectOption font={font} isDeleting={false} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: "Excluir Brand Font" }));

    expect(onDelete).toHaveBeenCalledWith(font);
  });

  it("does not offer deletion for bundled system fonts", () => {
    render(
      <FontSelectOption
        font={{ name: "Inter", display_name: "Inter", scope: "system" }}
        isDeleting={false}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: /excluir/i })).not.toBeInTheDocument();
  });

  it("shows file coverage and fallback warnings for bundled and uploaded fonts", () => {
    render(<FontSelectOption font={{ name: "Inter", display_name: "Inter", scope: "system", supported_languages: ["en", "pt"] }} />);
    fireEvent.click(screen.getByRole("button", { name: "Suporte a idiomas para Inter" }));

    expect(screen.getByText(/inglês.*português/i)).toBeInTheDocument();
    expect(screen.getByText(/híndi|hindi/i)).toBeInTheDocument();
    expect(screen.getByText(/Caracteres ausentes utilizam uma fonte alternativa/)).toBeInTheDocument();
  });

  it("does not claim unsupported languages when coverage is unavailable", () => {
    render(<FontSelectOption font={{ name: "custom", display_name: "Custom", scope: "user", supported_languages: null }} />);
    fireEvent.click(screen.getByRole("button", { name: "Suporte a idiomas para Custom" }));

    expect(screen.getByText(/Não foi possível verificar a cobertura de idiomas/)).toBeInTheDocument();
    expect(screen.queryByText(/Suporte parcial/)).not.toBeInTheDocument();
  });
});
