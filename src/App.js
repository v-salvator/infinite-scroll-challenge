import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSetState, useUpdateEffect } from "react-use";

import { fetchRepoBySearchText, reset } from "./app/repoSlice";
import { RepoCell, EndMarker } from "./components";

const TYPING_SEARCH_DELAY = 1200; // ms

function App() {
  const [state, setState] = useSetState({
    hasScrolled: false,
    searchText: "",
  });

  const dispatch = useDispatch();

  const type2SearchRequestRef = useRef(null);

  const repoState = useSelector((state) => state.repo);

  const { repos, totalCount, currentPage } = repoState;

  console.log("repos", repos);

  useEffect(() => {
    dispatch(fetchRepoBySearchText({ searchText: state.searchText }));
  }, [currentPage]);

  useUpdateEffect(() => {
    // clear previous search!!!!
    if (type2SearchRequestRef.current) {
      clearTimeout(type2SearchRequestRef.current);
    }
    // prepare to fire current type search
    type2SearchRequestRef.current = setTimeout(() => {
      if (currentPage === 1) {
        // manually dispatch fetchRepoBySearchText
        dispatch(
          fetchRepoBySearchText({ searchText: state.searchText, refresh: true })
        );
      } else {
        // reset page to 1 useEffeft will dispatch fetchRepoBySearchText
        dispatch(reset());
      }
    }, TYPING_SEARCH_DELAY);
  }, [state.searchText]);

  const onSearchChange = (e) => {
    setState({
      searchText: e.target.value,
      hasScrolled: false,
    });
  };

  const onScroll = () => {
    if (!state.hasScrolled) {
      setState({ hasScrolled: true });
    }
  };

  return (
    <div className="app" onScroll={onScroll}>
      <div className="app__search-container">
        <span>Search Text : </span>
        <input type="text" onChange={onSearchChange} />
      </div>
      <div>
        {repos.map((repo, index) => {
          return <RepoCell key={index} repo={repo}></RepoCell>;
        })}
        <EndMarker disable={!state.hasScrolled}>hehe</EndMarker>
      </div>
    </div>
  );
}

export default App;
