import type { RootState } from "@/app/store";
import { SearchableSelect } from "@/components/ui/forms/SearchableSelect";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchMasterDataEmployees } from "@/modules/masterData/masterDataSlice";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
  defaultMessage?: string;
}



export default function MessageModal({
  isOpen,
  onClose,
  defaultSubject = "",
  defaultMessage = "",
}: MessageModalProps) {
  const masterData = useAppSelector((state) => state.masterData);

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [subject, setSubject] = useState(defaultSubject);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [requestReadReceipt, setRequestReadReceipt] = useState(false);
  const [fontSize, setFontSize] = useState("14");
  const [fontFamily, setFontFamily] = useState("Arial");

  const editorRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { employees, loading: _loading } = useAppSelector(
    (state: RootState) => state.masterData,
  );

  useEffect(() => {
    dispatch(fetchMasterDataEmployees());
  }, [dispatch]);

  const employeeOptions = (employees || []).map((e) => {
    return {
      label: `${e.firstName || ""} ${e?.surname || ""}`.trim(),
      value: e._id,
      employeeCode: e.empCode,
      firstName: e?.firstName,
      lastName: e?.surname,
      avatar: e.avatar,
    };
  });

  const groupOptions: { label: string; value: string }[] =
    masterData?.contactCategories?.map((item: any) => ({
      label: item.name,
      value: item._id,
    })) ?? [];

  useEffect(() => {
    if (editorRef.current && defaultMessage) {
      editorRef.current.innerHTML = defaultMessage.replace(/\n/g, "<br>");
    }
  }, [defaultMessage]);

  useEffect(() => {
    setSubject(defaultSubject);
  }, [defaultSubject]);

  if (!isOpen) return null;

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setFontSize(size);
    applyFormat("fontSize", "3");
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = `${size}px`;
      try {
        range.surroundContents(span);
      } catch (e) { }
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setFontFamily(font);
    applyFormat("fontName", font);
  };

  const handleSend = () => {
    // const recipients = {
    //   groups: selectedGroups,
    //   employees: selectedEmployees,
    // };
    // const messageContent = editorRef.current?.innerHTML || "";
    // Add your send logic here
    onClose();
  };

  // Get display text for recipients
  const getRecipientsText = () => {
    const groupNames = groupOptions
      .filter((g) => selectedGroups.includes(g.value))
      .map((g) => g.label);

    return groupNames.length > 0
      ? groupNames.join(", ")
      : "No recipients selected";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">New Message</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Select Names */}
          <div className="w-96 border-r border-gray-200 flex flex-col bg-gray-50">
            <div className="p-6 space-y-4 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Select Recipients
              </h3>

              {/* Groups Multi-Select */}
              <div>
                <SearchableSelect
                  type="default"
                  label="Groups"
                  placeholder="Select groups..."
                  options={groupOptions}
                  value={selectedGroups}
                  onChange={setSelectedGroups}
                  multiple
                  size="md"
                />
                {selectedGroups.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedGroups.length} group(s) selected
                  </p>
                )}
              </div>

              {/* Employees Multi-Select with Employee Type */}
              <div>
                <SearchableSelect
                  type="employee"
                  label="Employees"
                  placeholder="Search and select employees..."
                  options={employeeOptions}
                  value={selectedEmployees}
                  onChange={setSelectedEmployees}
                  multiple
                  size="md"
                />
                {selectedEmployees.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedEmployees.length} employee(s) selected
                  </p>
                )}
              </div>

              {/* Selected Recipients Summary */}
              {(selectedGroups.length > 0 || selectedEmployees.length > 0) && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-xs font-semibold text-blue-900 mb-2">
                    Selected Recipients
                  </h4>
                  <div className="space-y-2 text-xs text-blue-800">
                    {selectedGroups.length > 0 && (
                      <div>
                        <span className="font-semibold">Groups:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedGroups.map((groupId) => {
                            const group = groupOptions.find(
                              (g) => g.value === groupId,
                            );
                            return (
                              <span
                                key={groupId}
                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                              >
                                {group?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {selectedEmployees.length > 0 && (
                      <div>
                        <span className="font-semibold">Employees:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedEmployees.map((empId) => {
                            const emp = employeeOptions.find(
                              (e) => e.value === empId,
                            );
                            return (
                              <span
                                key={empId}
                                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                              >
                                {emp?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Message Form */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Compose Message
              </h3>

              {/* Priority Selection */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Priority level
                  </span>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="high"
                        checked={priority === "high"}
                        onChange={(e) =>
                          setPriority(
                            e.target.value as "high" | "medium" | "low",
                          )
                        }
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">High</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="medium"
                        checked={priority === "medium"}
                        onChange={(e) =>
                          setPriority(
                            e.target.value as "high" | "medium" | "low",
                          )
                        }
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Medium</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="low"
                        checked={priority === "low"}
                        onChange={(e) =>
                          setPriority(
                            e.target.value as "high" | "medium" | "low",
                          )
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Low</span>
                    </label>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestReadReceipt}
                    onChange={(e) => setRequestReadReceipt(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Request read receipt
                  </span>
                </label>
              </div>

              {/* To Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 min-h-[42px]">
                  {getRecipientsText()}
                </div>
              </div>

              {/* Subject Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject"
                />
              </div>

              {/* Message Body */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Body
                </label>

                {/* Text Formatting Toolbar */}
                <div className="border border-gray-300 rounded-t-lg bg-gray-50 px-3 py-2 flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => applyFormat("bold")}
                    className="px-2 py-1 hover:bg-gray-200 rounded transition-colors"
                    title="Bold"
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("italic")}
                    className="px-2 py-1 hover:bg-gray-200 rounded transition-colors"
                    title="Italic"
                  >
                    <Italic size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("underline")}
                    className="px-2 py-1 hover:bg-gray-200 rounded transition-colors"
                    title="Underline"
                  >
                    <Underline size={18} />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => applyFormat("justifyLeft")}
                    className="px-2 py-1 hover:bg-gray-200 rounded transition-colors"
                    title="Align Left"
                  >
                    <AlignLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("justifyCenter")}
                    className="px-2 py-1 hover:bg-gray-200 rounded transition-colors"
                    title="Align Center"
                  >
                    <AlignCenter size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat("justifyRight")}
                    className="px-2 py-1 hover:bg-gray-200 rounded transition-colors"
                    title="Align Right"
                  >
                    <AlignRight size={18} />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <select
                    className="px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={fontFamily}
                    onChange={handleFontFamilyChange}
                  >
                    <option>Arial</option>
                    <option>Times New Roman</option>
                    <option>Courier New</option>
                    <option>Georgia</option>
                    <option>Verdana</option>
                  </select>
                  <select
                    className="px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                  >
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                    <option value="20">20</option>
                    <option value="24">24</option>
                  </select>
                </div>

                {/* Rich Text Editor */}
                <div
                  ref={editorRef}
                  contentEditable
                  className="w-full min-h-[250px] px-3 py-2 border border-gray-300 border-t-0 rounded-b-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
                  style={{
                    maxHeight: "300px",
                    fontFamily: fontFamily,
                  }}
                  suppressContentEditableWarning
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={
                  selectedGroups.length === 0 && selectedEmployees.length === 0
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
