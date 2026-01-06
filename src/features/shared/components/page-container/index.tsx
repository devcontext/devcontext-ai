import { cn } from "@/lib/utils";
import { PageContainerHeader } from "./page-container-header";

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1600px]",
  full: "max-w-none",
};

interface PageContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  size?: keyof typeof sizeClasses;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  children,
  rightContent,
  className,
  size = "xl",
}) => {
  return (
    <div
      className={cn(
        "container mx-auto px-6 py-8",
        sizeClasses[size],
        className,
      )}
    >
      <div className="w-full">
        <PageContainerHeader title={title} description={description}>
          {rightContent}
        </PageContainerHeader>
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-6">{children}</div>
      </div>
    </div>
  );
};
