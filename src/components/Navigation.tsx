interface NavigationProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function Navigation({ title, onBack, rightAction }: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#F4F5F7]">
      <div className="flex items-center justify-between h-[56px] px-5">
        <div className="w-10 flex items-center justify-start">
          {onBack && (
            <button onClick={onBack} className="p-1 -ml-1" aria-label="뒤로가기">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
        <h1 className="text-[18px] font-bold text-[#191F28] tracking-tight">{title}</h1>
        <div className="w-10 flex items-center justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
