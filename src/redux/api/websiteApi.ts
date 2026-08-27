import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

// interface Filter {
//   page?: number;
//   limit?: number;
//   search?: string;
// }
interface Response {
  data: any | void;
}

export const websiteApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // userLogin: build.mutation({
    //   query: (body) => ({
    //     url: `/auth/login`,
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: [tagTypes.user],
    // }),

    getOverview: build.query<Response, void>({
      query: (params) => ({
        url: `/admin/overview`,
        method: "GET",
        params,
      }),
      // providesTags: [tagTypes.user],
    }),

    getBookingStatistics: build.query<Response, void>({
      query: (params) => ({
        url: `/admin/overview/bookings`,
        method: "GET",
        params,
      }),
      // providesTags: [tagTypes.user],
    }),

    getEarningsStatistics: build.query<Response, void>({
      query: (params) => ({
        url: `/admin/overview/earnings`,
        method: "GET",
        params,
      }),
      // providesTags: [tagTypes.user],
    }),
    getTopProviders: build.query<Response, void>({
      query: (params) => ({
        url: `/users/top-rated-providers`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.provider],
    }),

    userBlockUnBlock: build.mutation({
      query: (id) => ({
        url: `/users/block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.provider, tagTypes.family],
    }),

    getAllProviders: build.query<Response, void>({
      query: (params) => ({
        url: `/users/all-providers`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.provider],
    }),

    getPendingProviders: build.query<Response, void>({
      query: (params) => ({
        url: `/users/pending-providers`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.provider],
    }),
    approveProvider: build.mutation({
      query: (id) => ({
        url: `/users/approve-provider/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.provider],
    }),
    rejectProvider: build.mutation({
      query: (id) => ({
        url: `/users/reject-provider/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.provider],
    }),

    getAllFammilies: build.query<Response, void>({
      query: (params) => ({
        url: `/users/all-families`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.family],
    }),
    ////
    getAllBookings: build.query<Response, void>({
      query: (params) => ({
        url: `/bookings`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.booking],
    }),

    ///
    getAllCategories: build.query<Response, void>({
      query: (params) => ({
        url: `/categories`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.categories],
    }),

    createCategory: build.mutation({
      query: (body) => ({
        url: `/categories/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.categories],
    }),
    updateCategory: build.mutation({
      query: (body) => ({
        url: `/categories/${body.id}`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.categories],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.categories],
    }),
    ///
    getAllTickets: build.query<Response, void>({
      query: (params) => ({
        url: `/support/all-tickets`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.tickets],
    }),
    updateTicket: build.mutation({
      query: (body) => ({
        url: `/support/${body.id}/status`,
        method: "PATCH",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.tickets],
    }),
    replyTicket: build.mutation({
      query: (body) => ({
        url: `/support/${body.id}/messages`,
        method: "POST",
        body: body.data,
      }),
      invalidatesTags: [tagTypes.tickets],
    }),
    ///Earnings

    getAllEarnings: build.query<Response, void>({
      query: (params) => ({
        url: `/bookings/earnings`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.earnings],
    }),

    ///Transactions
    getAllTransactions: build.query<Response, void>({
      query: (params) => ({
        url: `/payments`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.earnings],
    }),

    //End
  }),
});

export const {
  useGetOverviewQuery,
  useGetBookingStatisticsQuery,
  useGetEarningsStatisticsQuery,
  useGetTopProvidersQuery,
  //
  useUserBlockUnBlockMutation,
  useGetAllFammiliesQuery,
  //
  useGetAllProvidersQuery,
  useGetPendingProvidersQuery,
  useApproveProviderMutation,
  useRejectProviderMutation,
  ///
  useGetAllBookingsQuery,
  //categories
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  //
  useGetAllTicketsQuery,
  useUpdateTicketMutation,
  useReplyTicketMutation,
  ///

  useGetAllEarningsQuery,
  ///
  useGetAllTransactionsQuery
} = websiteApi;
