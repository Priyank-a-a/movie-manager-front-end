import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MoviesPage from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/services/api', () => ({
  useGetMoviesQuery: jest.fn(),
  useCreateMovieMutation: () => [jest.fn(), { isLoading: false }],
  useUpdateMovieMutation: () => [jest.fn(), { isLoading: false }],
  useDeleteMovieMutation: () => [jest.fn().mockResolvedValue({ unwrap: async () => ({}) }), { isLoading: false }],
  useUploadPosterMutation: () => [jest.fn(), { isLoading: false }],
}));

const api = jest.requireMock('@/services/api');

describe('MoviesPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders loading before mount', () => {
    api.useGetMoviesQuery.mockReturnValue({ data: [], isLoading: true, error: undefined });
    render(<MoviesPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty state', async () => {
    api.useGetMoviesQuery.mockReturnValue({ data: [], isLoading: false, error: undefined });
    render(<MoviesPage />);
    await waitFor(() => {
      expect(screen.getByText(/Your movie list is empty/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add a new movie/i })).toBeInTheDocument();
    });
  });

  it('renders movies and allows delete', async () => {
    api.useGetMoviesQuery.mockReturnValue({
      data: [
        { id: 1, title: 'A', publishing_year: 2020, poster: '' },
        { id: 2, title: 'B', publishing_year: 2021, poster: '' },
      ],
      isLoading: false,
      error: undefined,
    });
    const mockDelete = jest.fn(() => ({ unwrap: async () => ({}) }));
    api.useDeleteMovieMutation.mockReturnValue([mockDelete, { isLoading: false }]);

    render(<MoviesPage />);

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
