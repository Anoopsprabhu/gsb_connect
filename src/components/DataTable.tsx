"use client";

import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableProps extends AgGridReactProps {
  containerClassName?: string;
}

export default function DataTable({ containerClassName, ...props }: DataTableProps) {
  return (
    <div className={`ag-theme-quartz w-full ${containerClassName || "h-[600px]"}`}>
      <AgGridReact
        theme="legacy"
        {...props}
        pagination={props.pagination ?? true}
        paginationPageSize={props.paginationPageSize ?? 20}
        rowHeight={props.rowHeight ?? 52}
        headerHeight={props.headerHeight ?? 48}
        defaultColDef={{
          filter: true,
          sortable: true,
          resizable: true,
          flex: 1,
          ...props.defaultColDef,
        }}
      />
    </div>
  );
}
