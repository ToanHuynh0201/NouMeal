import type {
	Post,
	ReactionType,
	CreatePostData,
	CreatePostRequest,
	PaginationParams,
	PaginationInfo,
	PostDetail,
} from "../types/community";
import api from "@/lib/api";
import { getStorageItem } from "@/utils";
import { AUTH_CONFIG } from "@/constants";

// Mock data cho demo
const mockPosts: Post[] = [
	{
		_id: "1",
		author: {
			_id: "user1",
			name: "Nguyễn Văn A",
			avatar: "https://i.pravatar.cc/150?img=1",
		},
		text: "Chia sẻ công thức nấu phở bò Hà Nội đúng chuẩn, thơm ngon như hàng quán.",
		foods: [],
		engagement: {
			likes_count: 45,
			comments_count: 1,
			shares_count: 0,
		},
		visibility: "public",
		hashtags: ["phở", "món việt", "món chính"],
		is_edited: false,
		createdAt: "2025-11-04T10:30:00Z",
		updatedAt: "2025-11-04T10:30:00Z",
	},
	{
		_id: "2",
		author: {
			_id: "user2",
			name: "Trần Thị B",
			avatar: "https://i.pravatar.cc/150?img=5",
		},
		text: "Thực đơn eat clean giúp giảm cân hiệu quả mà vẫn đầy đủ dinh dưỡng.",
		foods: [],
		engagement: {
			likes_count: 89,
			comments_count: 0,
			shares_count: 0,
		},
		visibility: "public",
		hashtags: ["giảm cân", "eat clean", "healthy", "thực đơn"],
		is_edited: false,
		createdAt: "2025-11-03T15:20:00Z",
		updatedAt: "2025-11-03T15:20:00Z",
	},
	{
		_id: "3",
		author: {
			_id: "user3",
			name: "Lê Văn C",
			avatar: "https://i.pravatar.cc/150?img=12",
		},
		text: "Hướng dẫn làm bánh mì thịt nguội tại nhà, đơn giản mà ngon không kém ngoài hàng.",
		foods: [],
		engagement: {
			likes_count: 56,
			comments_count: 0,
			shares_count: 0,
		},
		visibility: "public",
		hashtags: ["bánh mì", "món việt", "ăn sáng"],
		is_edited: false,
		createdAt: "2025-11-02T08:15:00Z",
		updatedAt: "2025-11-02T08:15:00Z",
	},
	{
		_id: "4",
		author: {
			_id: "user4",
			name: "Phạm Thị D",
			avatar: "https://i.pravatar.cc/150?img=9",
		},
		text: "Công thức nấu lẩu Thái tom yum chuẩn vị, chua cay đậm đà.",
		foods: [],
		engagement: {
			likes_count: 63,
			comments_count: 0,
			shares_count: 0,
		},
		visibility: "public",
		hashtags: ["lẩu", "món thái", "chua cay"],
		is_edited: false,
		createdAt: "2025-11-01T18:45:00Z",
		updatedAt: "2025-11-01T18:45:00Z",
	},
];

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

	// Lấy một post theo ID
	getPostById: async (id: string): Promise<Post | undefined> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const post = mockPosts.find((p) => p._id === id);
				resolve(post);
			}, 300);
		});
	},

	// Toggle reaction cho post
	toggleReaction: async (
		postId: string,
		reactionType: ReactionType,
	): Promise<Post | undefined> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const post = mockPosts.find((p) => p._id === postId);
				if (post) {
					// Update engagement counts (simplified for mock)
					if (reactionType === "like") {
						post.engagement.likes_count++;
					}
				}
				resolve(post);
			}, 200);
		});
	},

	// Thêm comment mới
	addComment: async (postId: string): Promise<Post | undefined> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const post = mockPosts.find((p) => p._id === postId);
				if (post) {
					// Update comment count
					post.engagement.comments_count++;
				}
				resolve(post);
			}, 300);
		});
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

			// Return API response directly
			return {
				posts: response.data.data.posts,
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

			// Also add to mock posts for local display
			mockPosts.unshift(newPost);
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
			if (response.data.data) {
				return response.data.data;
			}
			return response.data;
		} catch (error) {
			console.error("Error fetching post detail:", error);
			throw error;
		}
	},
};
