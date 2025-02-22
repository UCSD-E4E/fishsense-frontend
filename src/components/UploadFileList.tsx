import { Dispatch, SetStateAction } from "react";
import '../pages/UploadPage.scss';

interface PreviewFile {
  fileInfo: Blob;
}
interface FileObj {
  fileInfo: File;
  checked: boolean;
}
interface UploadFileListProps {
  files: FileObj[];
  setFiles: Dispatch<SetStateAction<FileObj[]>>;
  setPreviewFile: Dispatch<SetStateAction<PreviewFile | null>>;
}

const UploadFileList: React.FC<UploadFileListProps> = ({files, setFiles, setPreviewFile}) => {

  const handleCheckboxChange = (filePath: string) => {
    setFiles((prevFiles) => (
      prevFiles.map(pf => (pf.fileInfo.name === filePath) ? {...pf, checked: !pf.checked} : pf)
    ))
  }

  const fileEntries = files.map(file => (
    <li key={file.fileInfo.name} className="upload-file-list flex justify-between items-center mb-0.5">
      <div className="file-info flex items-center gap-2 ">
        <input 
          type="checkbox"
          checked={file.checked}
          onChange={() => handleCheckboxChange(file.fileInfo.name)}
        />
        <span className="file-span">{file.fileInfo.name}</span>
      </div>

      <button 
        className="preview-button text-blue-700 hover:underline bg-transparent border-none cursor-pointer"
        onClick={() => setPreviewFile(file)}
      >
        preview
      </button>
    </li>
  ))

  return <ul>{fileEntries}</ul>
}

export default UploadFileList;
