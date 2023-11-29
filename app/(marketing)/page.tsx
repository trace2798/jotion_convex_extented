import Image from "next/image";
import { Heading } from "./_components/heading";

const MarketingPage = () => {
  return (
    <div className="min-h-screen md:min-h-[83vh] flex flex-col">
      <h1 className="mt-32 md:mt-0 text-3xl sm:text-5xl md:text-6xl lg:text-8xl text-center font-switzerBold">
        Make.{" "}
        <span className="bg-gradient-to-r bg-clip-text text-transparent from-yellow-500 via-purple-500 to-red-500 animate-text">
          Dreams.
        </span>{" "}
        Happen.
      </h1>
      <div className="flex flex-col lg:flex-row items-center justify-center  text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <Image
          src="/hero.png"
          alt="hero-image"
          width={500}
          height={500}
          className="rounded-xl"
        />
      </div>
    </div>
  );
};

export default MarketingPage;
