"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export default function StepperCircles({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: string[];
}) {
  return (
    <div className="flex mb-6 justify-between">
      {steps.map((label, index) => (
        <div
          key={index}
          className="flex-1 flex flex-col"
          // onClick={() => goToStep(index)}
        >
          <div className="flex items-center flex-1">
            {/* Step Circle */}
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full border-2 relative overflow-hidden shrink-0",
                index <= currentStep && "border-primary",
                index === currentStep && "bg-primary text-black",
                index > currentStep && "bg-transparent border-border"
              )}
            >
              <AnimatePresence mode="wait">
                {index < currentStep ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Check className="text-primary" />
                  </motion.div>
                ) : (
                  <motion.span
                    key={`num-${index}`}
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {index + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Line */}
            {index !== steps.length - 1 && (
              <motion.div
                className="h-0.5 flex-1 rounded-full"
                initial={{ backgroundColor: "var(--border)" }} // muted color
                animate={{
                  backgroundColor:
                    index < currentStep ? "var(--primary)" : "var(--border)", // primary vs muted
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
            )}
          </div>

          {/* Step Label */}
          <span className="text-xs mt-2">{label}</span>
        </div>
      ))}
    </div>
  );
}
