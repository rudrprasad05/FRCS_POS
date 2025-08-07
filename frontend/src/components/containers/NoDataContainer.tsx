"use client";

import React from "react";
import { Card } from "../ui/card";

export default function NoDataContainer() {
  return (
    <Card className="w-full h-48 border border-dashed rounded-lg grid place-items-center">
      <div className="text-center text-sm">No Data to show</div>
    </Card>
  );
}
