import { useMemo, useState } from "react";
import Cropper from "react-easy-crop";

function CropImageModal({ open, imageSrc, title = "Crop Image", aspect = 16 / 9, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const canConfirm = useMemo(() => Boolean(croppedAreaPixels), [croppedAreaPixels]);

  if (!open || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/20 bg-[#0b0f16] p-4 md:p-6">
        <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
        <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-black md:h-[420px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            objectFit="contain"
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-white/75">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="rounded-lg border border-white/30 px-4 py-2 text-white" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg bg-white px-4 py-2 font-semibold text-black disabled:opacity-50"
            disabled={!canConfirm}
            onClick={() => onConfirm(croppedAreaPixels)}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default CropImageModal;
