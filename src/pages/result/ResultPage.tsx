import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import type { DrugInfo } from '../../api/medicineApi';
import { addToCabinet, isInCabinet } from '../../utils/cabinetStorage';
import { addToSearchHistory } from '../../utils/searchHistory';
import { navigateWithTransition } from '../../utils/navigateWithTransition';

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const allItems = (location.state as { items?: DrugInfo[] })?.items ?? [];
  const items = allItems.slice(0, 20);
  const drug = items[0];
  const [registered, setRegistered] = useState(() => drug ? isInCabinet(drug.itemSeq) : false);

  useEffect(() => {
    if (drug) addToSearchHistory(drug);
  }, [drug?.itemSeq]);

  if (!drug) {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <Navigation title="검색 결과" onBack={() => navigateWithTransition(navigate,-1)} />
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-3">
          <span className="text-[48px]">🔍</span>
          <p className="text-[16px] font-semibold text-[#191F28]">결과를 찾을 수 없어요</p>
          <p className="text-[14px] text-[#8B95A1]">검색 화면에서 다시 시도해주세요</p>
        </div>
      </div>
    );
  }

  const sections = [
    { title: '분류', content: drug.className || '-' },
    { title: '제형', content: drug.formName || '-' },
    { title: '전면 각인', content: drug.printFront || '-' },
    { title: '후면 각인', content: drug.printBack || '-' },
    { title: '구분', content: drug.etcOtcName || '-' },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Navigation title="검색 결과" onBack={() => navigateWithTransition(navigate,-1)} />

      <div className="flex-1 px-5 pt-6 pb-32">
        {/* Drug Card */}
        <div className="border border-[#E5E8EB] rounded-2xl p-4">
          <div className="flex items-start gap-4">
            {drug.image ? (
              <img
                src={drug.image}
                alt={drug.name}
                loading="lazy"
                className="w-14 h-14 rounded-2xl object-cover shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-14 h-14 rounded-2xl bg-[#F4F5F7] flex items-center justify-center shrink-0 ${drug.image ? 'hidden' : ''}`}>
              <span className="text-[28px]">💊</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-bold text-[#191F28] mb-1">
                {drug.name}
              </h2>
              <p className="text-[13px] text-[#8B95A1] mb-2">
                {drug.manufacturer}
              </p>
              <div className="flex gap-1.5">
                <span className="text-[12px] text-[#4E5968] bg-[#F4F5F7] px-2 py-0.5 rounded-md">
                  {drug.shape}
                </span>
                <span className="text-[12px] text-[#4E5968] bg-[#F4F5F7] px-2 py-0.5 rounded-md">
                  {drug.color}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Sections */}
        {sections.map((section) => (
          <div key={section.title} className="mt-6 pt-6 border-t border-[#F4F5F7]">
            <h3 className="text-[16px] font-semibold text-[#191F28] mb-3">
              {section.title}
            </h3>
            <p className="text-[14px] text-[#4E5968] leading-[22px]">
              {section.content}
            </p>
          </div>
        ))}

        {/* More Results */}
        {items.length > 1 && (
          <div className="mt-8">
            <h3 className="text-[16px] font-semibold text-[#191F28] mb-3">
              다른 검색 결과 ({items.length - 1}건)
            </h3>
            <div className="flex flex-col gap-3">
              {items.slice(1).map((item) => (
                <button
                  key={item.itemSeq}
                  onClick={() => navigateWithTransition(navigate,'/result', { state: { items: [item, ...items.filter(i => i.itemSeq !== item.itemSeq)] } })}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-[#F4F5F7] text-left active:bg-[#E5E8EB] transition-colors"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 ${item.image ? 'hidden' : ''}`}>
                    <span className="text-[20px]">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#191F28] truncate">{item.name}</p>
                    <p className="text-[12px] text-[#8B95A1]">{item.manufacturer}</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path d="M9 5l7 7-7 7" stroke="#8B95A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] max-w-full px-5 py-4 bg-white border-t border-[#F4F5F7]">
        {registered ? (
          <button
            onClick={() => navigateWithTransition(navigate,'/cabinet')}
            className="w-full h-[52px] rounded-xl text-[16px] font-semibold bg-[#F4F5F7] text-[#4E5968] active:bg-[#E5E8EB] transition-colors"
          >
            내 약통 보기
          </button>
        ) : (
          <button
            onClick={() => {
              addToCabinet(drug);
              setRegistered(true);
            }}
            className="w-full h-[52px] rounded-xl text-[16px] font-semibold bg-[#3182F6] text-white active:bg-[#1B64DA] transition-colors"
          >
            내 약통에 등록하기
          </button>
        )}
      </div>
    </div>
  );
}
