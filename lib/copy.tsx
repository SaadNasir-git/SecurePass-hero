import { toast } from "react-toastify";

export const handlecopy = (text: string) => {
    if (!navigator.clipboard) {
        // Fallback for browsers without Clipboard API
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Text copied Successfully");
        return;
    }

    navigator.clipboard
        .writeText(text)
        .then(() => toast.success("Text copied!"))
        .catch((err) => toast.error("Failed to copy: " + err));
};