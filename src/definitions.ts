import { ChangeEvent, ReactNode } from "react";

type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isFocused: boolean;
  children: ReactNode;
};

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

type StoriesState = {
  data: Stories;
  page: number;
  isLoading: boolean;
  isError: boolean;
};

type Stories = Array<Story>;
type ListProps = {
  list: Stories;
  onRemoveItem: (Item: Story) => void;
};

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  buttonStyle: string;
};

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

export type {
  InputWithLabelProps,
  ItemProps,
  StoriesState,
  Stories,
  ListProps,
  SearchFormProps,
  Story,
};
