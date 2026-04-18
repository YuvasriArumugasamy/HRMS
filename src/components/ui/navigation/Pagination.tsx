import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  itemName = "items",
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm text-gray-500 font-medium">
        Showing <span className="font-bold text-gray-900">{startItem}</span> to{" "}
        <span className="font-bold text-gray-900">{endItem}</span> of{" "}
        <span className="font-bold text-gray-900">{totalItems}</span> {itemName}
      </span>

      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <div className="flex items-center gap-1.5">
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        }
        previousLabel={
          <div className="flex items-center gap-1.5">
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </div>
        }
        onPageChange={(e) => onPageChange(e.selected + 1)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={Math.max(0, currentPage - 1)}
        containerClassName="flex items-center gap-1.5"
        pageClassName="w-9 h-9 flex items-center justify-center border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition cursor-pointer font-semibold text-[13px]"
        pageLinkClassName="w-full h-full flex items-center justify-center"
        previousClassName="px-4 h-9 flex items-center justify-center border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 transition cursor-pointer font-medium text-[13px]"
        previousLinkClassName="w-full h-full flex items-center justify-center"
        nextClassName="px-4 h-9 flex items-center justify-center border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 transition cursor-pointer font-medium text-[13px]"
        nextLinkClassName="w-full h-full flex items-center justify-center"
        breakClassName="w-9 h-9 flex items-center justify-center text-gray-500"
        breakLinkClassName="w-full h-full flex items-center justify-center"
        activeClassName="!bg-orange-500 !text-white !border-orange-500"
        disabledClassName="opacity-50 cursor-not-allowed hover:bg-transparent"
        disabledLinkClassName="cursor-not-allowed"
      />
    </div>
  );
}
