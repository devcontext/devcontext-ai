# Sistema DataTable Genérico

Sistema completo de tablas de datos basado en shadcn/ui y TanStack Table para la aplicación de gestión de clubes.

## Instalación

```bash
npm install @tanstack/react-table
```

## Componentes Incluidos

- `DataTable` - Componente principal
- `DataTableColumnHeader` - Headers sorteable y ocultables
- `DataTablePagination` - Controles de paginación
- `DataTableViewOptions` - Toggle de visibilidad de columnas
- `DataTableRowActions` - Acciones por fila
- Helpers: `createSelectColumn`, `createActionsColumn`

## Uso Básico

```tsx
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"

interface User {
  id: string
  name: string
  email: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email", 
    header: "Email",
  },
]

function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable 
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder="Search users..."
    />
  )
}
```

## Funcionalidades Avanzadas

### 1. Headers Sorteable

```tsx
import { DataTableColumnHeader } from "@/components/data-table"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
]
```

### 2. Columna de Selección

```tsx
import { createSelectColumn } from "@/components/data-table"

const columns: ColumnDef<User>[] = [
  createSelectColumn<User>(),
  // ... otras columnas
]

function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable 
      columns={columns}
      data={users}
      enableRowSelection={true}
      onRowSelectionChange={(selectedRows) => {
        console.log("Filas seleccionadas:", selectedRows)
      }}
    />
  )
}
```

### 3. Columna de Acciones

```tsx
import { createActionsColumn } from "@/components/data-table"
import { Eye, Pencil, Trash2 } from "lucide-react"

const columns: ColumnDef<User>[] = [
  // ... otras columnas
  createActionsColumn<User>({
    actions: [
      {
        label: "Ver",
        onClick: (user) => router.push(`/users/${user.id}`),
        icon: Eye,
      },
      {
        label: "Editar",
        onClick: (user) => router.push(`/users/${user.id}/edit`),
        icon: Pencil,
      },
      {
        label: "Eliminar",
        onClick: async (user) => {
          if (confirm("¿Estás seguro?")) {
            await deleteUser(user.id)
          }
        },
        icon: Trash2,
        variant: "destructive",
      },
    ],
  }),
]
```

### 4. Formateo de Celdas

```tsx
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
]
```

## Props del DataTable

```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string                    // Clave para filtro de búsqueda
  searchPlaceholder?: string            // Placeholder del input de búsqueda
  enableSorting?: boolean               // Habilitar ordenamiento (default: true)
  enableFiltering?: boolean             // Habilitar filtros (default: true)
  enableColumnVisibility?: boolean      // Habilitar toggle de columnas (default: true)
  enablePagination?: boolean            // Habilitar paginación (default: true)
  enableRowSelection?: boolean          // Habilitar selección de filas (default: false)
  pageSize?: number                     // Tamaño de página (default: 10)
  className?: string                    // Clases CSS adicionales
  onRowSelectionChange?: (selectedRows: TData[]) => void  // Callback para filas seleccionadas
}
```

## Ejemplo Completo

```tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { DataTable, DataTableColumnHeader, createSelectColumn, createActionsColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  price: number
  category: string
  status: "active" | "inactive"
}

export function ProductsTable({ products }: { products: Product[] }) {
  const columns: ColumnDef<Product>[] = [
    createSelectColumn<Product>(),
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Producto" />
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Precio" />
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
        }).format(price)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "category",
      header: "Categoría",
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "Activo" : "Inactivo"}
          </Badge>
        )
      },
    },
    createActionsColumn<Product>({
      actions: [
        {
          label: "Ver detalles",
          onClick: (product) => console.log("Ver", product),
          icon: Eye,
        },
        {
          label: "Editar",
          onClick: (product) => console.log("Editar", product),
          icon: Pencil,
        },
        {
          label: "Eliminar",
          onClick: (product) => console.log("Eliminar", product),
          icon: Trash2,
          variant: "destructive",
        },
      ],
    }),
  ]

  return (
    <DataTable
      columns={columns}
      data={products}
      searchKey="name"
      searchPlaceholder="Buscar productos..."
      enableSorting={true}
      enableFiltering={true}
      enableColumnVisibility={true}
      enablePagination={true}
      enableRowSelection={true}
      pageSize={25}
      onRowSelectionChange={(selectedRows) => {
        console.log(`${selectedRows.length} productos seleccionados`)
      }}
    />
  )
}
```

## Mejores Prácticas

1. **Usa DataTableColumnHeader** para headers que necesiten ser sorteable
2. **Define tipos TypeScript** claros para tus datos
3. **Usa helpers** como `createSelectColumn` y `createActionsColumn` para funcionalidades comunes
4. **Formatea las celdas** usando el prop `cell` para mejorar la presentación
5. **Considera la accesibilidad** usando `aria-label` y `sr-only` en elementos apropiados

## Estructura de Archivos

```
/components/data-table/
├── data-table.tsx              # Componente principal
├── data-table-column-header.tsx   # Headers sorteable
├── data-table-pagination.tsx      # Controles de paginación  
├── data-table-view-options.tsx    # Toggle de columnas
├── data-table-row-actions.tsx     # Acciones por fila
├── helpers/
│   ├── select-column.tsx           # Helper para selección
│   └── actions-column.tsx          # Helper para acciones
├── types.ts                        # Tipos TypeScript
├── index.ts                        # Exports principales
└── README.md                       # Esta documentación
```

## Personalización

El sistema está construido sobre shadcn/ui, por lo que todas las clases de Tailwind CSS son aplicables para personalización. Puedes extender los componentes según tus necesidades específicas. 