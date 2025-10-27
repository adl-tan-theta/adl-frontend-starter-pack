import React from "react";
import { cn } from "@/lib/utils";

// React 19: Example component using data-slot for styling internal parts
interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value: string;
  ref?: React.Ref<HTMLDivElement>;
}

function AccordionItem({ 
  className, 
  children, 
  value,
  ref, // ref as regular prop in React 19
  ...props 
}: AccordionItemProps) {
  return (
    <div
      ref={ref}
      data-slot="accordion-item" // data-slot for specific CSS targeting
      className={cn(
        "border-b border-border last:border-b-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

function AccordionTrigger({ 
  className, 
  children, 
  ref, // ref as regular prop
  ...props 
}: AccordionTriggerProps) {
  return (
    <button
      ref={ref}
      data-slot="accordion-trigger" // data-slot for styling
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

function AccordionContent({ 
  className, 
  children, 
  ref, // ref as regular prop
  ...props 
}: AccordionContentProps) {
  return (
    <div
      ref={ref}
      data-slot="accordion-content" // data-slot for styling
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">
        {children}
      </div>
    </div>
  );
}

// Export all components
export { AccordionItem, AccordionTrigger, AccordionContent };
