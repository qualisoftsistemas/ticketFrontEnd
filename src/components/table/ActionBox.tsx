import React from "react";
import { Button } from "../ui/button";

type Props = {};

const ActionBox = (props: Props) => {
  return (
    <div className="flex rounded gap-2 bg-[var(--secondary)]">
      <Button variant={"ghost"}>
        <img src="/icons/filter.svg" alt="" className="w-6 h-6" />
      </Button>
      <Button variant={"ghost"}>
        <img src="/icons/pdf.svg" alt="" className="w-6 h-6" />
      </Button>
      <Button variant={"ghost"}>
        <img src="/icons/sheet.svg" alt="" className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default ActionBox;
