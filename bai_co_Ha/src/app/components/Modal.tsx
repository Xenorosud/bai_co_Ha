/**
 * Modal Component - Reusable modal for forms and dialogs
 */

import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closable = true,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={closable ? onClose : undefined}>
      <DialogContent
        className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {description || " "}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

// Form Modal với submit/cancel buttons
export interface FormModalProps extends Omit<ModalProps, "footer"> {
  onSubmit: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
}

export function FormModal({
  onSubmit,
  onCancel,
  submitText = "Lưu",
  cancelText = "Hủy",
  isSubmitting = false,
  submitDisabled = false,
  ...props
}: FormModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      props.onClose();
    }
  };

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
        {cancelText}
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting || submitDisabled}>
        {isSubmitting ? "Đang lưu..." : submitText}
      </Button>
    </div>
  );

  return <Modal {...props} footer={footer} closable={!isSubmitting} />;
}
