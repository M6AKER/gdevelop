// @flow
import * as React from 'react';
import { type FiltersState, useFilters } from '../../UI/Search/FiltersChooser';
import {
  type ExampleShortHeader,
  type AllExamples,
  listAllExamples,
} from '../../Utils/GDevelopServices/Example';
import { type Filters } from '../../Utils/GDevelopServices/Filters';
import { useSearchItem } from '../../UI/Search/UseSearchItem';

const defaultSearchText = '';

type ExampleStoreState = {|
  filters: ?Filters,
  searchResults: ?Array<ExampleShortHeader>,
  fetchExamplesAndFilters: () => void,
  error: ?Error,
  searchText: string,
  setSearchText: string => void,
  filtersState: FiltersState,
|};

export const ExampleStoreContext = React.createContext<ExampleStoreState>({
  filters: null,
  searchResults: null,
  fetchExamplesAndFilters: () => {},
  error: null,
  searchText: '',
  setSearchText: () => {},
  filtersState: {
    chosenFilters: new Set(),
    addFilter: () => {},
    removeFilter: () => {},
    chosenCategory: null,
    setChosenCategory: () => {},
  },
});

type ExampleStoreStateProviderProps = {|
  children: React.Node,
|};

const getExampleSearchTerms = (example: ExampleShortHeader) => {
  return (
    example.name +
    '\n' +
    example.shortDescription +
    '\n' +
    example.tags.join(',')
  );
};

export const ExampleStoreStateProvider = ({
  children,
}: ExampleStoreStateProviderProps) => {
  const [
    exampleShortHeadersById,
    setExampleShortHeadersById,
  ] = React.useState<?{
    [string]: ExampleShortHeader,
  }>(null);
  const [filters, setFilters] = React.useState<?Filters>(null);
  const [error, setError] = React.useState<?Error>(null);
  const isLoading = React.useRef<boolean>(false);

  const [searchText, setSearchText] = React.useState(defaultSearchText);
  const filtersState = useFilters();

  const fetchExamplesAndFilters = React.useCallback(
    () => {
      // Don't attempt to load again resources and filters if they
      // were loaded already.
      if (exampleShortHeadersById || isLoading.current) return;

      (async () => {
        setError(null);
        isLoading.current = true;

        try {
          const allExamples: AllExamples = await listAllExamples();
          const { exampleShortHeaders, filters } = allExamples;

          const exampleShortHeadersById = {};
          exampleShortHeaders.forEach(exampleShortHeader => {
            exampleShortHeadersById[exampleShortHeader.id] = exampleShortHeader;
          });

          console.info(
            `Loaded ${
              exampleShortHeaders.length
            } examples from the example store.`
          );
          setExampleShortHeadersById(exampleShortHeadersById);
          setFilters(filters);
        } catch (error) {
          console.error(
            `Unable to load the examples from the example store:`,
            error
          );
          setError(error);
        }

        isLoading.current = false;
      })();
    },
    [exampleShortHeadersById, isLoading]
  );

  React.useEffect(
    () => {
      // Don't attempt to load again extensions and filters if they
      // were loaded already.
      if (exampleShortHeadersById || isLoading.current) return;

      const timeoutId = setTimeout(() => {
        console.info('Pre-fetching examples from the example store...');
        fetchExamplesAndFilters();
      }, 5000);
      return () => clearTimeout(timeoutId);
    },
    [fetchExamplesAndFilters, exampleShortHeadersById, isLoading]
  );

  const { chosenCategory, chosenFilters } = filtersState;
  const searchResults: ?Array<ExampleShortHeader> = useSearchItem(
    exampleShortHeadersById,
    getExampleSearchTerms,
    searchText,
    chosenCategory,
    chosenFilters
  );

  const extensionStoreState = React.useMemo(
    () => ({
      searchResults,
      fetchExamplesAndFilters,
      filters,
      error,
      searchText,
      setSearchText,
      filtersState,
    }),
    [
      searchResults,
      error,
      filters,
      searchText,
      filtersState,
      fetchExamplesAndFilters,
    ]
  );

  return (
    <ExampleStoreContext.Provider value={extensionStoreState}>
      {children}
    </ExampleStoreContext.Provider>
  );
};
