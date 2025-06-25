import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  height?: number | string;
}

export default function TextEditor({
  value,
  onChange,
  disabled = false,
  height = 500,
}: TextEditorProps) {
  const editorRef = useRef(null);

  return (
    <div className={disabled ? "editor-disabled" : ""}>
      <Editor
        key={disabled ? "disabled" : "enabled"}
        apiKey="wn99n1krsuyn1l9t6cx1ko409ac7mzaaurf5bc2cj9jzrrfz"
        value={value}
        onEditorChange={onChange}
        disabled={disabled}
        init={{
          height,
          menubar: false,
          plugins: ["advlist", "image", "link", "lists", "code"],
          toolbar: disabled
            ? false
            : "undo redo | blocks fontfamily fontsize | bold italic underline | alignleft aligncenter alignright | bullist numlist | image | code",
          image_advtab: true,
          automatic_uploads: true,
          file_picker_types: "image",
          images_upload_handler: async (blobInfo: any) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(blobInfo.blob());
            });
          },
          file_picker_callback: (
            callback: (url: string, meta?: any) => void,
            value: any,
            meta: any
          ) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = () => {
                const file = input.files && input.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target && (e.target as any).result;
                  callback(result as string, { alt: file.name });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            }
          },
          language: "vi",
          language_url: "https://cdn.jsdelivr.net/npm/tinymce-i18n/langs/vi.js",
        }}
      />
    </div>
  );
}
