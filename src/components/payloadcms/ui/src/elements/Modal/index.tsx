'use client'
import React, { createContext, useCallback, useContext, useState } from 'react'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'

// Modal state type
type ModalState = {
  [slug: string]: {
    isOpen: boolean
  }
}

// Modal context type
type ModalContextType = {
  closeAllModals: () => void
  closeModal: (slug: string) => void
  isModalOpen: (slug: string) => boolean
  modalState: ModalState
  openModal: (slug: string) => void
  toggleModal: (slug: string) => void
}

const ModalContext = createContext<ModalContextType | null>(null)

// Hook to use modal context
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    // Return a default implementation if no provider
    return {
      closeAllModals: () => {},
      closeModal: () => {},
      isModalOpen: () => false,
      modalState: {},
      openModal: () => {},
      toggleModal: () => {},
    }
  }
  return context
}

// Modal Provider component
export const ModalProvider: React.FC<{
  children: React.ReactNode
  classPrefix?: string
  transTime?: number
  zIndex?: string
}> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({})

  const openModal = useCallback((slug: string) => {
    setModalState((prev) => ({
      ...prev,
      [slug]: { isOpen: true },
    }))
  }, [])

  const closeModal = useCallback((slug: string) => {
    setModalState((prev) => ({
      ...prev,
      [slug]: { isOpen: false },
    }))
  }, [])

  const toggleModal = useCallback((slug: string) => {
    setModalState((prev) => ({
      ...prev,
      [slug]: { isOpen: !prev[slug]?.isOpen },
    }))
  }, [])

  const closeAllModals = useCallback(() => {
    setModalState((prev) => {
      const newState: ModalState = {}
      for (const slug of Object.keys(prev)) {
        newState[slug] = { isOpen: false }
      }
      return newState
    })
  }, [])

  const isModalOpen = useCallback((slug: string) => !!modalState[slug]?.isOpen, [modalState])

  return (
    <ModalContext.Provider
      value={{ closeAllModals, closeModal, isModalOpen, modalState, openModal, toggleModal }}
    >
      {children}
    </ModalContext.Provider>
  )
}

// Modal Container - renders nothing, modals are portaled
export const ModalContainer: React.FC = () => null

// Modal component props
type ModalProps = {
  children: React.ReactNode
  className?: string
  closeOnBlur?: boolean
  slug: string
  style?: React.CSSProperties
}

// Modal component using shadcn Dialog
export const Modal: React.FC<ModalProps> = ({
  children,
  className,
  closeOnBlur = true,
  slug,
  style,
}) => {
  const { closeModal, modalState } = useModal()
  const isOpen = !!modalState[slug]?.isOpen

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal(slug)}>
      <DialogPortal>
        <DialogOverlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <DialogContent
          className={cn('fixed z-50 bg-background', className)}
          style={style}
          onInteractOutside={closeOnBlur ? undefined : (e) => e.preventDefault()}
          onEscapeKeyDown={closeOnBlur ? undefined : (e) => e.preventDefault()}
          aria-describedby={undefined}
        >
          {/* Hidden title for accessibility - content should provide visible title */}
          <DialogTitle className="sr-only">Modal</DialogTitle>
          {children}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
