import type { PayloadAction } from '@reduxjs/toolkit';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import {
  createApi,
  fetchBaseQuery,
  setupListeners,
} from '@reduxjs/toolkit/query/react';

import { State, DogBreeds } from './types';

const initialState: State = {
  breed: '',
  subBreeds: [],
  subBreed: '',
  imagesCount: '',
};

const state = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setBreed: (state, action: PayloadAction<string>) => {
      state.breed = action.payload;
    },
    setSubBreeds: (state, action: PayloadAction<string[]>) => {
      state.subBreeds = action.payload;
    },
    setSubBreed: (state, action: PayloadAction<string>) => {
      state.subBreed = action.payload;
    },
    setImagesCount: (state, action: PayloadAction<string>) => {
      state.imagesCount = action.payload;
    },
  },
});

const dogApi = createApi({
  reducerPath: 'dogApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dog.ceo/api/' }),
  tagTypes: ['Breeds', 'Images'],
  endpoints: (builder) => ({
    getAllBreeds: builder.query<DogBreeds, string>({
      query: () => 'breeds/list/all',
      transformResponse: (response: { message: DogBreeds }) => response.message,
    }),
    getImages: builder.query<string[], string>({
      query: (url) => `breed/${url}`,
      transformResponse: (response: { message: string[] }) => response.message,
    }),
  }),
});

export const store = configureStore({
  reducer: {
    state: state.reducer,
    [dogApi.reducerPath]: dogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(dogApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const { setBreed, setSubBreeds, setSubBreed, setImagesCount } =
  state.actions;
export const { useGetAllBreedsQuery, useGetImagesQuery } = dogApi;
