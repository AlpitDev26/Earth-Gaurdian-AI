"use client";
import TwinCore from './TwinCore';

export default function DigitalTwin({ score }: { score: number }) {
  // DigitalTwin acts as the wrapper to decouple layout from 3D/animation logic
  return (
    <div className="w-full flex justify-center items-center pointer-events-none">
      <TwinCore score={score} />
    </div>
  );
}
