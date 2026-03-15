// Manual mock for useStyleSidebar
export const useStyleSidebar = jest.fn(() => ({
  favoriteThemes: [
    {
      id: 'github-readme',
      name: 'GitHub Readme',
      description: 'GitHub-style readme',
      category: 'serif' as const,
      fontFamily: 'sans-serif',
      tailwindClasses: { body: 'bg-white', h1: 'text-gray-900', p: 'text-gray-700' },
      fontConfig: {},
      preview: { sampleHeading: 'Heading', sampleText: 'Text', style: 'default' as const },
      exampleContent: '# GitHub',
    },
  ],
  toggleFavorite: jest.fn(),
  isFavorite: jest.fn((id: string) => id === 'github-readme'),
  activeTab: 'themes' as const,
  setActiveTab: jest.fn(),
  searchQuery: '',
  setSearchQuery: jest.fn(),
  localThemes: [],
  saveTheme: jest.fn(),
  deleteLocalTheme: jest.fn(),
  filteredThemes: [],
}))
