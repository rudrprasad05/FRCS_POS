"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, PackagePlus } from "lucide-react";
import { useState } from "react";

const steps = ["Select Option", "Fill Details", "Review", "Confirm"];

export default function StepperForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    option: "",
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep = () => {
    let newErrors: { [key: string]: string } = {};
    if (currentStep === 0 && !formData.option) {
      newErrors.option = "Please select an option.";
    }
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = "Name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (index: number) => {
    if (index < currentStep || validateStep()) {
      setCurrentStep(index);
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <PackagePlus className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold">New Product</h1>
        </div>
        <p className="text-muted-foreground">
          Add a new product to your inventory system
        </p>
      </div>

      <div className="flex mb-6 justify-between">
        {steps.map((label, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 flex flex-col cursor-pointer",
              index === currentStep ? "" : ""
            )}
            onClick={() => goToStep(index)}
          >
            <div className="flex flex-1 grow items-center">
              <div
                className={cn(
                  "w-10 h-10 flex aspect-square items-center justify-center rounded-full border-2",
                  index <= currentStep && "border-primary",
                  index == currentStep && "bg-primary text-black",
                  index > currentStep && "bg-transparent border-border"
                )}
              >
                {index >= currentStep && index + 1}
                {index < currentStep && <Check className="text-primary" />}
              </div>

              <div
                className={cn(
                  "h-0.5 w-full ",
                  index < currentStep ? "bg-primary" : "bg-border",
                  index == steps.length - 1 && "hidden"
                )}
              />
            </div>
            <span className="text-xs mt-2">{label}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Step Content */}
          {currentStep === 0 && (
            <div>
              <label className="block mb-2">Choose an option</label>
              <Input
                value={formData.option}
                onChange={(e) =>
                  setFormData({ ...formData, option: e.target.value })
                }
                placeholder="Option"
              />
              {errors.option && (
                <p className="text-red-500 text-sm">{errors.option}</p>
              )}
            </div>
          )}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Review</h2>
              <p>Option: {formData.option}</p>
              <p>Name: {formData.name}</p>
              <p>Email: {formData.email}</p>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Confirm</h2>
              <p>Everything looks good! 🎉</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700">
                Finish
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
