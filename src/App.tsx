import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Editor from './components/Editor'
import { ThemeGallery } from './components/themes/ThemeGallery'
import { PublishedPage } from './components/published'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to theme gallery */}
        <Route path="/" element={<Navigate to="/themes" replace />} />

        {/* Theme Gallery */}
        <Route path="/themes" element={<ThemeGallery />} />

        {/* Main editor with split view */}
        <Route
          path="/editor"
          element={<Editor initialMode="split" showStylePanelByDefault={true} />}
        />

        {/* Preview mode - no editor, just preview */}
        <Route
          path="/preview"
          element={<Editor initialMode="preview" showStylePanelByDefault={false} />}
        />

        {/* Published page - read-only preview with minimal header */}
        <Route path="/publish/:pako" element={<PublishedPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/themes" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
