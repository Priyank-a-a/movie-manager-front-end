export type MovieDTO = {
  id: number | string;
  title: string;
  publishing_year?: number;
  publishingYear?: number;
  poster?: string | null;
};

export type UIMovie = {
  id: string;
  title: string;
  publishingYear: number;
  poster: string;
};
