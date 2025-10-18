import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseUrl = "http://localhost:8080";//import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
let userId = null;


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

// Dashboard: GET /api/dashboard with query params + Authorization header
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  async ({ userId, start, end, topLimit = 5, recentLimit = 10 }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const finalUserId = userId ?? getUserIdFromToken();

    // ENHANCED DEBUG LOGS
    console.log("=== DEBUG fetchDashboard ===");
    console.log("Token from localStorage:", token);
    console.log("Token exists:", !!token);
    console.log("UserID from props:", userId);
    console.log("UserID from token:", getUserIdFromToken());
    console.log("Final UserID being used:", finalUserId);
    console.log("Params:", { start, end, topLimit, recentLimit });

    if (!token) {
      console.error("❌ No token found");
      return rejectWithValue({ status: 401, message: "Missing token" });
    }
    if (!finalUserId) {
      console.error("❌ No user ID found");
      return rejectWithValue({
        status: 400,
        message: "Missing userId (token has no userId or sub).",
      });
    }

    try {
      console.log("🔄 Making API request...");
      const res = await axios.get(`${baseUrl}/api/dashboard`, {
        params: { userId: finalUserId, start, end, topLimit, recentLimit },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ API response:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ API error details:");
      console.error("Status:", error?.response?.status);
      console.error("Data:", error?.response?.data);
      console.error("Headers:", error?.response?.headers);
      console.error("Full error:", error);
      
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Failed to load dashboard";
      return rejectWithValue({ status, message });
    }
  }
);

// --- CREATE EXPENSE ---
export const createExpense = createAsyncThunk(
  "expenses/create",
  async ({ categoryId, amount, description, expenseDate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();
      const res = await axios.post(
        `${baseUrl}/api/create-expenses`,
        { userId, categoryId, amount, description, expenseDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data; // backend may return the created object
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Failed to create expense";
      return rejectWithValue({ status, message });
    }
  }
);
// --- UPDATE EXPENSE ---
export const updateExpense = createAsyncThunk(
  "expenses/update",
  async ({ expenseId, userId, categoryId, amount, description, expenseDate }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Updating expense with data:", { expenseId, userId, categoryId, amount, description, expenseDate });
      
      const res = await axios.patch(
        `${baseUrl}/api/create-expenses/${expenseId}`,
        { 
          userId, 
          categoryId, 
          amount: Number(amount), 
          description, 
          expenseDate,
          enabled: true 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      console.log("✅ Expense updated successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Update expense error:", error);
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Failed to update expense";
      return rejectWithValue({ status, message });
    }
  }
);

// --- CATEGORIES (active) ---
export const fetchCategories = createAsyncThunk(
  "categories/active",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/api/categories/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // expect array like [{id, name, ...}]
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Failed to load categories";
      return rejectWithValue({ status, message });
    }
  }
);

function getUserIdFromToken() {
  // First try to get from stored user data
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.id) {
        return user.id; // This returns the numeric ID (1)
      }
    } catch (e) {
      console.error("Failed to parse user data:", e);
    }
  }
  
  // Fallback to token decoding
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    console.log("🔍 Decoded token fields:", Object.keys(decoded));
    
    // The token has sub="sothea@example.com" but no userId
    return decoded.userId || decoded.id || decoded.sub;
  } catch (error) {
    console.error("❌ JWT decode failed:", error);
    return null;
  }
}