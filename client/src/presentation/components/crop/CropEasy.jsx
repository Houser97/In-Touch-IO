import { Cancel } from '@mui/icons-material';
import CropIcon from '@mui/icons-material/Crop';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slider,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils/cropImage';
import useWindowSize from '../../hooks/useWindowSize';

const CropEasy = ({ photoURL, setPreviewSourceParent, setPhotoURL, setFile }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const windowSize = useWindowSize();

  const DialogContentHeight = windowSize.width >= 600 ? 300 : 200;

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {

    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      );
      setPreviewSourceParent(url);
      setFile(file);
      setPhotoURL('');
    } catch (error) {

      console.log(error);
    }

  };
  return (
    <>
      <Dialog open={photoURL !== ''}>
        <DialogContent
          dividers
          sx={{
            background: '#333',
            position: 'relative',
            height: DialogContentHeight,
            width: 'auto',
            minWidth: { sm: 500 },
          }}
        >
          <Cropper
            image={photoURL}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
          />
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
          <Box sx={{ width: '100%', mb: 1 }}>
            <Box>
              <Typography>Zoom: {zoomPercent(zoom)}</Typography>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={zoomPercent}
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </Box>
            <Box>
              <Typography>Rotation: {rotation + '°'}</Typography>
              <Slider
                valueLabelDisplay="auto"
                min={0}
                max={360}
                value={rotation}
                onChange={(e, rotation) => setRotation(rotation)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={() => setPhotoURL('')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<CropIcon />}
              onClick={cropImage}
            >
              Crop
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CropEasy;

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`;
};