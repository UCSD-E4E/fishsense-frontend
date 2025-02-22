import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import logo from '../logo.svg';
import MainNav from '../components/main-nav-component';
import { Hamburger } from '@fluentui/react-nav-preview';
import './ProjectIntroduction.scss';
import lavaEel from '../components/Lava_Eel.png';
import octopus from '../components/Octopus.png';
import glacierfish from '../components/Glacierfish_Jr.png';
import EntryModal from '../components/EntryModal';

interface SelectedImage {
  id: string,
  src: string,
  text: string
}

const initialImages = [
    { id: 'lavaEel', src: lavaEel, text: 'I am a fish living in the trash' },
    { id: 'octopus', src: octopus, text: 'I am a fish that is hard to catch' },
    { id: 'glacierfish', src: glacierfish, text: 'I am a fish that rap' },
];

const ProjectIntroduction: React.FC = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [imagesPerRow, setImagesPerRow] = useState(3);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<SelectedImage | null | undefined>(null);
    const [images, setImages] = useState(initialImages);

    const toggleNav = () => setIsNavOpen((prevState) => !prevState);

    const handleImageClick = (id: string) => {
        setActiveImage(id); 
        setSelectedImage(images.find((image) => image.id === id))
    };

    const closeModal = () => {
        setActiveImage(null); 
        setSelectedImage(null);
    };


    const rightArrowModal = useCallback(() => {
      //len 3 array [0, 1, 2] means up to 1 can scroll right
      if (!selectedImage || selectedImage.id == null) return

      setActiveImage((prevActive) => {
        const currentIndex = images.findIndex((image) => image.id === prevActive);
        let newIndex = (currentIndex + 1) % images.length;
        return images[newIndex].id;
      });
    
      setSelectedImage((prevSelected) => {
        const currentIndex = images.findIndex((image) => image.id === prevSelected?.id);
        let newIndex = (currentIndex + 1) % images.length;
        return images[newIndex];
      });

    }, [selectedImage, images]);
    const leftArrowModal = useCallback(() => {
      if (!selectedImage || selectedImage.id == null) return

      setActiveImage((prevActive) => {
        const currentIndex = images.findIndex((image) => image.id === prevActive);
        let newIndex = (currentIndex - 1 + images.length) % images.length; 
        return images[newIndex].id;
      });
    
      setSelectedImage((prevSelected) => {
        const currentIndex = images.findIndex((image) => image.id === prevSelected?.id);
        let newIndex = (currentIndex - 1 + images.length) % images.length; 
        return images[newIndex];
      });
    }, [selectedImage, images]);



    const navigateImage = (direction: 'prev' | 'next') => {
        if (!activeImage) return;

        const currentIndex = images.findIndex((image) => image.id === activeImage);
        let newIndex;

        if (direction === 'prev') {
            newIndex = (currentIndex - 1 + images.length) % images.length; 
        } else {
            newIndex = (currentIndex + 1) % images.length; 
        }

        setActiveImage(images[newIndex].id); 
        setSelectedImage(images[newIndex]);
    };

    const onDrop = (acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map((file, index) => ({
            id: `uploaded-${Date.now()}-${index}`,
            src: URL.createObjectURL(file),
            text: `Uploaded Image ${index + 1}`, 
        }));
        setImages((prevImages) => [...prevImages, ...newImages]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        },
    });


    return (
        <div className="project-intro">
            <div className="nav-icon">
                <Hamburger onClick={toggleNav} />
            </div>

            {isNavOpen && <MainNav />}

            <img src={logo} alt="Logo" className="logo" />
            <h1>Project Introduction</h1>
            <p>This project is designed to demonstrate...</p>

            <div>
                <label htmlFor="imagesPerRow">Images per row:</label>
                <input
                    id="imagesPerRow"
                    type="range"
                    min="1"
                    max="6"
                    value={imagesPerRow}
                    onChange={(e) => setImagesPerRow(Number(e.target.value))}
                />
            </div>

           
            <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag and drop images here, or click to upload</p>
                <em>(Only *.jpeg and *.png images will be accepted)</em>
            </div>

            <div
            className="image-grid"
            style={{
                gridTemplateColumns: `repeat(${imagesPerRow}, 1fr)`, 
                gap: '10px', 
            }}
        >
            {images.map((image) => (
                <div
                    key={image.id}
                    className="image-grid-item"
                    onClick={() => handleImageClick(image.id)}
                >
                    <img src={image.src} alt={image.text} className="grid-image" />
                </div>
            ))}
        </div>


            {selectedImage && (
                <EntryModal selectedImage={selectedImage} closeModal={closeModal} navigateImage={navigateImage} rightArrowModal={rightArrowModal} leftArrowModal={leftArrowModal} />
            )}
        </div>
    );
};

export default ProjectIntroduction;







