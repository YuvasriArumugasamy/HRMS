import React from "react";

interface InfoItemProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    vertical?: boolean;
}

export default function InfoItem({ label, value, icon, vertical = false }: InfoItemProps) {
    return (
        <div className={`flex ${vertical ? "flex-col gap-1" : "items-center gap-2"}`}>
            <div className={`${vertical ? "w-full" : "w-1/2 "} flex items-center gap-2`}>
                {icon && <span className="text-gray-400">{icon}</span>}
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <div className={`${vertical ? "w-full" : "w-1/2"} text-sm font-semibold text-gray-900 min-h-[20px] break-words`}>
                {value || ""}
            </div>
        </div>
    );
}
