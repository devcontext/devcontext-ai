/**
 * Source entity representing uploaded files or pasted text.
 * PURE TYPE: No I/O, no side effects, no Date objects.
 */
export type Source = {
  id: string
  projectId: string
  name: string
  type: 'file' | 'text'
  content: string
  createdAt: string // ISO string
}

/**
 * Input type for creating a new Source.
 * Excludes auto-generated fields.
 */
export type SourceInput = Omit<Source, 'id' | 'createdAt'>
