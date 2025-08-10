"use client";

import Lottie from "lottie-react";
import animationData from "../public/animation/Animation - 1733399669276.json";

export function LottieAnimation() {
  return (
    <div className="flex justify-center items-center">

      {/* @ts-ignore Headless UI types are not yet compatible with React 19 */}
      <Lottie
        animationData={animationData}
        style={{ height: 150, width: 150 }}
      />
    </div>
  );
}
