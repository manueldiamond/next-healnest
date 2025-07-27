import * as React from "react";
import { cn } from "@/lib/utils";

const HueCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "hue-card p-6 transition-all duration-200 hover:shadow-xl hover:shadow-primary/10",
      className
    )}
    {...props}
  />
));
HueCard.displayName = "HueCard";

const HueCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-0", className)}
    {...props}
  />
));
HueCardHeader.displayName = "HueCardHeader";

const HueCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold text-primary leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
HueCardTitle.displayName = "HueCardTitle";

const HueCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
HueCardDescription.displayName = "HueCardDescription";

const HueCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-6", className)} {...props} />
));
HueCardContent.displayName = "HueCardContent";

const HueCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
));
HueCardFooter.displayName = "HueCardFooter";

export { HueCard, HueCardHeader, HueCardFooter, HueCardTitle, HueCardDescription, HueCardContent };