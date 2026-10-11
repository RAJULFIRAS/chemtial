import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DataTable from "../../../src/components/admin/DataTable";

interface Row {
  id: string;
  name: string;
}

const columns = [{ key: "name", label: "Name" }];

describe("DataTable", () => {
  const data: Row[] = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
  ];

  it("should render title", () => {
    render(<DataTable title="Users" columns={columns} data={data} />);
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("should render rows", () => {
    render(<DataTable title="Users" columns={columns} data={data} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("should show empty message", () => {
    render(
      <DataTable
        title="Users"
        columns={columns}
        data={[]}
        emptyMessage="No data"
      />,
    );
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should show loading state", () => {
    render(<DataTable title="Users" columns={columns} data={[]} isLoading />);
    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("should call onAdd", () => {
    const onAdd = vi.fn();
    render(
      <DataTable
        title="Users"
        columns={columns}
        data={data}
        onAdd={onAdd}
        addLabel="Add"
      />,
    );
    fireEvent.click(screen.getByText("Add"));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it("should call onEdit", () => {
    const onEdit = vi.fn();
    render(
      <DataTable title="Users" columns={columns} data={data} onEdit={onEdit} />,
    );
    fireEvent.click(screen.getAllByTitle("Edit")[0]);
    expect(onEdit).toHaveBeenCalledWith(data[0]);
  });

  it("should call onDelete", () => {
    const onDelete = vi.fn();
    render(
      <DataTable
        title="Users"
        columns={columns}
        data={data}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getAllByTitle("Delete")[0]);
    expect(onDelete).toHaveBeenCalledWith(data[0]);
  });

  it("should call onSearchChange", () => {
    const onSearchChange = vi.fn();
    render(
      <DataTable
        title="Users"
        columns={columns}
        data={data}
        searchValue=""
        onSearchChange={onSearchChange}
      />,
    );
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "x" },
    });
    expect(onSearchChange).toHaveBeenCalledWith("x");
  });
});
