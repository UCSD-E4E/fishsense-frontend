import { useDropzone } from 'react-dropzone'
import UploadFileList from '../components/UploadFileList'
import { useState, useEffect } from "react";
import MainNav from '../components/main-nav-component';
import { Hamburger } from '@fluentui/react-nav-preview';
import FadeLoader from "react-spinners/FadeLoader";
import './UploadPage.scss';

interface PreviewFile {
  fileInfo: Blob;
}
interface FileObj {
  fileInfo: File;
  checked: boolean;
}

const supportedTypes = ['image/', 'video/'] // Add other MIME types if needed


const UploadPage: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => setIsNavOpen((prevState) => !prevState);

  const [files, setFiles] = useState<FileObj[]>([]);
  //null means that no preview modal is active
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const extractThumbnail = async () => {
      if (!previewFile) return null
      /*
      if (previewFile.fileInfo.type.endsWith('orf') || previewFile.fileInfo.type.endsWith('octet-stream')) {
        try {
          //set preview to loading while image processing
          setPreviewImage('loading');
          //code to transform ORF
          const jpegImage = await convertORFImage(previewFile)
          return URL.createObjectURL(jpegImage)
        }
        catch (e) {
          console.log("Error extracting ORF thumbnail:", e)
        }
      }
      */
      if (supportedTypes.some(type => previewFile.fileInfo.type.startsWith(type))) {
        return URL.createObjectURL(previewFile.fileInfo);
      }
      else {
        return null;
      }
    }

    const updatePreviewImage = async () => {
      const img = await extractThumbnail()
      setPreviewImage(img)
    }

    if (previewFile) {
      updatePreviewImage()
    }
  }, [previewFile])

  const onDrop = (acceptedFiles: File[]) => {
    // console.log(acceptedFiles)
    let acceptedFilesWithChecked = acceptedFiles.map(file => {
      return {
        fileInfo: file, 
        checked: true, 
      }
    })

    setFiles((prevFiles) => [...prevFiles, ...acceptedFilesWithChecked] )
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

  const handleFileUpload = () => {
    console.log(files)
  }
  const handleClearFiles = () => {
    setFiles(() => [])
  }

  const renderPreview = () => {
    if (previewImage === 'loading') {
      return <FadeLoader
      color="#A9A9A9"
      loading={true}
      aria-label="Loading Spinner"
      data-testid="loader"
      />
    }
    else if (previewImage) {
      return <img 
        src={previewImage}
        className="z-20"
        style={{"maxWidth":"500px", "maxHeight":"300px", "objectFit": "contain"}}
      />
    }
    else {
      return <p className="preview-para"> No available preview </p>
    }
  }

  return (
    <div className="upload-page">
        <div className="nav-icon">
            <Hamburger onClick={toggleNav} />
        </div>

        {isNavOpen && <MainNav />}

        <div className="upload-container">
          <div className="upload-box">
            <div {...getRootProps()} className="upload-dropzone">
              <input {...getInputProps()}/>
              {
                isDragActive 
                ? <p>Drop files/folders here</p>
                : <p>Drag and drop files/folders. Click to select files</p>
              }
            </div>

            <div className="mt-5">File List</div>
            <aside className="upload-filelist">
              <UploadFileList files={files} setFiles={setFiles} setPreviewFile={setPreviewFile} />
            </aside>

            <button onClick={() => handleFileUpload()}>
              upload
            </button>
            <button onClick={() => handleClearFiles()}>
              clear
            </button>
          </div>

        {/* Modal of preview */}
        {
          previewFile &&
          <div 
            className="preview-modal"
            onClick={() => {setPreviewFile(null); setPreviewImage(null)}}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {renderPreview()}
            </div>
          </div>
        }
        </div>
    </div>
  )
}

export default UploadPage;
