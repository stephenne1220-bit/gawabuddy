import { isIos, isStandalone, promptInstall, useCanInstall } from '@/lib/install'

export function InstallRow() {
  const canInstall = useCanInstall()
  const installed = isStandalone()
  
  const hint = installed 
    ? 'GawaBuddy is installed on this device.' 
    : canInstall 
      ? 'Add GawaBuddy to your home screen for quick access, even offline.' 
      : isIos() 
        ? 'On iPhone: tap Share, then Add to Home Screen.' 
        : 'Use your browser menu and choose Install app or Add to Home screen.'

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#1F2937] dark:text-white">Install GawaBuddy</p>
        <p className="mt-0.5 text-xs text-[#6B7280] dark:text-[#A9B8AF]">{hint}</p>
      </div>
      {canInstall && !installed && (
        <button 
          type="button" 
          onClick={() => void promptInstall()} 
          className="shrink-0 rounded-xl bg-[#0B3D2E] px-3 py-2 text-sm font-semibold text-white dark:bg-[#4ADE80] dark:text-[#031310]"
        >
          Install
        </button>
      )}
    </div>
  )
}