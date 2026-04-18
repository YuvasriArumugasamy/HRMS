import { Link } from "react-router-dom";

interface BreadcrumbItem {
    label: string;
    to?: string;
    active?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <div className="flex items-center text-sm text-gray-500 mb-2">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <div key={index} className="flex items-center">
                        {item.to ? (
                            <Link to={item.to} className="font-medium text-gray-800 hover:text-gray-600">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`font-medium ${item.active ? "text-orange-500" : "text-gray-800"}`}>
                                {item.label}
                            </span>
                        )}

                        {!isLast && <span className="mx-2">/</span>}
                    </div>
                );
            })}
        </div>
    );
}
