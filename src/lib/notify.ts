import Swal from "sweetalert2"

// Toast notification (auto-dismiss)
export function showToast(message: string, icon: "success" | "error" | "warning" | "info" = "success") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: "!rounded-xl !shadow-xl !text-sm",
      title: "!text-sm !font-bold",
    },
  })
}

// Confirm dialog
export async function showConfirm(message: string, title = "আপনি কি নিশ্চিত?"): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "হ্যাঁ, নিশ্চিত",
    cancelButtonText: "বাতিল",
    confirmButtonColor: "#D97706",
    cancelButtonColor: "#94A3B8",
    customClass: {
      popup: "!rounded-2xl !shadow-2xl",
      title: "!text-lg !font-black !text-slate-800",
      confirmButton: "!rounded-lg !font-bold !text-sm !px-5",
      cancelButton: "!rounded-lg !font-bold !text-sm !px-5",
    },
  })
  return result.isConfirmed
}

// Success alert
export function showSuccess(message: string) {
  Swal.fire({
    icon: "success",
    title: "সফল!",
    text: message,
    confirmButtonColor: "#D97706",
    customClass: {
      popup: "!rounded-2xl !shadow-2xl",
      title: "!text-lg !font-black !text-slate-800",
      confirmButton: "!rounded-lg !font-bold !text-sm !px-6",
    },
  })
}

// Error alert
export function showError(message: string) {
  Swal.fire({
    icon: "error",
    title: "ত্রুটি!",
    text: message,
    confirmButtonColor: "#D97706",
    customClass: {
      popup: "!rounded-2xl !shadow-2xl",
      title: "!text-lg !font-black !text-slate-800",
      confirmButton: "!rounded-lg !font-bold !text-sm !px-6",
    },
  })
}
