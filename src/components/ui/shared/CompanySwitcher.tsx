import type { RootState } from "@/app/store";
import { setSelectedCompany } from "@/modules/company/companySlice";
import type { Company } from "@/modules/company/types";
import { ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

interface CompanySwitcherProps {
  onClose: () => void;
}

export default function CompanySwitcher({ onClose }: CompanySwitcherProps) {
  const dispatch = useDispatch();
  const { selectedCompany, companies } = useSelector((state: RootState) => state.company);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSelect = (company: Company) => {
    dispatch(setSelectedCompany(company));
    onClose();
    window.location.reload();
  };

  return (
    <div ref={modalRef} className="absolute top-16 left-6 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 animate-fade-in origin-top-left">
      <div className="p-4 pt-2 pb-0 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Selected Company</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-3 py-2">
        <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
          {companies.map((company) => {
            const isSelected = selectedCompany?.id === company.id;
            return (
              <button
                key={company.id}
                onClick={() => handleSelect(company)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition text-left group
                  ${isSelected ? "bg-secondary/5 border border-secondary/10" : "hover:bg-gray-50 border border-transparent"}
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm
                    ${company.colorClass}
                `}
                >
                  {company.initials}
                </div>

                <div className="flex-1">
                  <div
                    className={`font-medium ${isSelected ? "text-secondary" : "text-gray-800"}`}
                  >
                    {company.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    Code: {company?.code}
                  </div>
                </div>

                <ChevronRight
                  className={isSelected ? "text-secondary" : "text-gray-400"}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
