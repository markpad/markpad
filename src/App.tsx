import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Editor from './components/Editor'
import { ThemesPage } from './components/themes/ThemesPage'
import { PublishedPage } from './components/published'
import { HomePage } from './components/HomePage'
import { ThemeEditorPage } from './components/theme-editor'
import { DocumentsPage } from './components/documents'
import { TemplatesPage } from './components/templates'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Documents page */}
        <Route path="/documents" element={<DocumentsPage />} />

        {/* Templates page */}
        <Route path="/templates" element={<TemplatesPage />} />

        {/* Themes list */}
        <Route path="/themes" element={<ThemesPage />} />

        {/* Theme Editor */}
        <Route path="/theme-editor/new" element={<ThemeEditorPage />} />
        <Route path="/theme-editor/:id" element={<ThemeEditorPage />} />
        <Route path="/theme-editor" element={<Navigate to="/theme-editor/new" replace />} />

        {/* Document editor */}
        <Route
          path="/editor/:id"
          element={
            <Editor initialMode="split" showStylePanelByDefault={true} entityType="document" />
          }
        />
        <Route
          path="/editor"
          element={
            <Editor initialMode="split" showStylePanelByDefault={true} entityType="document" />
          }
        />

        {/* Template editor */}
        <Route
          path="/template/:id"
          element={
            <Editor initialMode="split" showStylePanelByDefault={true} entityType="template" />
          }
        />
        <Route
          path="/template/new"
          element={
            <Editor initialMode="split" showStylePanelByDefault={true} entityType="template" />
          }
        />

        {/* Preview mode - no editor, just preview */}
        <Route
          path="/preview"
          element={<Editor initialMode="preview" showStylePanelByDefault={false} />}
        />

        {/* Shared page - read-only preview with minimal header */}
        <Route path="/s/:pako" element={<PublishedPage />} />

        {/* Legacy share route redirect */}
        <Route path="/share/:pako" element={<PublishedPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
