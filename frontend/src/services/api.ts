import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/",
  }),

  tagTypes: ["Bookings"],

  endpoints: (builder) => ({

    // ✅ GET BOOKINGS
    getBookings: builder.query({
  query: (params) => ({
    url: "bookings/",
    params: params, // ✅ THIS IS THE KEY FIX
  }),
  providesTags: ["Bookings"],
}),
    // ✅ GET ROOMS
    getRooms: builder.query({
      query: () => "rooms/",
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

    // ✅ ✅ ✅ UPDATE BOOKING (THIS IS CORRECT)
    updateBooking: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `bookings/${id}/`,
        method: "PATCH",   // ✅ correct for partial update
        body: data,
      }),

      invalidatesTags: ["Bookings"], // ✅ auto refresh
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
  useCreateBookingMutation,
  useUpdateBookingMutation,   // ✅ used in BookingForm
  useDeleteBookingMutation,
} = api;