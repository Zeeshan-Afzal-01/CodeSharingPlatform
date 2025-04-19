import React from 'react';
import ImageCropper from "./ImageCropper";

const Modal = ({ updateAvatar, closeModal, isUploading }) => {
  return (
    <>
      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      
      {/* Modal */}
      <div 
        className="modal fade show" 
        style={{ 
          display: 'block',
          zIndex: 1050
        }}
        tabIndex="-1" 
        role="dialog" 
        aria-labelledby="cropImageModalLabel" 
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content bg-dark">
            <div className="modal-header border-0">
              <h5 className="modal-title text-white" id="cropImageModalLabel">
                Crop Profile Image
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={closeModal}
                aria-label="Close"
                disabled={isUploading}
              ></button>
            </div>
            <div className="modal-body p-4">
              {isUploading ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-white mb-0">Uploading image...</p>
                </div>
              ) : (
                <ImageCropper
                  updateAvatar={updateAvatar}
                  closeModal={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
