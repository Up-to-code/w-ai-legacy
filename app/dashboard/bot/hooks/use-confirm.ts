import { useState } from "react";

export function useConfirm() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    variant?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "danger",
  });

  const confirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    variant: "danger" | "warning" | "info" = "danger"
  ) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant,
    });
  };

  const close = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirm,
    close,
    dialogProps: {
      ...dialogState,
      onClose: close,
    },
  };
}
