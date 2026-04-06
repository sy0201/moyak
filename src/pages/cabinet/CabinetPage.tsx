import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { getCabinetItems, removeFromCabinet, type CabinetItem } from '../../utils/cabinetStorage';
import { navigateWithTransition } from '../../utils/navigateWithTransition';

export default function CabinetPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CabinetItem[]>(getCabinetItems);

  const handleRemove = (itemSeq: string) => {
    removeFromCabinet(itemSeq);
    setItems(getCabinetItems());
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <Navigation title="내 약통" onBack={() => navigateWithTransition(navigate,-1)} />
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-3">
          <span className="text-[48px]">💊</span>
          <p className="text-[16px] font-semibold text-[#191F28]">약통이 비어있어요</p>
          <p className="text-[14px] text-[#8B95A1] text-center">약 검색 후 등록하면 여기에 표시돼요</p>
          <button
            onClick={() => navigateWithTransition(navigate,'/identify')}
            className="mt-4 h-[44px] px-6 rounded-xl text-[14px] font-semibold bg-[#3182F6] text-white active:bg-[#1B64DA] transition-colors"
          >
            약 검색하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Navigation title="내 약통" onBack={() => navigateWithTransition(navigate,-1)} />

      <div className="flex-1 px-5 pt-6 pb-10">
        <p className="text-[14px] text-[#8B95A1] mb-4">
          총 {items.length}개의 약이 등록되어 있어요
        </p>

        <div className="flex flex-col gap-3">
          {items.map(({ drug, addedAt }) => (
            <div
              key={drug.itemSeq}
              onClick={() => navigateWithTransition(navigate,'/result', { state: { items: [drug] } })}
              className="flex items-center gap-3 p-4 rounded-2xl border border-[#E5E8EB] cursor-pointer active:bg-[#F4F5F7] transition-colors"
            >
              {drug.image ? (
                <img
                  src={drug.image}
                  alt={drug.name}
                  loading="lazy"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-12 h-12 rounded-xl bg-[#F4F5F7] flex items-center justify-center shrink-0 ${drug.image ? 'hidden' : ''}`}>
                <span className="text-[24px]">💊</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#191F28] truncate">
                  {drug.name}
                </p>
                <p className="text-[12px] text-[#8B95A1] mt-0.5">
                  {drug.manufacturer}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] text-[#4E5968] bg-[#F4F5F7] px-1.5 py-0.5 rounded">
                    {drug.shape}
                  </span>
                  <span className="text-[11px] text-[#4E5968] bg-[#F4F5F7] px-1.5 py-0.5 rounded">
                    {drug.color}
                  </span>
                  <span className="text-[11px] text-[#8B95A1]">
                    {formatDate(addedAt)}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(drug.itemSeq); }}
                className="p-2 -mr-1 shrink-0 active:bg-[#F4F5F7] rounded-lg transition-colors"
                aria-label="삭제"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="#8B95A1" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} 등록`;
}
