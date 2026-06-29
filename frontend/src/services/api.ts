import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
}),


  tagTypes: ["Bookings"],

  endpoints: (builder) => ({

    // ✅ GET BOOKINGS
    getBookings: builder.query({
  query: (params) => ({
    url: "bookings/",
    params: params, 
  }),
  providesTags: ["Bookings"],
}),
    // ✅ GET ROOMS
    getRooms: builder.query({
      query: () => "rooms/",
    }),

    
// ✅ ✅ GET AVAILABILITY (NEW)
    getAvailability: builder.query({
      query: ({ start_time, end_time, required_capacity }) => ({
        url: "rooms/availability",
        params: {
          start_time,
          end_time,
          required_capacity,
        },
      }),
    }),


    // ✅ CREATE BOOKING
    createBooking: builder.mutation({
      query: (data) => ({
        url: "bookings/",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(api.util.invalidateTags(["Bookings"]));
      },
    }),

    // ✅ UPDATE BOOKING
    updateBooking: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `bookings/${id}/`,
        method: "PATCH",   
        body: data,
      }),

      invalidatesTags: ["Bookings"], 
    }),

    // ✅ DELETE BOOKING
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `bookings/${id}/`,
        method: "DELETE",
      }),

      invalidatesTags: ["Bookings"],
    }),

  }),
});

export const {
  useGetBookingsQuery,
  useGetRoomsQuery,
  useGetAvailabilityQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,   
  useDeleteBookingMutation,
} = api;