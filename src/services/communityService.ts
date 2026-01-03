import type {
	Post,
	ReactionType,
	Comment,
	CreatePostData,
	CreatePostRequest,
	PaginationParams,
	PaginationInfo,
	FoodInPost,
	PostDetail,
} from "../types/community";
import api from "@/lib/api";
import { getStorageItem } from "@/utils";
import { AUTH_CONFIG } from "@/constants";

// Mock data cho demo
const mockPosts: Post[] = [
	{
		id: "1",
		author: {
			id: "user1",
			name: "Nguyễn Văn A",
			avatar: "https://i.pravatar.cc/150?img=1",
		},
		title: "Phở Bò Hà Nội Truyền Thống",
		description:
			"Chia sẻ công thức nấu phở bò Hà Nội đúng chuẩn, thơm ngon như hàng quán.",
		images: [
			"https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800",
		],
		tags: ["phở", "món việt", "món chính"],
		ingredients: [
			"1kg xương bò",
			"500g thịt bò",
			"Hành, gừng",
			"Gia vị: hồi, quế, thảo quả",
			"Bánh phở tươi",
			"Rau thơm: hành, ngò, giá",
		],
		instructions: [
			"Chần xương bò qua nước sôi",
			"Nấu nước dùng với xương và gia vị trong 4-6 giờ",
			"Thái thịt bò mỏng",
			"Trụng bánh phở, cho vào tô",
			"Chan nước dùng nóng, thêm rau thơm",
		],
		createdAt: "2025-11-04T10:30:00Z",
		reactions: [
			{ type: "like", count: 45, userReacted: false },
			{ type: "love", count: 32, userReacted: true },
			{ type: "delicious", count: 28, userReacted: false },
			{ type: "wow", count: 15, userReacted: false },
		],
		comments: [
			{
				id: "c1",
				author: {
					id: "user2",
					name: "Trần Thị B",
					avatar: "https://i.pravatar.cc/150?img=5",
				},
				content:
					"Công thức rất chi tiết, mình đã thử và rất thành công! Cảm ơn bạn nhiều.",
				createdAt: "2025-11-04T11:00:00Z",
				replies: [
					{
						id: "c1-r1",
						author: {
							id: "user1",
							name: "Nguyễn Văn A",
							avatar: "https://i.pravatar.cc/150?img=1",
						},
						content:
							"Vui vì bạn thích! Chúc bạn nấu ăn ngon nhé 😊",
						createdAt: "2025-11-04T11:30:00Z",
					},
				],
			},
		],
	},
	{
		id: "2",
		author: {
			id: "user2",
			name: "Trần Thị B",
			avatar: "https://i.pravatar.cc/150?img=5",
		},
		title: "Thực đơn ăn kiêng giảm cân trong 1 tuần",
		description:
			"Thực đơn eat clean giúp giảm cân hiệu quả mà vẫn đầy đủ dinh dưỡng.",
		images: [
			"https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
			"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
		],
		tags: ["giảm cân", "eat clean", "healthy", "thực đơn"],
		createdAt: "2025-11-03T15:20:00Z",
		reactions: [
			{ type: "like", count: 89, userReacted: true },
			{ type: "love", count: 67, userReacted: false },
			{ type: "delicious", count: 23, userReacted: false },
			{ type: "wow", count: 34, userReacted: false },
		],
		comments: [],
	},
	{
		id: "3",
		author: {
			id: "user3",
			name: "Lê Văn C",
			avatar: "https://i.pravatar.cc/150?img=12",
		},
		title: "Bánh Mì Việt Nam - Món ăn sáng tuyệt vời",
		description:
			"Hướng dẫn làm bánh mì thịt nguội tại nhà, đơn giản mà ngon không kém ngoài hàng.",
		images: [
			"https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=800",
		],
		tags: ["bánh mì", "món việt", "ăn sáng"],
		ingredients: [
			"Bánh mì que",
			"Pate gan",
			"Thịt nguội",
			"Dưa leo, rau mùi, đồ chua",
			"Tương ớt, tương đen",
		],
		instructions: [
			"Nướng bánh mì cho giòn",
			"Xẻ bánh, phết pate",
			"Thêm thịt nguội, đồ chua, rau thơm",
			"Chan tương, thưởng thức",
		],
		createdAt: "2025-11-02T08:15:00Z",
		reactions: [
			{ type: "like", count: 56, userReacted: false },
			{ type: "love", count: 41, userReacted: false },
			{ type: "delicious", count: 72, userReacted: true },
			{ type: "wow", count: 19, userReacted: false },
		],
		comments: [],
	},
	{
		id: "4",
		author: {
			id: "user4",
			name: "Phạm Thị D",
			avatar: "https://i.pravatar.cc/150?img=9",
		},
		title: "Lẩu Thái Chua Cay - Hoàn hảo cho ngày mưa",
		description:
			"Công thức nấu lẩu Thái tom yum chuẩn vị, chua cay đậm đà.",
		images: [
			"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800",
		],
		tags: ["lẩu", "món thái", "chua cay"],
		ingredients: [
			"Tôm, mực, hải sản",
			"Nấm các loại",
			"Sả, gừng, ớt",
			"Nước cốt me, nước mắm",
			"Rau ăn kèm",
		],
		createdAt: "2025-11-01T18:45:00Z",
		reactions: [
			{ type: "like", count: 63, userReacted: false },
			{ type: "love", count: 55, userReacted: false },
			{ type: "delicious", count: 48, userReacted: false },
			{ type: "wow", count: 29, userReacted: false },
		],
		comments: [],
	},
];

