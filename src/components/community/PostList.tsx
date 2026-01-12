import { useState, useEffect } from "react";
import {
	Box,
	Button,
	Text,
	VStack,
	HStack,
	Input,
	Select,
	Flex,
	Tag,
	TagLabel,
	TagCloseButton,
	InputGroup,
	InputLeftElement,
	Icon,
	useDisclosure,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import type { Post, PaginationInfo } from "../../types/community";
import { communityService } from "../../services/communityService";
import { PostCard } from "./PostCard";
import LoadingSpinner from "../common/LoadingSpinner";
import PostDetailModal from "./PostDetailModal";

export const PostList = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationInfo>({
		page: 1,
		limit: 10,
		total: 0,
		pages: 0,
	});

	// Filters
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [hashtagInput, setHashtagInput] = useState("");
	const [hashtags, setHashtags] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Post Detail Modal
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

	useEffect(() => {
		loadPosts();
	}, [pagination.page, search, hashtags, sortBy, sortOrder]);

	const loadPosts = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await communityService.getPosts({
				page: pagination.page,
				limit: pagination.limit,
				search: search || undefined,
				hashtags: hashtags.length > 0 ? hashtags : undefined,
				sortBy,
				sortOrder,
			});

			setPosts(data.posts);
			if (data.pagination) {
				setPagination(data.pagination);
			}
		} catch (err) {
			setError("Unable to load posts. Please try again later.");
			console.error("Error loading posts:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleReactionUpdate = (updatedPost: Post) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) =>
				post._id === updatedPost._id ? updatedPost : post,
			),
		);
	};

	const handleSearch = () => {
		setSearch(searchInput);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handleAddHashtag = () => {
		if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
			setHashtags([...hashtags, hashtagInput.trim()]);
			setHashtagInput("");
			setPagination((prev) => ({ ...prev, page: 1 }));
		}
	};

	const handleRemoveHashtag = (tag: string) => {
		setHashtags(hashtags.filter((t) => t !== tag));
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSortChange = (value: string) => {
		setSortBy(value);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handleSortOrderToggle = () => {
		setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handlePostClick = (postId: string) => {
		setSelectedPostId(postId);
		onOpen();
	};

	if (isLoading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				py={20}>
				<LoadingSpinner
					message="Loading posts..."
					minHeight="200px"
					variant="default"
				/>
			</Box>
		);
	}

	if (error) {
		return (
			<Box
				textAlign="center"
				py={20}>
				<Text
					color="red.500"
					mb={4}>
					{error}
				</Text>
				<Button
					onClick={loadPosts}
					colorScheme="blue">
					Retry
				</Button>
			</Box>
		);
	}

	return (
		<VStack
			spacing={6}
			align="stretch">
			{/* Filters Section */}
			<Box
				bg="white"
				p={4}
				borderRadius="lg"
				shadow="sm">
				<VStack
					spacing={4}
					align="stretch">
					{/* Search */}
					<Flex gap={2}>
						<InputGroup flex={1}>
							<InputLeftElement pointerEvents="none">
								<Icon
									as={FiSearch}
									color="gray.400"
								/>
							</InputLeftElement>
							<Input
								placeholder="Search posts..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										handleSearch();
									}
								}}
							/>
						</InputGroup>
						<Button
							colorScheme="blue"
							onClick={handleSearch}>
							Search
						</Button>
					</Flex>

					{/* Hashtags Filter */}
					<Flex
						gap={2}
						align="center"
						flexWrap="wrap">
						<InputGroup maxW="300px">
							<Input
								placeholder="Add hashtag (e.g. vietnamese)"
								value={hashtagInput}
								onChange={(e) =>
									setHashtagInput(e.target.value)
								}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										handleAddHashtag();
									}
								}}
							/>
						</InputGroup>
						<Button
							size="sm"
							colorScheme="purple"
							onClick={handleAddHashtag}>
							Add
						</Button>
						{hashtags.map((tag) => (
							<Tag
								key={tag}
								size="md"
								colorScheme="purple"
								borderRadius="full">
								<TagLabel>#{tag}</TagLabel>
								<TagCloseButton
									onClick={() => handleRemoveHashtag(tag)}
								/>
							</Tag>
						))}
					</Flex>

					{/* Sort Controls */}
					<HStack spacing={3}>
						<Text
							fontSize="sm"
							color="gray.600"
							minW="fit-content">
							Sort by:
						</Text>
						<Select
							size="sm"
							value={sortBy}
							onChange={(e) => handleSortChange(e.target.value)}
							maxW="200px">
							<option value="createdAt">Date Created</option>
							<option value="updatedAt">Last Updated</option>
						</Select>
						<Button
							size="sm"
							variant="outline"
							onClick={handleSortOrderToggle}>
							{sortOrder === "desc" ? "↓ Newest" : "↑ Oldest"}
						</Button>
					</HStack>
				</VStack>
			</Box>

			{/* Posts List */}
			{posts.length === 0 ? (
				<Box
					textAlign="center"
					py={20}>
					<Text
						color="gray.500"
						fontSize="lg">
						No posts found.
					</Text>
				</Box>
			) : (
				<>
					{posts.map((post) => (
						<PostCard
							key={post._id}
							post={post}
							onReactionUpdate={handleReactionUpdate}
							onPostClick={handlePostClick}
						/>
					))}

					{/* Pagination */}
					{pagination.pages > 1 && (
						<Box
							bg="white"
							p={4}
							borderRadius="lg"
							shadow="sm">
							<HStack
								justify="center"
								spacing={2}>
								<Button
									size="sm"
									onClick={() =>
										handlePageChange(pagination.page - 1)
									}
									isDisabled={pagination.page === 1}>
									Previous
								</Button>
								{Array.from(
									{ length: pagination.pages },
									(_, i) => i + 1,
								)
									.filter((page) => {
										// Show first, last, current, and adjacent pages
										return (
											page === 1 ||
											page === pagination.pages ||
											Math.abs(page - pagination.page) <=
												1
										);
									})
									.map((page, index, array) => {
										// Add ellipsis
										const prevPage = array[index - 1];
										const showEllipsis =
											prevPage && page - prevPage > 1;

										return (
											<HStack
												key={page}
												spacing={2}>
												{showEllipsis && (
													<Text
														color="gray.500"
														px={2}>
														...
													</Text>
												)}
												<Button
													size="sm"
													colorScheme={
														page === pagination.page
															? "blue"
															: "gray"
													}
													variant={
														page === pagination.page
															? "solid"
															: "ghost"
													}
													onClick={() =>
														handlePageChange(page)
													}>
													{page}
												</Button>
											</HStack>
										);
									})}
								<Button
									size="sm"
									onClick={() =>
										handlePageChange(pagination.page + 1)
									}
									isDisabled={
										pagination.page === pagination.pages
									}>
									Next
								</Button>
							</HStack>
							<Text
								textAlign="center"
								fontSize="sm"
								color="gray.600"
								mt={2}>
								Page {pagination.page} / {pagination.pages} (
								{pagination.total} posts)
							</Text>
						</Box>
					)}
				</>
			)}

			{/* Post Detail Modal */}
			<PostDetailModal
				isOpen={isOpen}
				onClose={onClose}
				postId={selectedPostId}
			/>
		</VStack>
	);
};
