export type ReactionType = "like" | "love" | "delicious" | "wow";

export interface Reaction {
	type: ReactionType;
	count: number;
	userReacted: boolean;
}

export interface Comment {
	id: string;
	author: {
		id: string;
		name: string;
		avatar?: string;
	};
	content: string;
	createdAt: string;
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
	postId: string;
	content: string;
	parentCommentId?: string;
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
