import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMedicine } from '../../api/medicineApi';
import { navigateWithTransition } from '../../utils/navigateWithTransition';

type Step = 'camera' | 'confirm' | 'input';

export default function CameraPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('camera');
  const [imprint, setImprint] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.8));
    stopCamera();
    setStep('confirm');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setStep('camera');
    startCamera();
  };

  const handleSearch = async () => {
    if (!imprint.trim()) return;
    setLoading(true);
    try {
      const { items } = await searchMedicine({ imprint: imprint.trim() });
      navigateWithTransition(navigate, '/result', { state: { items } });
    } catch (e) {
      console.error('검색 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center h-[56px] px-5">
        <button
          onClick={() => { stopCamera(); navigateWithTransition(navigate, -1); }}
          className="p-1 -ml-1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {step === 'camera' && (
        <>
          {/* Camera Preview */}
          <div className="flex-1 flex items-center justify-center relative">
            {cameraError ? (
              <div className="flex flex-col items-center gap-4 px-5">
                <span className="text-[48px]">📷</span>
                <p className="text-white/80 text-[16px] font-semibold text-center">
                  카메라에 접근할 수 없어요
                </p>
                <p className="text-white/50 text-[14px] text-center">
                  브라우저 설정에서 카메라 권한을 허용하거나,<br />
                  각인 문자로 직접 검색해보세요
                </p>
                <button
                  onClick={() => setStep('input')}
                  className="mt-2 h-[44px] px-6 rounded-xl text-[14px] font-semibold bg-[#3182F6] text-white active:bg-[#1B64DA] transition-colors"
                >
                  각인으로 검색하기
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Guide Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[240px] h-[240px] border-2 border-white/60 rounded-3xl" />
                </div>
                <p className="absolute bottom-32 text-white/80 text-[14px] font-medium">
                  알약을 가이드 안에 맞춰주세요
                </p>
              </>
            )}
          </div>

          {/* Capture Button */}
          {!cameraError && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-10">
              <button
                onClick={handleCapture}
                className="w-[72px] h-[72px] rounded-full border-4 border-white flex items-center justify-center"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-white active:bg-white/80 transition-colors" />
              </button>
            </div>
          )}
        </>
      )}

      {step === 'confirm' && capturedImage && (
        <>
          <div className="flex-1 flex items-center justify-center">
            <img src={capturedImage} alt="촬영된 이미지" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 h-[52px] rounded-xl text-[16px] font-semibold bg-white/20 text-white active:bg-white/30 transition-colors"
            >
              다시 촬영
            </button>
            <button
              onClick={() => setStep('input')}
              className="flex-1 h-[52px] rounded-xl text-[16px] font-semibold bg-[#3182F6] text-white active:bg-[#1B64DA] transition-colors"
            >
              다음
            </button>
          </div>
        </>
      )}

      {step === 'input' && (
        <div className="flex-1 flex flex-col bg-white">
          <div className="pt-16 px-5 flex-1 flex flex-col">
            {/* Captured Preview */}
            {capturedImage && (
              <div className="flex justify-center mb-6">
                <img
                  src={capturedImage}
                  alt="촬영된 약"
                  className="w-[160px] h-[160px] rounded-2xl object-cover"
                />
              </div>
            )}

            <h2 className="text-[18px] font-bold text-[#191F28] mb-2">
              각인 문자를 입력해주세요
            </h2>
            <p className="text-[14px] text-[#8B95A1] mb-6">
              촬영한 알약에 보이는 문자나 숫자를 입력하면 약을 찾아드려요
            </p>

            <input
              type="text"
              value={imprint}
              onChange={(e) => setImprint(e.target.value)}
              placeholder="예: GC, 250, DL5"
              autoFocus
              className="w-full h-[56px] px-5 rounded-xl bg-[#F4F5F7] border border-[#E5E8EB] text-[15px] text-[#191F28] placeholder-[#8B95A1] outline-none focus:ring-2 focus:ring-[#3182F6] transition-shadow"
            />
          </div>

          <div className="px-5 py-4 border-t border-[#F4F5F7]">
            <button
              onClick={handleSearch}
              disabled={!imprint.trim() || loading}
              className="w-full h-[52px] rounded-xl text-[16px] font-semibold bg-[#3182F6] text-white active:bg-[#1B64DA] transition-colors disabled:opacity-50"
            >
              {loading ? '검색 중...' : '검색하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
