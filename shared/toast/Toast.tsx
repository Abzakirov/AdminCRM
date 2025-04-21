// shared/toast/Toast.ts
import { toast } from "react-hot-toast";
import { CheckCircle, X, XCircle } from "lucide-react";

export const showSuccessToast = (message = "Login successful!") => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center justify-between max-w-sm w-full p-4 rounded-lg shadow-lg
        bg-white border border-green-500 transition-all duration-300 ease-in-out
        ${
          t.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
        }`}
      >
        <div className="flex items-center text-green-700">
          <CheckCircle className="mr-2" size={20} />
          <span>{message}</span>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-4 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    ),
    {
      position: "top-right",
    }
  );
};

export const showErrorToast = (message = "Something went wrong!") => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center justify-between max-w-sm w-full p-4 rounded-lg shadow-lg
        bg-white border border-red-500 transition-all duration-300 ease-in-out
        ${
          t.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
        }`}
      >
        <div className="flex items-center text-red-700">
          <XCircle className="mr-2" size={20} />
          <span>{message}</span>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-4 text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    ),
    {
      position: "top-right",
    }
  );
};
