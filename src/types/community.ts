export type ReactionType = "like" | "love" | "delicious" | "wow";

export interface Reaction {
	type: ReactionType;
	count: number;
	userReacted: boolean;
}

export interface Comment {
	_id: string;
	post: string;
	author: {
		_id: string;
		name: string;
		avatar?: string;
		email?: string;
	};
	content: {
		text: string;
		media: string[];
	};
	visibility: string;
	createdAt: string;
	updatedAt: string;
	// For UI compatibility
	id?: string;
	replies?: Comment[];
}

export interface Post {
	_id: string;
	author: {
		_id: string;
		name: string;
		email?: string;
		avatar?: string;
	};
	text: string;
	foods: FoodInPost[];
	engagement: {
		likes_count: number;
		comments_count: number;
		shares_count: number;
	};
	visibility: string;
	hashtags: string[];
	is_edited: boolean;
	is_liked?: boolean; // Track if current user has liked this post
	createdAt: string;
	updatedAt: string;
	post_type?: string;
	// Legacy fields for backward compatibility
	id?: string;
	title?: string;
	description?: string;
	images?: string[];
	tags?: string[];
	ingredients?: string[];
	instructions?: string[];
	reactions?: Reaction[];
	comments?: Comment[];
}

export interface CreatePostData {
	text: string;
	foods: string[]; // Array of food IDs
	visibility?: "public" | "private" | "friends";
}

export interface CreateCommentData {
	post: string;
	content: {
		text: string;
		media?: string[];
	};
	visibility?: "public" | "private" | "friends";
}

export interface GetCommentsParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	order?: "asc" | "desc";
}

export interface CommentsResponse {
	success: boolean;
	data: {
		comments: Comment[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
		};
	};
}

export interface CreateCommentResponse {
	success: boolean;
	message: string;
	data: Comment;
}

// API Request/Response types
export interface CreatePostRequest {
	text: string;
	foods: string[]; // Array of food IDs
	visibility: "public" | "private" | "friends";
}

export interface FoodInPost {
	_id: string;
	name: string;
	description: string;
	imageUrl: string;
	category: string;
	nutritionalInfo: {
		calories?: number;
		protein?: number;
		carbohydrates?: number;
		fat?: number;
		fiber?: number;
		[key: string]: any;
	};
}

export interface PostDetail {
	_id: string;
	author: {
		_id: string;
		name: string;
		email: string;
		avatar?: string;
	};
	text: string;
	foods: FoodInPost[];
	engagement: {
		likes_count: number;
		comments_count: number;
		shares_count: number;
	};
	visibility: string;
	hashtags: string[];
	is_edited: boolean;
	is_liked?: boolean; // Track if current user has liked this post
	createdAt: string;
	updatedAt: string;
}

export interface ApiPostResponse {
	success: boolean;
	message: string;
	data: PostDetail;
}

// Pagination types
export interface PaginationParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	pages: number;
}

export interface GetUserPostsResponse {
	success: boolean;
	data: {
		posts: any[]; // API posts format
		pagination: PaginationInfo;
	};
}
