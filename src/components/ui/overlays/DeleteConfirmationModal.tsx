import Button from "@/components/ui/buttons/Button";
import Modal from "@/components/ui/overlays/Modal";
import { globalStrings } from "@/core/constants/strings";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isLoading?: boolean;
    confirmText?: string;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = globalStrings.delete + " Confirmation",
    message = "Are you sure you want to delete this item?",
    isLoading = false,
    confirmText = globalStrings.delete,
}: DeleteConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="flex flex-col gap-4">
                <p className="text-gray-600">{message}</p>
                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="secondary" onClick={onClose}>
                        {globalStrings.cancel}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
