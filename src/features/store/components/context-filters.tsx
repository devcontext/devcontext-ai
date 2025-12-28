"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Project } from "../../core/domain/types/projects"

export type FilterValues = {
  search: string
  projectId: string
  tags: string
}

interface ContextFiltersProps {
  projects: Project[]
  initialValues?: Partial<FilterValues>
  onFilterChange: (filters: FilterValues) => void
}

export function ContextFilters({ projects, initialValues, onFilterChange }: ContextFiltersProps) {
  const { register, handleSubmit, watch, reset } = useForm<FilterValues>({
    defaultValues: {
      search: initialValues?.search || "",
      projectId: initialValues?.projectId || "",
      tags: initialValues?.tags || "",
    }
  })

  // Watch for changes to trigger update automatically
  const values = watch()

  const handleClear = () => {
    reset()
    onFilterChange({ search: "", projectId: "", tags: "" })
  }

  return (
    <form 
      onChange={handleSubmit(onFilterChange)}
      className="flex flex-wrap items-end gap-4 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl"
    >
      {/* Search */}
      <div className="flex-1 min-w-[200px] space-y-2">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            {...register("search")}
            placeholder="Search by name..."
            className="pl-10 bg-zinc-800 border-zinc-700 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Project Filter */}
      <div className="w-full md:w-64 space-y-2">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Project</label>
        <select 
          {...register("projectId")}
          className="w-full h-9 bg-zinc-800 border border-zinc-700 rounded-md px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Tags Filter */}
      <div className="w-full md:w-48 space-y-2">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tags</label>
        <Input 
          {...register("tags")}
          placeholder="Filtering tags..."
          className="bg-zinc-800 border-zinc-700"
        />
      </div>

      {/* Clear Button */}
      {(values.search || values.projectId || values.tags) && (
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleClear}
          className="text-zinc-500 hover:text-white mb-0.5"
        >
          <X className="w-4 h-4 mr-1.5" />
          Clear
        </Button>
      )}
    </form>
  )
}
