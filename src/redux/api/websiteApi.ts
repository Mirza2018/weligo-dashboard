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
        url: `/users/search-providers`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.provider],
    }),
    getAllFammilies: build.query<Response, void>({
      query: (params) => ({
        url: `/users/all-families`,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.family],
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
  useGetAllProvidersQuery,
  useGetAllFammiliesQuery,
} = websiteApi;
