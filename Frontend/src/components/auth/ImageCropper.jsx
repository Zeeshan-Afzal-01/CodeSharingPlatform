import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "./setCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = ({ closeModal, updateAvatar, isUploading }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");
  const [completedCrop, setCompletedCrop] = useState(null);

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleCrop = () => {
    if (!imgRef.current || !previewCanvasRef.current || !completedCrop) return;
    
    setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(
        completedCrop,
        imgRef.current.width,
        imgRef.current.height
      )
    );
    const dataUrl = previewCanvasRef.current.toDataURL();
    updateAvatar(dataUrl);
    closeModal();
  };

  return (
    <div className="container-fluid p-0">
      <div className="row justify-content-center g-0">
        <div className="col-12">
          <div className="text-center mb-3">
            <label className="btn btn-outline-light">
              <i className="fas fa-camera me-2"></i>
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="d-none"
                disabled={isUploading}
              />
            </label>
          </div>
          
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          
          {imgSrc && (
            <div className="d-flex flex-column align-items-center">
              <div className="crop-container mb-3">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={ASPECT_RATIO}
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Upload"
                    style={{ maxHeight: "70vh" }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setCrop(null);
                    setCompletedCrop(null);
                  }}
                  disabled={isUploading}
                >
                  <i className="fas fa-redo me-2"></i>
                  Reset
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCrop}
                  disabled={!completedCrop || isUploading}
                >
                  <i className="fas fa-check me-2"></i>
                  {isUploading ? 'Uploading...' : 'Crop Image'}
                </button>
              </div>
            </div>
          )}
          
          <canvas
            ref={previewCanvasRef}
            className="d-none"
          />
        </div>
      </div>

      <style jsx>{`
        .reactCrop {
          background: none !important;
        }
        .reactCrop > div {
          background: none !important;
        }
        :global(.ReactCrop__crop-selection) {
          border: 2px solid white;
        }
        :global(.ReactCrop__drag-handle) {
          background-color: white;
          width: 10px;
          height: 10px;
        }
        :global(.ReactCrop__drag-bar) {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ImageCropper;
