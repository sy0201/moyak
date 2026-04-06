import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { searchMedicine } from '../../api/medicineApi';
import { navigateWithTransition } from '../../utils/navigateWithTransition';

const SHAPES = [
  { label: '원형', value: 'circle' },
  { label: '타원형', value: 'oval' },
  { label: '장방형', value: 'oblong' },
  { label: '삼각형', value: 'triangle' },
  { label: '사각형', value: 'square' },
];

const COLORS = [
  { label: '흰색', value: 'white', bg: '#FFFFFF', border: true },
  { label: '노란색', value: 'yellow', bg: '#FFD600' },
  { label: '주황색', value: 'orange', bg: '#FF8A00' },
  { label: '분홍색', value: 'pink', bg: '#FF5CA0' },
  { label: '빨간색', value: 'red', bg: '#FF3B30' },
  { label: '갈색', value: 'brown', bg: '#8B4513' },
  { label: '초록색', value: 'green', bg: '#34C759' },
  { label: '파란색', value: 'blue', bg: '#3182F6' },
  { label: '보라색', value: 'purple', bg: '#AF52DE' },
  { label: '회색', value: 'gray', bg: '#8E8E93' },
  { label: '검정', value: 'black', bg: '#1C1C1E' },
];

export default function IdentifyPage() {
  const navigate = useNavigate();
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [imprint, setImprint] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { items } = await searchMedicine({
        shape: selectedShape,
        color: selectedColor,
        imprint: imprint.trim() || null,
      });
      navigateWithTransition(navigate, '/result', { state: { items } });
    } catch (e) {
      console.error('검색 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Navigation title="약 검색" onBack={() => navigateWithTransition(navigate, -1)} />

      <div className="flex-1 flex flex-col px-5 pt-6 pb-10">
        {/* Shape Filter */}
        <div>
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-3">알약 모양</h3>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {SHAPES.map((shape) => (
              <button
                key={shape.value}
                onClick={() => setSelectedShape(selectedShape === shape.value ? null : shape.value)}
                className={`h-[40px] px-4 rounded-full text-[14px] font-medium whitespace-nowrap shrink-0 border transition-colors ${
                  selectedShape === shape.value
                    ? 'bg-[#3182F6] text-white border-[#3182F6]'
                    : 'bg-[#F4F5F7] text-[#191F28] border-[#E5E8EB] active:bg-[#E5E8EB]'
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div className="pt-6">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-3">알약 색상</h3>
          <div className="flex gap-3 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(selectedColor === color.value ? null : color.value)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-[40px] h-[40px] rounded-full transition-all ${
                    color.border ? 'border border-[#E5E8EB]' : ''
                  } ${
                    selectedColor === color.value
                      ? 'ring-2 ring-[#3182F6] ring-offset-2'
                      : ''
                  }`}
                  style={{ backgroundColor: color.bg }}
                />
                <span className={`text-[11px] ${
                  selectedColor === color.value
                    ? 'text-[#3182F6] font-semibold'
                    : 'text-[#8B95A1]'
                }`}>
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Imprint Input */}
        <div className="pt-6">
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-3">각인 문자</h3>
          <input
            type="text"
            value={imprint}
            onChange={(e) => setImprint(e.target.value)}
            placeholder="알약에 적힌 문자를 입력하세요"
            className="w-full h-[56px] px-5 rounded-xl bg-[#F4F5F7] border border-[#E5E8EB] text-[15px] text-[#191F28] placeholder-[#8B95A1] outline-none focus:ring-2 focus:ring-[#3182F6] transition-shadow"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="sticky bottom-0 px-5 py-4 bg-white border-t border-[#F4F5F7]">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full h-[52px] rounded-xl text-[16px] font-semibold bg-[#3182F6] text-white active:bg-[#1B64DA] transition-colors disabled:opacity-50"
        >
          {loading ? '검색 중...' : '검색하기'}
        </button>
      </div>
    </div>
  );
}
