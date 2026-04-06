import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { getSearchHistory } from '../../utils/searchHistory';
import { navigateWithTransition } from '../../utils/navigateWithTransition';
import type { DrugInfo } from '../../api/medicineApi';

export default function HomePage() {
  const navigate = useNavigate();
  const [history] = useState<DrugInfo[]>(getSearchHistory);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Navigation title="모약모약" />

      <div className="flex flex-col px-5 pt-6 pb-32">
        {/* Hero Section */}
        <div className="flex flex-col items-center pt-4 pb-2 mb-6">
          <span className="text-[56px] mb-4" role="img" aria-label="약">💊</span>
          <h2 className="text-[22px] font-bold text-[#191F28] mb-2 text-center">
            내 약, 한눈에 확인하세요
          </h2>
          <p className="text-[14px] text-[#8B95A1] text-center leading-relaxed">
            카메라로 찍으면 약 정보를 바로 알려드려요
          </p>
        </div>

        {/* Camera Button */}
        <button
          onClick={() => navigateWithTransition(navigate,'/camera')}
          className="w-full h-[120px] rounded-2xl bg-[#3182F6] p-4 flex flex-col items-center justify-center gap-3 active:bg-[#1B64DA] transition-colors mb-6"
        >
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <path d="M15.5 10.5L14 13H9C7.9 13 7 13.9 7 15V29C7 30.1 7.9 31 9 31H31C32.1 31 33 30.1 33 29V15C33 13.9 32.1 13 31 13H26L24.5 10.5H15.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="22" r="5" stroke="white" strokeWidth="2" />
          </svg>
          <span className="text-white text-[16px] font-semibold">카메라로 약 촬영하기</span>
        </button>

        {/* Menu Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigateWithTransition(navigate,'/identify?mode=search')}
            className="flex-1 h-[100px] rounded-2xl bg-[#F4F5F7] p-4 flex flex-col items-center justify-center gap-2 active:bg-[#E5E8EB] transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="14" cy="14" r="7" stroke="#3182F6" strokeWidth="2" />
              <path d="M19 19L25 25" stroke="#3182F6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[14px] font-semibold text-[#191F28]">약 검색</span>
            <span className="text-[12px] text-[#8B95A1]">모양/색상으로 찾기</span>
          </button>

          <button
            onClick={() => navigateWithTransition(navigate,'/cabinet')}
            className="flex-1 h-[100px] rounded-2xl bg-[#F4F5F7] p-4 flex flex-col items-center justify-center gap-2 active:bg-[#E5E8EB] transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect x="6" y="8" width="20" height="18" rx="3" stroke="#3182F6" strokeWidth="2" />
              <path d="M6 14H26" stroke="#3182F6" strokeWidth="2" />
              <path d="M14 14V8" stroke="#3182F6" strokeWidth="2" />
            </svg>
            <span className="text-[14px] font-semibold text-[#191F28]">내 약통</span>
            <span className="text-[12px] text-[#8B95A1]">유통기한 관리</span>
          </button>
        </div>

        {/* Recent History */}
        <div>
          <h3 className="text-[16px] font-semibold text-[#191F28] mb-3">최근 검색한 약</h3>
          {history.length === 0 ? (
            <div className="rounded-2xl bg-[#F4F5F7] p-4 py-12 flex flex-col items-center gap-2">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="mb-3">
                <circle cx="24" cy="24" r="20" stroke="#D1D6DB" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M18 24H30M24 18V30" stroke="#D1D6DB" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-[14px] text-[#8B95A1]">아직 검색 기록이 없어요</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((drug) => (
                <button
                  key={drug.itemSeq}
                  onClick={() => navigateWithTransition(navigate,'/result', { state: { items: [drug] } })}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#F4F5F7] text-left active:bg-[#E5E8EB] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <span className="text-[20px]">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#191F28] truncate">{drug.name}</p>
                    <p className="text-[12px] text-[#8B95A1]">{drug.manufacturer}</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <path d="M9 5l7 7-7 7" stroke="#8B95A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
