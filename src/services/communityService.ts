import type {
	Post,
	CreatePostData,
	CreatePostRequest,
	PaginationParams,
	PaginationInfo,
	PostDetail,
	CreateCommentData,
	GetCommentsParams,
	CommentsResponse,
	CreateCommentResponse,
} from "../types/community";
import api from "@/lib/api";
import { getStorageItem } from "@/utils";
import { AUTH_CONFIG } from "@/constants";

export const communityService = {
	// Lấy tất cả posts với pagination và filters
	getPosts: async (params?: {
		page?: number;
		limit?: number;
		hashtags?: string[];
		search?: string;
		sortBy?: string;
		sortOrder?: "asc" | "desc";
	}) => {
		try {
			// Build query params
			const queryParams = new URLSearchParams({
				page: String(params?.page || 1),
				limit: String(params?.limit || 10),
				sortBy: params?.sortBy || "createdAt",
				sortOrder: params?.sortOrder || "desc",
			});

			// Add hashtags if provided
			if (params?.hashtags && params.hashtags.length > 0) {
				params.hashtags.forEach((tag) => {
					queryParams.append("hashtags", tag);
				});
			}

			// Add search if provided
			if (params?.search) {
				queryParams.set("search", params.search);
			}

			const response = await api.get(`/posts?${queryParams.toString()}`);
			console.log(response);

			// Handle different response structures
			const responseData = response.data.data || response.data;
			let posts = [];
			let pagination = {
				page: params?.page || 1,
				limit: params?.limit || 10,
				total: 0,
				pages: 0,
			};

			// Check if response has posts field
			if (responseData.posts && Array.isArray(responseData.posts)) {
				posts = responseData.posts;
				pagination = responseData.pagination || pagination;
			} else if (Array.isArray(responseData)) {
				// Direct array of posts
				posts = responseData;
			}

			// Map has_liked to is_liked for consistency
			posts = posts.map((post: any) => ({
				...post,
				is_liked:
					post.has_liked !== undefined
						? post.has_liked
						: post.is_liked,
			}));

			return {
				posts,
				pagination,
			};
		} catch (error) {
			console.error("Error fetching posts:", error);
			// Return empty result instead of throwing
			return {
				posts: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					pages: 0,
				},
			};
		}
	},

	// Toggle like cho post - Call API thực
	toggleLike: async (
		postId: string,
		isLiked: boolean,
	): Promise<{ post_id: string; likes_count: number }> => {
		try {
			if (isLiked) {
				// Unlike: DELETE request
				const response = await api.delete(`/posts/${postId}/like`, {});
				return response.data.data;
			} else {
				// Like: POST request
				const response = await api.post(`/posts/${postId}/like`, {});
				return response.data.data;
			}
		} catch (error) {
			console.error("Error toggling like:", error);
			throw error;
		}
	},

	// Lấy posts của user với pagination
	getUserPosts: async (
		userId?: string,
		params?: PaginationParams,
	): Promise<{ posts: Post[]; pagination: PaginationInfo }> => {
		try {
			// Get current user if userId not provided
			if (!userId) {
				const user = getStorageItem(AUTH_CONFIG.USER_STORAGE_KEY);
				userId = user?._id || user?.id;
			}

			if (!userId) {
				throw new Error("User ID not found");
			}

			// Build query params
			const queryParams = new URLSearchParams({
				page: String(params?.page || 1),
				limit: String(params?.limit || 1),
				sortBy: params?.sortBy || "createdAt",
				sortOrder: params?.sortOrder || "desc",
			});

			const response = await api.get(
				`/posts/user/${userId}?${queryParams.toString()}`,
			);

			// Map has_liked to is_liked for consistency
			const posts = response.data.data.posts.map((post: any) => ({
				...post,
				is_liked:
					post.has_liked !== undefined
						? post.has_liked
						: post.is_liked,
			}));

			// Return API response with mapped posts
			return {
				posts,
				pagination: response.data.data.pagination,
			};
		} catch (error) {
			console.error("Error fetching user posts:", error);
			throw error;
		}
	},

	// Tạo post mới - Call API thực
	createPost: async (postData: CreatePostData): Promise<Post> => {
		try {
			// Prepare API request payload
			const requestPayload: CreatePostRequest = {
				text: postData.text,
				foods: postData.foods,
				visibility: postData.visibility || "public",
			};

			const response = await api.post("/posts", requestPayload);

			// Return API response directly
			const newPost: Post = response.data.data;

			console.log(newPost);

			return newPost;
		} catch (error) {
			console.error("Error creating post:", error);
			throw error;
		}
	},

	// Lấy chi tiết post theo ID - Call API thực
	getPostDetailById: async (postId: string): Promise<PostDetail> => {
		try {
			const response = await api.get(`/posts/${postId}`);
			console.log("Full response:", response);
			console.log("Response data:", response.data);

			// Check if response has nested data structure
			let postDetail = response.data.data || response.data;

			// Map has_liked to is_liked for consistency
			postDetail = {
				...postDetail,
				is_liked:
					postDetail.has_liked !== undefined
						? postDetail.has_liked
						: postDetail.is_liked,
			};

			return postDetail;
		} catch (error) {
			console.error("Error fetching post detail:", error);
			throw error;
		}
	},

	// Lấy comments của post - Call API thực
	getComments: async (
		postId: string,
		params?: GetCommentsParams,
	): Promise<CommentsResponse> => {
		try {
			// Build query params
			const queryParams = new URLSearchParams({
				page: String(params?.page || 1),
				limit: String(params?.limit || 10),
				sortBy: params?.sortBy || "createdAt",
				order: params?.order || "asc",
			});

			const response = await api.get(
				`/comments/post/${postId}?${queryParams.toString()}`,
			);
			console.log(response.data);

			return response.data;
		} catch (error) {
			console.error("Error fetching comments:", error);
			throw error;
		}
	},

	// Thêm comment mới - Call API thực
	createComment: async (
		commentData: CreateCommentData,
	): Promise<CreateCommentResponse> => {
		try {
			const response = await api.post("/comments", commentData);
			return response.data;
		} catch (error) {
			console.error("Error creating comment:", error);
			throw error;
		}
	},
};
