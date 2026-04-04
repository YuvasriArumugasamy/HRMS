import type { ReactNode } from "react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-lg shadow-sm">
      <div className="p-4 mb-4 bg-[#115e88]/10 rounded-full text-[#115e88]">
        {icon}
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
