import { useCallback } from 'react'
import { useTryMode } from '@/hooks/useTryMode'
import { Editor } from '@/components/Editor'
import type { AppState } from '@/types'

/**
 * Try page — ephemeral pako-based editor.
 * State is encoded in the URL hash (no account / IndexedDB required).
 * The "Save" button persists the current state as a permanent document
 * and navigates to /editor/:id.
 */
export function TryPage() {
  const { saveDocument, isSaving } = useTryMode()

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

export default TryPage
