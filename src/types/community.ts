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
	id: string;
	author: {
		id: string;
		name: string;
		avatar?: string;
	};
	title: string;
	description: string;
	images: string[];
	tags: string[];
	ingredients?: string[];
	instructions?: string[];
	createdAt: string;
	reactions: Reaction[];
	comments: Comment[];
}

export interface CreatePostData {
	title: string;
	description: string;
	images: string[];
	tags: string[];
	ingredients?: string[];
	instructions?: string[];
	nutrition?: {
		calories: number;
		protein: number;
		carbohydrates: number;
		fat: number;
		fiber: number;
	};
}

export interface CreateCommentData {
	postId: string;
	content: string;
	parentCommentId?: string;
}

// API Request/Response types
export interface CreatePostRequest {
	post_type: "food_review";
	text: string;
	images: string[];
	food_review: {
		dish_name: string;
		calories: number;
		protein: number;
		carbohydrates: number;
		fat: number;
		fiber: number;
		rating: number;
		tags: string[];
		ingredients?: string[];
		instructions?: string[];
	};
	visibility: "public" | "private" | "friends";
}

export interface ApiPostResponse {
	success: boolean;
	message: string;
	data: {
		_id: string;
		post_type: string;
		author: {
			_id: string;
			username: string;
			avatar?: string;
		};
		text: string;
		images: string[];
		food_review?: {
			dish_name: string;
			calories: number;
			protein: number;
			carbohydrates: number;
			fat: number;
			fiber: number;
			rating: number;
			tags: string[];
			ingredients?: string[];
			instructions?: string[];
		};
		engagement: {
			likes: number;
			comments: number;
			shares: number;
		};
		visibility: string;
		createdAt: string;
		updatedAt: string;
	};
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
