import { useState, useEffect, useCallback } from 'react'

export type EditionMode = 'split' | 'preview' | 'edit'

export interface UserSettings {
  editor: {
    showLineNumbers: boolean
    openLinksInNewTab: boolean
    syncScroll: boolean
    defaultView: EditionMode
    darkMode: boolean
  }
}

const DEFAULT_SETTINGS: UserSettings = {
  editor: {
    showLineNumbers: true,
    openLinksInNewTab: true,
    syncScroll: true,
    defaultView: 'split',
    darkMode: false,
  },
}

const USER_SETTINGS_KEY = 'markpad-user-settings'

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(USER_SETTINGS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Shallow merge with defaults to handle new keys
        return {
          ...DEFAULT_SETTINGS,
          editor: {
            ...DEFAULT_SETTINGS.editor,
            ...(parsed.editor || {}),
          },
        }
      }
    } catch (e) {
      console.error('Failed to load user settings:', e)
    }
    return DEFAULT_SETTINGS
  })

  useEffect(() => {
    try {
      localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings))
    } catch (e) {
      console.error('Failed to save user settings:', e)
    }
  }, [settings])

  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings> | ((prev: UserSettings) => UserSettings)) => {
      setSettings((prev) => {
        if (typeof newSettings === 'function') {
          return newSettings(prev)
        }
        return {
          ...prev,
          ...newSettings,
          editor: {
            ...prev.editor,
            ...(newSettings.editor || {}),
          },
        }
      })
    },
    []
  )

  const updateEditorSetting = useCallback(
    <K extends keyof UserSettings['editor']>(key: K, value: UserSettings['editor'][K]) => {
      setSettings((prev) => ({
        ...prev,
        editor: {
          ...prev.editor,
          [key]: value,
        },
      }))
    },
    []
  )

  return {
    settings,
    updateSettings,
    updateEditorSetting,
  }
}
