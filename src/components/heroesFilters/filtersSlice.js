import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter();
const initialState = filtersAdapter.getInitialState({filtersLoadingStatus: 'idle',activeFilter: 'all'})

export const fetchingFilters = createAsyncThunk(
    'filters/fetchingFilters',
    () => {
        const {request} = useHttp();
        return request("http://localhost:3001/filters");
    }
)

const filtersSlice = createSlice ({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchingFilters.pending, state => {state.filtersLoadingStatus = 'loading';})
            .addCase(fetchingFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload)
            })
            .addCase(fetchingFilters.rejected, state => {state.filtersLoadingStatus = 'error';})
    }
})

const { actions, reducer } = filtersSlice;

export default reducer;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters)

export const {
    activeFilterChanged
} = actions;