export const communityService = {
	// Lấy tất cả posts
	getPosts: async (): Promise<Post[]> => {
		// Simulate API call
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(mockPosts);
			}, 500);
		});
	},

	// Lấy một post theo ID
	getPostById: async (id: string): Promise<Post | undefined> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const post = mockPosts.find((p) => p.id === id);
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
				const post = mockPosts.find((p) => p.id === postId);
				if (post) {
					const reaction = post.reactions.find(
						(r) => r.type === reactionType,
					);
					if (reaction) {
						if (reaction.userReacted) {
							reaction.count--;
							reaction.userReacted = false;
						} else {
							// Remove other reactions from user
							post.reactions.forEach((r) => {
								if (r.userReacted) {
									r.count--;
									r.userReacted = false;
								}
							});
							reaction.count++;
							reaction.userReacted = true;
						}
					}
				}
				resolve(post);
			}, 200);
		});
	},

	// Thêm comment mới
	addComment: async (
		postId: string,
		content: string,
		parentCommentId?: string,
	): Promise<Post | undefined> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				const post = mockPosts.find((p) => p.id === postId);
				if (post) {
					const newComment: Comment = {
						id: `c${Date.now()}`,
						author: {
							id: "currentUser",
							name: "Current User",
							avatar: "https://i.pravatar.cc/150?img=68",
						},
						content,
						createdAt: new Date().toISOString(),
						replies: [],
					};

					if (parentCommentId) {
						// Add as reply to existing comment
						const parentComment = post.comments.find(
							(c) => c.id === parentCommentId,
						);
						if (parentComment) {
							if (!parentComment.replies) {
								parentComment.replies = [];
							}
							parentComment.replies.push(newComment);
						}
					} else {
						// Add as new top-level comment
						post.comments.push(newComment);
					}
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
				limit: String(params?.limit || 10),
				sortBy: params?.sortBy || "createdAt",
				sortOrder: params?.sortOrder || "desc",
			});

			const response = await api.get(
				`/posts/user/${userId}?${queryParams.toString()}`,
			);

			// Convert API posts to Post interface
			const posts: Post[] = response.data.data.posts.map(
				(apiPost: any) => ({
					id: apiPost._id,
					author: {
						id: apiPost.author._id,
						name: apiPost.author.username,
						avatar: apiPost.author.avatar,
					},
					title: apiPost.food_review?.dish_name || "",
					description: apiPost.text,
					images: apiPost.images || [],
					tags: apiPost.food_review?.tags || [],
					ingredients: apiPost.food_review?.ingredients,
					instructions: apiPost.food_review?.instructions,
					createdAt: apiPost.createdAt,
					reactions: [
						{ type: "like", count: 0, userReacted: false },
						{ type: "love", count: 0, userReacted: false },
						{ type: "delicious", count: 0, userReacted: false },
						{ type: "wow", count: 0, userReacted: false },
					],
					comments: [],
				}),
			);
			console.log(posts);

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

			// Convert API response to Post interface
			const apiPost = response.data.data;
			const newPost: Post = {
				id: apiPost._id,
				author: {
					id: apiPost.author._id,
					name: apiPost.author.name,
					avatar: apiPost.author.avatar,
				},
				title: apiPost.foods?.[0]?.name || "",
				description: apiPost.text,
				images:
					apiPost.foods?.map((food: FoodInPost) => food.imageUrl) ||
					[],
				tags: apiPost.hashtags || [],
				ingredients: [],
				instructions: [],
				createdAt: apiPost.createdAt,
				reactions: [
					{ type: "like", count: 0, userReacted: false },
					{ type: "love", count: 0, userReacted: false },
					{ type: "delicious", count: 0, userReacted: false },
					{ type: "wow", count: 0, userReacted: false },
				],
				comments: [],
			};

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
