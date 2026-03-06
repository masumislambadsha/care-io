interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function Loading({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-16 h-16 border-4",
    lg: "w-24 h-24 border-4",
  };

  const content = (
    <div className="text-center">
      <div
        className={`${sizeClasses[size]} border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}
      ></div>
      <p className="text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        {content}
      </div>
    );
  }

  return content;
}
