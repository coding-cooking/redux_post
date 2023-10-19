import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "app/store"; 

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export type UserProps = {
	id: string;
	name: string,
	username: string,
	email: string,
	address: {
		street: string,
		suite: string,
		city: string,
		zipcode: string,
		geo: {
			lat: string,
			lng: string,
		}
	},
	phone: string,
	website: string,
	company: {
		name: string,
		catchPhrase: string,
		bs: string,
	}
};

const initialState: UserProps[] = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
	const response = await axios.get(USERS_URL);
	return response.data;
});

const userSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(fetchUsers.fulfilled, (state, action) => {
			return action.payload;
		});
	},
});

export const selectAllUsers = (state: RootState) => state.users;
export default userSlice.reducer;