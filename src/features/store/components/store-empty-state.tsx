import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FilePlus, LayoutGrid } from "lucide-react"

export function StoreEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-zinc-700">
        <LayoutGrid className="w-8 h-8 text-zinc-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-3">No Contexts Found</h2>
      
      <p className="text-zinc-400 max-w-md mb-8 leading-relaxed">
        Contexts are curated technical guidelines and architectural rules that guide AI assistants. 
        Create your first context to start building structured technical documentation.
      </p>

      <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
        <Link href="/dashboard/composer">
          <FilePlus className="w-4 h-4 mr-2" />
          Create New Context
        </Link>
      </Button>
    </div>
  )
}
