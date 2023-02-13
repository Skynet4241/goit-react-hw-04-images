import React from 'react';
import { useState } from 'react';
import { ImageGallery } from './ImageGallery';
import { SearchBar } from './Searchbar';
import { Button } from './Button';
import { getImageList } from './API/API';
import { Modal } from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { settings } from './ToastSettings';
import { Loader } from './Loader/Loader';
import { Wrap } from './Button';
import { useEffect } from 'react';

export const App = () => {
  const [images, setImages] = useState([]);
  const [loadButton, setLoadButton] = useState(null);
  const [currentSearch, setCurrentSearch] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalIMG, setModalIMG] = useState('');

  const onFormSubmit = async e => {
    e.preventDefault();
    const searchQuery = e.target.elements.input.value.trim().toLowerCase();
    if (!searchQuery.trim()) {
      toast.error('Please enter a non-empty query!', settings);
      return;
    }
    setImages([]);
    setCurrentSearch(searchQuery);
    setLoadButton(null);
  };
  const getImages = async () => {
    try {
      setLoading(true);
      const { hits, totalHits } = await getImageList(currentSearch, pageNumber);
      if (hits.length === 0) {
        toast.error('We did not find an image for your query!', settings);
      }
      setLoadButton(pageNumber < Math.ceil(totalHits / 12));
      setImages([...images, ...hits]);
    } catch (error) {
      toast.error(error.message, settings);
    } finally {
      setLoading(false);
    }
  };
  const onLoadMoreClick = async () => {
    setPageNumber(pageNumber + 1);
  };

  const onImageClick = url => {
    setShowModal(!showModal);
    setModalIMG(url);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!currentSearch) return;
    getImages();
  }, [currentSearch, pageNumber]);

  return (
    <>
      <SearchBar onFormSubmit={onFormSubmit} />
      <ImageGallery images={images} clickHandler={onImageClick} />

      {loading && <Loader loading={loading} />}

      <Wrap>
        {loadButton && <Button onClick={onLoadMoreClick} />}
        <ToastContainer />
      </Wrap>
      {showModal && (
        <Modal image={modalIMG} alt={currentSearch} onClose={onCloseModal} />
      )}
    </>
  );
};
