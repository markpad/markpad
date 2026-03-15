export const documentRepository = {
  create: jest.fn().mockResolvedValue({
    id: 'new-doc-id',
    title: 'Test Document',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    starred: false,
    trashedAt: null,
  }),
  getById: jest.fn().mockResolvedValue(null),
  getAll: jest.fn().mockResolvedValue([]),
  update: jest.fn().mockResolvedValue(null),
  delete: jest.fn().mockResolvedValue(undefined),
}

export const templateRepository = {
  create: jest.fn().mockResolvedValue({
    id: 'new-template-id',
    title: 'Test Template',
    description: '',
    content: '',
    isSystem: false,
    version: 1,
    themeId: null,
    category: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getById: jest.fn().mockResolvedValue(null),
  getAll: jest.fn().mockResolvedValue([]),
  update: jest.fn().mockResolvedValue(null),
  delete: jest.fn().mockResolvedValue(undefined),
  seedSystemTemplates: jest.fn().mockResolvedValue(undefined),
}

export const customThemeRepository = {
  create: jest.fn().mockResolvedValue({
    id: 'new-theme-id',
    name: 'Test Theme',
    description: '',
    styles: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getById: jest.fn().mockResolvedValue(null),
  getAll: jest.fn().mockResolvedValue([]),
  update: jest.fn().mockResolvedValue(null),
  delete: jest.fn().mockResolvedValue(undefined),
}
