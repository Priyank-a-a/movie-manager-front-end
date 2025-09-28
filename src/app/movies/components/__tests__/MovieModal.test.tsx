import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieModal, { MovieFormData } from '../MovieModal';

describe('MovieModal', () => {
  it('submits in add mode', () => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();
    render(
      <MovieModal isOpen onClose={onClose} onSubmit={onSubmit} mode="add" />
    );

    const title = screen.getByPlaceholderText('Title');
    const year = screen.getByPlaceholderText('Publishing year');
    fireEvent.change(title, { target: { name: 'title', value: 'New Movie' } });
    fireEvent.change(year, { target: { name: 'publishing_year', value: '2022' } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
    expect(onSubmit).toHaveBeenCalled();
    const payload = onSubmit.mock.calls[0][0] as MovieFormData;
    expect(payload.title).toBe('New Movie');
    expect(payload.publishing_year).toBe(2022);
  });

  it('pre-fills and submits in edit mode', () => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();
    render(
      <MovieModal
        isOpen
        onClose={onClose}
        onSubmit={onSubmit}
        mode="edit"
        initialData={{ id: '1', title: 'Old', publishing_year: 2010, poster: '' }}
      />
    );

    const title = screen.getByPlaceholderText('Title') as HTMLInputElement;
    expect(title.value).toBe('Old');

    fireEvent.change(title, { target: { name: 'title', value: 'Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(onSubmit).toHaveBeenCalled();
    const payload = onSubmit.mock.calls[0][0] as MovieFormData;
    expect(payload.title).toBe('Updated');
    expect(payload.publishing_year).toBe(2010);
  });
});
