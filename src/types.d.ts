export interface State {
  breed: string;
  subBreeds: string[];
  subBreed: string;
  imagesCount: string;
}

export interface DogBreeds {
  [breed: string]: string[];
}
