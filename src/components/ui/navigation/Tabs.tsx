interface TabItem {
    label: string;
    value: string;
}

interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
    return (
        <div className={` rounded-t-lg border-b border-gray-200 px-6 flex gap-8 text-sm font-medium ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`pb-2 ${activeTab === tab.value
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
