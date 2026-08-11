import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ModeToggle } from './components/ModeToggle'
import { Dropzone } from './components/Dropzone'
import { SlotGrid } from './components/SlotGrid'
import { BuilderForm } from './components/BuilderForm'
import { OutputTabs } from './components/OutputTabs'
import { CanvasStage } from './components/CanvasStage'
import { ActionButtons } from './components/ActionButtons'
import { CaptionBox } from './components/CaptionBox'
import { QuickPresets } from './components/QuickPresets'
import { QRModal } from './components/QRModal'
import { useBuilderStudio } from './hooks/useBuilderStudio'

function App() {
  const {
    state,
    canvasRef,
    isQRModalOpen,
    setIsQRModalOpen,
    setMode,
    setOutput,
    setName,
    setStack,
    setBuilderClass,
    updatePhotoPosition,
    resetPhotoPosition,
    setActivePhotoSlot,
    setCardTheme,
    toggleSkillTag,
    setPhoto,
    applyPreset,
    buildCaption,
    download,
    shareToX,
  } = useBuilderStudio()

  const hasPhoto = state.photos.some(Boolean)
  const activeSlot = state.activePhotoSlot || 0
  const activePosition = state.photoPositions[activeSlot] || { x: 0, y: 0, zoom: 1 }

  return (
    <div className="min-h-screen bg-dot-texture">
      <Header />

      <main className="max-w-[1120px] mx-auto px-4 sm:px-6">
        <Hero />

        <QuickPresets onApplyPreset={applyPreset} />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 pb-16 items-start">
          <div className="bg-white border border-goa-line rounded-[16px] p-6 shadow-[0_10px_30px_rgba(27,94,63,0.12)]">
            <h2 className="font-display text-xl text-goa-green-dark mb-1">Build your frame & ID Card</h2>
            <p className="text-[13px] text-goa-ink-soft mb-5">
              Customize photos, skills, WebApp QR link, and theme styling.
            </p>

            <ModeToggle mode={state.mode} onChange={setMode} />
            <Dropzone
              onFile={(file) => {
                const reader = new FileReader()
                reader.onload = (e) => setPhoto(0, e.target?.result as string)
                reader.readAsDataURL(file)
              }}
            />
            <SlotGrid
              mode={state.mode}
              photos={state.photos}
              activePhotoSlot={activeSlot}
              onSetPhoto={setPhoto}
              onSelectSlot={setActivePhotoSlot}
            />
            <BuilderForm
              name={state.name}
              stack={state.stack}
              builderClass={state.builderClass}
              cardTheme={state.cardTheme}
              selectedSkills={state.selectedSkills}
              onName={setName}
              onStack={setStack}
              onBuilderClass={setBuilderClass}
              onSelectTheme={setCardTheme}
              onToggleSkill={toggleSkillTag}
            />
          </div>

          <div className="bg-white border border-goa-line rounded-[16px] p-6 shadow-[0_10px_30px_rgba(27,94,63,0.12)] sticky top-6">
            <h2 className="font-display text-xl text-goa-green-dark mb-1">Live Preview</h2>
            <p className="text-[13px] text-goa-ink-soft mb-5">
              Switch between the frame and your Scannable Builder ID Card.
            </p>

            <OutputTabs output={state.output} onChange={setOutput} />
            <CanvasStage
              canvasRef={canvasRef}
              outputMode={state.output}
              activePhotoSlot={activeSlot}
              photoPosition={activePosition}
              hasPhoto={hasPhoto}
              mode={state.mode}
              photos={state.photos}
              onOpenQRModal={() => setIsQRModalOpen(true)}
              onUpdatePosition={(update) => updatePhotoPosition(activeSlot, update)}
              onResetPosition={() => resetPhotoPosition(activeSlot)}
              onSelectSlot={setActivePhotoSlot}
            />
            <ActionButtons
              onDownload={download}
              onShare={shareToX}
              onOpenQRModal={() => setIsQRModalOpen(true)}
            />
            <CaptionBox caption={buildCaption()} />
          </div>
        </div>

        <p className="text-center text-xs text-goa-ink-soft pb-12">
          Post your generated frame & scannable ID card with{' '}
          <a
            href="https://twitter.com/intent/tweet?text=%23FrameInGoa"
            target="_blank"
            rel="noreferrer"
            className="text-goa-pink-dark font-semibold no-underline hover:underline"
          >
            #FrameInGoa
          </a>{' '}
          to get featured in the Radar and climb the leaderboard.
        </p>
      </main>

      <QRModal
        isOpen={isQRModalOpen}
        webAppUrl={state.webAppUrl}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  )
}

export default App
