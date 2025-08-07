import { cn } from "@/lib/utils";

interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function H1({ children, className, ...props }: H1Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, ...props }: H1Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H3({ children, className, ...props }: H1Props) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function P({ children, className, ...props }: H1Props) {
  return (
    <p className={cn("leading-7", className)} {...props}>
      {children}
    </p>
  );
}

export function MutedText({ children, className, ...props }: H1Props) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props}>
      {children}
    </p>
  );
}

export function LargeText({ children, className, ...props }: H1Props) {
  return (
    <div className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </div>
  );
}

export function SmallText({ children, className, ...props }: H1Props) {
  return (
    <small
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    >
      {children}
    </small>
  );
}

export function XSmallText({ children, className, ...props }: H1Props) {
  return (
    <small
      className={cn("text-xs leading-none font-light", className)}
      {...props}
    >
      {children}
    </small>
  );
}

export function LeadText({ children, className, ...props }: H1Props) {
  return (
    <p className={cn("text-muted-foreground text-xl", className)} {...props}>
      {children}
    </p>
  );
}
