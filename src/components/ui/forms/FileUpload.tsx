import { Upload } from "lucide-react";
import React, { useRef, useState } from "react";

interface FormFileUploadProps {
    label?: string;
    value?: File | File[];
    onChange: (file: File | File[] | undefined) => void;
    error?: string;
    accept?: string;
    multiple?: boolean;
}

const FormFileUpload: React.FC<FormFileUploadProps> = ({
    label,
    value,
    onChange,
    error,
    accept,
    multiple,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (multiple) {
                onChange(Array.from(e.dataTransfer.files));
            } else {
                onChange(e.dataTransfer.files[0]);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (multiple) {
                onChange(Array.from(e.target.files));
            } else {
                onChange(e.target.files[0]);
            }
        }
    };

    const getDisplayValue = () => {
        if (!value) return "Drag and drop file here or browse";
        if (Array.isArray(value)) {
            if (value.length === 0) return "Drag and drop file here or browse";
            if (value.length === 1) return value[0].name;
            return `${value.length} files selected`;
        }
        return value.name;
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <div
                className={`border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging
                    ? "border-primary bg-primary/5"
                    : error
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="text-gray-400 w-6 h-6 mb-3" />

                <span className="text-sm text-gray-600">
                    {getDisplayValue()}
                </span>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept={accept}
                    multiple={multiple}
                />
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default FormFileUpload;