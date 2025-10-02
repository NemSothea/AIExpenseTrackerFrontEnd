import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "http://localhost:8080";//import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");


// SignUP
export const userSignUP = createAsyncThunk(
  "userSignUp",
  async (credintials) => {
    try {
      const request = await axios.post(`${baseUrl}/auth/signup`, credintials);

      return request;
    } catch (error) {
      if (error.status === 403) {
        return { error: "User already exists!" };
      }
    }
  }
);

// SignIn

export const userLogin = createAsyncThunk(
  "userLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/login`, credentials);
      // If your backend returns { token: "..." }, this will be that object.
      // If it returns the raw token string, this will be the string.
      return res.data;
    } catch (error) {
      const status = error?.response?.status;
      const message =
        status === 403
          ? "Invalid user!"
          : error?.response?.data?.message || "Login failed";
      return rejectWithValue({ status, message });
    }
  }
);

// admin get all tours

export const adminTours = createAsyncThunk("adminTours", async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const response = await axios.get(`${baseUrl}/admin/tours`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});

//get admin tour by Id

export const fetchTourDetails = createAsyncThunk(
  "fetchTourDetails",
  async (tourId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await axios.get(`${baseUrl}/admin/tours/${tourId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// get admin all transport

export const adminTransport = createAsyncThunk("adminTransport", async () => {
  try {
    const token = localStorage.getItem('token');
    if(!token){
      return;
    }
    const response = axios.get(`${baseUrl}/admin/transports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});

// get admin all location

export const adminLocation = createAsyncThunk("adminLocation", async () => {
  try {
    const token = localStorage.getItem('token');
    if(!token){
      return;
    }
    const response = axios.get(`${baseUrl}/admin/locations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});
// get admin tour delete

export const deleteTour = createAsyncThunk("deleteTour", async (tourId) => {
  try {
    const token = localStorage.getItem('token');
    if(!token){
      return;
    }
    const response = axios.delete(`${baseUrl}/admin/tours/${tourId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});




// update location

export const editLocation = createAsyncThunk(
  "editLocation",
  async ({ locationId, updatedLocation }) => {
    const token = localStorage.getItem("token");
    if(!token){
      return;
    }
    const response = await axios.put(
      `${baseUrl}/admin/locations/${locationId}`,
      updatedLocation,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }
);



// user section-----

// user get all tours

export const userTours = createAsyncThunk("userTours", async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const response = await axios.get(`${baseUrl}/customer/tours`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
});

// get user tour by ID
export const UserTourDetail = createAsyncThunk(
  "UserTourDetails",
  async (tourId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await axios.get(`${baseUrl}/customer/tours/${tourId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// user confirm booking
export const confirmBooking = createAsyncThunk(
  "confirmBooking",
  async ({ bookingId,paymentIntentId}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/customer/confirm-payment/${bookingId}?paymentIntentId=${paymentIntentId}`,
    {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
