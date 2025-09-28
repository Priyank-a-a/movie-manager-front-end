import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Movies"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001", // NestJS backend
    prepareHeaders: (headers, { getState }) => {
      // Prefer cookie token (browser only); fallback to Redux state
      const cookieToken =
        typeof window !== "undefined" ? Cookies.get("token") : undefined;
      const stateToken = (getState() as any).auth?.token as string | undefined;
      const token = cookieToken ?? stateToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Movies
    getMovies: builder.query<any[], void>({
      query: () => "/movies",
      providesTags: (result) =>
        result
          ? [
              ...result.map((m: any) => ({ type: "Movies" as const, id: m.id })),
              { type: "Movies" as const, id: "LIST" },
            ]
          : [{ type: "Movies" as const, id: "LIST" }],
    }),

    createMovie: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/movies",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Movies", id: "LIST" }],
    }),

    updateMovie: builder.mutation<any, { id: string | number; data: Partial<any> }>(
      {
        query: ({ id, data }) => ({
          url: `/movies/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "Movies", id: arg.id },
          { type: "Movies", id: "LIST" },
        ],
      }
    ),

    deleteMovie: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/movies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Movies", id },
        { type: "Movies", id: "LIST" },
      ],
    }),

    // Auth
    login: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useLoginMutation,
} = api;
