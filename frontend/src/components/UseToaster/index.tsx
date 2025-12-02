import { toast, type TypeOptions, type ToastOptions } from "react-toastify";

const useToast = (
  message: string, 
  type: TypeOptions = "success", 
  options: ToastOptions = {} 
) => {
  

  const toastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    ...options, 
  };


  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast.warn(message, toastOptions);
      break;
      case "info":
        toast.warn(message, toastOptions);
        break;
    default:
      toast(message, toastOptions);
      break;
  }
};

export default useToast;