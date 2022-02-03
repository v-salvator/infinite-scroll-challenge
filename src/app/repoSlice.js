import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Octokit } from "@octokit/core";

const octokit = new Octokit();

const fetchRepoBySearchText = createAsyncThunk(
  "repo/fetchRepoBySearchText",
  async ({ searchText, refresh }, thunkAPI) => {
    const state = thunkAPI.getState();
    const { currentPage, sizePerPage } = state.repo;
    const queryString = "q=" + encodeURIComponent(`${searchText}`);
    try {
      const response = await octokit.request("GET /search/repositories", {
        q: queryString,
        per_page: sizePerPage,
        page: refresh ? 0 : currentPage,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const repoSlice = createSlice({
  name: "repo",
  initialState: {
    repos: [],
    totalCount: 0,
    currentPage: 1,
    sizePerPage: 10,
    isLoading: false,
    isLastPage: false,
  },
  extraReducers: {
    [fetchRepoBySearchText.pending]: (state, action) => {
      state.isLoading = true;
      const { refresh } = action.meta.arg;
      if (refresh) {
        state.currentPage = 1;
        state.totalCount = 0;
        state.repos = [];
      }
    },
    [fetchRepoBySearchText.fulfilled]: (state, action) => {
      state.totalCount = action.payload.total_count;
      state.repos.push(...action.payload.items);
      state.isLoading = false;
      state.isLastPage = state.repos.length === state.totalCount;
    },
    [fetchRepoBySearchText.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
  reducers: {
    getNextPage: (state) => {
      state.currentPage += 1;
    },
    reset: (state) => {
      state.currentPage = 1;
      state.totalCount = 0;
      state.repos = [];
      state.isLastPage = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getNextPage, reset } = repoSlice.actions;
export { fetchRepoBySearchText };

export default repoSlice.reducer;
