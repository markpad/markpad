import { useCallback } from 'react'
import { useNewMode } from '@/hooks/useNewMode'
import { Editor } from '@/components/Editor'
import type { AppState } from '@/types'

/**
 * New page — ephemeral pako-based editor.
 * State is encoded in the URL hash (no account / IndexedDB required).
 * The "Save" button persists the current state as a permanent document
 * and navigates to /editor/:id.
 */
export function NewPage() {
  const { saveDocument, isSaving } = useNewMode()

  const handleSaveToDocument = useCallback(
    (state: AppState) => {
      saveDocument(state)
    },
    [saveDocument]
  )

  return (
    <Editor
      initialMode="split"
      showStylePanelByDefault={false}
      entityType="document"
      onSaveToDocument={handleSaveToDocument}
      isSavingToDocument={isSaving}
    />
  )
}

export default NewPage
