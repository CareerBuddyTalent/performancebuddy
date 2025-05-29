
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'employee' as const
}

export const mockAdminUser = {
  id: 'admin-user-id',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const
}

export const mockManagerUser = {
  id: 'manager-user-id',
  email: 'manager@example.com',
  name: 'Manager User',
  role: 'manager' as const
}

export const createMockAuthContext = (user = mockUser, isAuthenticated = true) => ({
  user: isAuthenticated ? user : null,
  isAuthenticated,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  signUp: vi.fn(),
})

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
}
