import { useEffect } from "react"
import { useModalScroll } from "../hooks/useModalScroll"


interface SelectedImage {
  id: string,
  src: string,
  text: string
}
interface EntryModalProps {
  selectedImage: SelectedImage,
  closeModal: () => void,
  navigateImage: (direction: 'prev' | 'next') => void,
  rightArrowModal: () => void,
  leftArrowModal: () => void
}

const EntryModal: React.FC<EntryModalProps> = ({selectedImage, closeModal, navigateImage, rightArrowModal, leftArrowModal}) => {

  const {throttleHandleKeyDown, registerKeyUp} = useModalScroll(rightArrowModal, leftArrowModal)
  useEffect(() => {
    window.addEventListener("keydown", throttleHandleKeyDown)
    window.addEventListener("keyup", registerKeyUp)

    return () => {
      window.removeEventListener("keydown", throttleHandleKeyDown)
      window.removeEventListener("keyup", registerKeyUp)
    }
  }, [throttleHandleKeyDown]

  )

  return (
    <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src} alt={selectedImage.text} className="modal-image" />
            <p className="modal-text">{selectedImage.text}</p>
            <button className="close-button" onClick={closeModal}>
                &times;
            </button>
            <button className="prev-button" onClick={() => navigateImage('prev')}>
                &larr; Previous
            </button>
            <button className="next-button" onClick={() => navigateImage('next')}>
                Next &rarr;
            </button>
        </div>
    </div>
  )
}


export default EntryModal;
