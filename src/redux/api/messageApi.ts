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

export const messageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createChat: build.mutation({
      query: (body) => {
        return {
          url: `/chat/create`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [tagTypes.chat],
    }),

    getChatList: build.query({
      query: (params) => {
        return {
          url: `/chat/my-chat-list`,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.chat],
    }),
    getSingleChat: build.query({
      query: (id) => {
        return {
          url: `/message/${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.chat],
    }),
    uploadFile: build.mutation({
      query: (body) => {
        return {
          url: `/message/file-upload`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [tagTypes.chat],
    }),

    getCalls: build.query({
      query: (params) => {
        return {
          url: `/calls/my-calls`,
          method: "GET",
          params,
        };
      },
      providesTags: [tagTypes.chat],
    }),

    //End
  }),
});

export const {
  useCreateChatMutation,
  useGetChatListQuery,
  useGetSingleChatQuery,
  useUploadFileMutation,
  useGetCallsQuery,
} = messageApi;
