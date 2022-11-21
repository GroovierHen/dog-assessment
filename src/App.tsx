import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// @Mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import {
  RootState,
  useGetAllBreedsQuery,
  useGetImagesQuery,
  setBreed,
  setSubBreeds,
  setSubBreed,
  setImagesCount,
} from './store';

const Images = ({ url }: { url: string }) => {
  const { data } = useGetImagesQuery(url, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  if (data) {
    return (
      <ImageList variant="masonry" cols={3} gap={8}>
        {data.map((image) => (
          <ImageListItem key={image}>
            <img src={image} srcSet={image} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    );
  }

  return null;
};

const App = () => {
  const { data: breeds } = useGetAllBreedsQuery('');
  const { breed, subBreeds, subBreed, imagesCount } = useSelector(
    (state: RootState) => state.state
  );
  const dispatch = useDispatch();
  const [url, setUrl] = React.useState<string>('');

  const handleBreedChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!breeds) return;

      dispatch(setBreed(event.target.value));
      dispatch(setSubBreeds(breeds[event.target.value]));
      dispatch(setSubBreed(''));
      dispatch(setImagesCount(''));
    },
    [breeds, dispatch]
  );

  const handleSubBreedChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSubBreed(event.target.value));
      dispatch(setImagesCount(''));
    },
    [dispatch]
  );

  const handleImagesCount = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!breed) return;

      if (subBreeds.length > 0) {
        if (!subBreed) return;
      }

      dispatch(setImagesCount(event.target.value));
    },
    [breed, dispatch, subBreed, subBreeds.length]
  );

  const handleImages = React.useCallback(() => {
    if (!breed) return;

    let url = `${breed}`;

    if (subBreeds.length > 0) {
      if (!subBreed) return;

      url = `${url}/${subBreed}`;
    }

    if (!imagesCount) return;

    url = `${url}/images/random/${imagesCount}`;

    setUrl(url);
  }, [breed, imagesCount, subBreed, subBreeds.length]);

  return (
    <Box my={10}>
      <Stack direction="row" spacing={2}>
        {breeds && (
          <TextField
            select
            fullWidth
            label="Select Breed"
            value={breed}
            onChange={handleBreedChange}
          >
            {Object.keys(breeds).map((breed) => (
              <MenuItem key={breed} value={breed}>
                {breed}
              </MenuItem>
            ))}
          </TextField>
        )}
        {subBreeds.length > 0 && (
          <TextField
            select
            fullWidth
            label="Select Sub Breed"
            value={subBreed}
            onChange={handleSubBreedChange}
          >
            {subBreeds.map((subBreed) => (
              <MenuItem key={subBreed} value={subBreed}>
                {subBreed}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          fullWidth
          label="How many Images?"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={imagesCount}
          onChange={handleImagesCount}
        />
        <Button fullWidth variant="contained" onClick={handleImages}>
          Get Images
        </Button>
      </Stack>
      {url && <Images url={url} />}
    </Box>
  );
};

export default App;
