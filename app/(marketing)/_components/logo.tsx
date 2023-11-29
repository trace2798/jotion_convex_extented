import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div className="hidden w-[100px] md:flex items-center gap-x-2">
      <p className={cn("font-switzerSemibold", font.className)}> Jotion Ext </p>
    </div>
  );
};
