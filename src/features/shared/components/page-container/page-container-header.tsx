import { cn } from "@/lib/utils";

interface PageContainerHeaderProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Componente para el encabezado de página con título, descripción y acciones
 */
export const PageContainerHeader: React.FC<PageContainerHeaderProps> = ({
  title,
  description,
  children,
  className,
}) => {
  if (!title && !description) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
        className,
      )}
    >
      <div>
        {title && (
          <h1 className="text-xl font-bold mb-1 tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-muted-foreground text-base max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 mt-2 sm:mt-0 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};
