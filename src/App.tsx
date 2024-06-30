import "./App.css";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import axios from "axios";
import styles from "./App.module.css";

import { StoriesState, Stories, Story } from "./definitions";

import { SearchForm } from "./SearchForm";
import { List } from "./List";
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const API_BASE = "https://hn.algolia.com/api/v1";
const API_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const getUrl = (searchTerm: string, page: number) =>
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const react = "React JS";

const welcome = {
  greeting: "Hello",
  title: react,
};

const getWord = (word: string) => word;

const extractSearchTerm = (url: string) =>
  url
    .substring(url.lastIndexOf("?") + 1, url.indexOf("&"))
    .replace(PARAM_SEARCH, "");

const useSemiPersistentState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const isMounted = useRef(false);

  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      console.log("A");
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data:
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
      };
    case "STORIES_FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => story.objectID !== action.payload.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const getSumComments = (stories: StoriesState) => {
  console.log("C");
  return stories.data.reduce((result, value) => result + value.num_comments, 0);
};

interface StoriesFetchInitAction {
  type: "STORIES_FETCH_INIT";
}
interface StoriesFetchSuccessAction {
  type: "STORIES_FETCH_SUCCESS";
  payload: {
    list: Stories;
    page: number;
  };
}

interface StoriesFetchFailureAction {
  type: "STORIES_FETCH_FAILURE";
}

interface StoriesRemoveAction {
  type: "REMOVE_STORY";
  payload: Story;
}

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    page: 0,
    isLoading: false,
    isError: false,
  });

  const [urls, setUrls] = useState([getUrl(searchTerm, 0)]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    handleSearch(searchTerm, 0);
    event.preventDefault();
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleLastSearch = (searhTerm: string) => {
    handleSearch(searhTerm, 0);
  };

  const handleSearch = (searchTerm: string, page: number) => {
    const url = getUrl(searchTerm, page);

    setUrls(urls.concat(url));
    setSearchTerm(searchTerm);
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };

  const getLastSearches = (urls: string[]) =>
    urls
      .reduce((result: string[], url, index) => {
        const currentSearchTerm = extractSearchTerm(url);

        if (index === 0) {
          return result.concat(currentSearchTerm);
        }

        const previousSearchTerm = result[result.length - 1];

        if (searchTerm === previousSearchTerm) {
          return result;
        } else {
          return result.concat(currentSearchTerm);
        }
      }, [])
      .slice(-6)
      .slice(0, -1);

  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [urls]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = useCallback((item: Story) => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
  }, []);

  console.log("B:App");

  const sumComments = useMemo(() => getSumComments(stories), [stories]);

  const lastSearches = getLastSearches(urls);

  return (
    <div className={styles.container}>
      <Greeting {...welcome} />
      <h1>My Hacker Stories with {sumComments} comments.</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        buttonStyle="button_large"
      />
      {lastSearches.map((searchTerm, index) => (
        <button
          className={`${styles.button} ${styles.buttonSmall}`}
          key={searchTerm + index}
          type="button"
          onClick={() => handleLastSearch(searchTerm)}
        >
          {searchTerm}
        </button>
      ))}

      {stories.isError && <p>Something went wrong ....</p>}
      {stories.isLoading ? (
        <p>Loading ... </p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <button
          className={`${styles.button} ${styles.buttonLarge}`}
          type="button"
          onClick={handleMore}
        >
          More
        </button>
      )}
    </div>
  );
};

/* ****************    Components     **************** */

const Greeting = ({ greeting, title }: { greeting: string; title: string }) => {
  return (
    <h1 className={styles.headlinePrimary}>
      {greeting}!! to the {getWord("World")} of {title}
    </h1>
  );
};

export default App;
