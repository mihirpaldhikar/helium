import { JSX } from "react";
import { Blob, Editor } from "@mihirpaldhikar/polaris";

interface WorkspaceProps {
  blob: Blob;
  onSave: (blob: Blob) => void;
  onImageSelected: (file: File) => Promise<string>;
}

export default function Workspace({
  blob,
  onSave,
  onImageSelected,
}: WorkspaceProps): JSX.Element {
  return (
    <div className={"bg-gray-100 py-10 lg:px-60"}>
      <div className={"rounded-xl bg-white px-5 pt-10 shadow-md"}>
        <Editor
          blob={blob}
          autoSaveTimeout={30000}
          onImageSelected={onImageSelected}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
