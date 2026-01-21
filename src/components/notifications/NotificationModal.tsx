import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	VStack,
	HStack,
	Text,
	Box,
	Divider,
	Spinner,
	Center,
	Button,
	Icon,
	useColorModeValue,
	Avatar,
} from "@chakra-ui/react";
import { useEffect } from "react";
import {
	FiBell,
	FiChevronLeft,
	FiChevronRight,
	FiHeart,
	FiMessageCircle,
	FiUserPlus,
	FiAtSign,
} from "react-icons/fi";
import { useNotification } from "@/hooks/useNotification";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import type { Notification } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";

interface NotificationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
	const {
		notifications,
		unreadCount,
		isLoading,
		currentPage,
		totalPages,
		fetchNotifications,
		markNotificationAsRead,
		markAllAsRead,
	} = useNotification();

	const navigate = useNavigate();
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const hoverBgColor = useColorModeValue("gray.50", "gray.700");
	const textColor = useColorModeValue("gray.600", "gray.400");
	const unreadBgColor = useColorModeValue("purple.50", "purple.900");

	// Get notification icon based on type
	const getNotificationIcon = (type: Notification["type"]) => {
		switch (type) {
			case "post_like":
			case "comment_like":
				return FiHeart;
			case "post_comment":
				return FiMessageCircle;
			case "follow":
				return FiUserPlus;
			case "mention":
				return FiAtSign;
			default:
				return FiBell;
		}
	};

	// Get notification message based on type
	const getNotificationMessage = (notification: Notification) => {
		const senderName = notification.sender.name;
		switch (notification.type) {
			case "post_like":
				return `${senderName} liked your post`;
			case "comment_like":
				return `${senderName} liked your comment`;
			case "post_comment":
				return `${senderName} commented on your post`;
			case "follow":
				return `${senderName} started following you`;
			case "mention":
				return `${senderName} mentioned you in a post`;
			default:
				return `New notification from ${senderName}`;
		}
	};

	// Get post ID from notification
	const getPostId = (notification: Notification): string | null => {
		// Try to get post ID from metadata first
		if (notification.metadata?.post_id?._id) {
			return notification.metadata.post_id._id;
		}

		// If target is a Post, get ID from target_id
		if (
			notification.target_type === "Post" &&
			notification.target_id?._id
		) {
			return notification.target_id._id;
		}

		return null;
	};

	// Handle notification click
	const handleNotificationClick = async (notification: Notification) => {
		// Mark notification as read if unread
		if (!notification.is_read) {
			await markNotificationAsRead(notification._id);
		}

		const postId = getPostId(notification);

		// Navigate to the target
		if (postId) {
			// Navigate to Community page with postId query param
			navigate(`${ROUTES.COMMUNITY}?postId=${postId}`);
			onClose();
		} else if (
			notification.target_type === "User" &&
			notification.sender._id
		) {
			navigate(
				`${ROUTES.USER_POSTS.replace(":userId", notification.sender._id)}`,
			);
			onClose();
		} else {
			// Default: just go to community page
			navigate(ROUTES.COMMUNITY);
			onClose();
		}
	};

	useEffect(() => {
		// Only fetch if modal is opened and notifications list is empty
		if (isOpen && notifications.length === 0) {
			fetchNotifications(1);
		}
	}, [isOpen, notifications.length, fetchNotifications]);

	const handleClose = async () => {
		if (unreadCount > 0) {
			await markAllAsRead();
		}
		onClose();
	};

	const handlePageChange = (page: number) => {
		fetchNotifications(page);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="xl"
			scrollBehavior="inside">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<HStack spacing={2}>
						<Icon
							as={FiBell}
							boxSize={5}
						/>
						<Text>Notifications</Text>
						{unreadCount > 0 && (
							<Box
								bg="red.500"
								color="white"
								borderRadius="full"
								px={2}
								py={0.5}
								fontSize="xs"
								fontWeight="bold">
								{unreadCount}
							</Box>
						)}
					</HStack>
				</ModalHeader>
				<ModalCloseButton />
				<Divider />
				<ModalBody py={4}>
					{isLoading ? (
						<Center py={8}>
							<Spinner
								size="lg"
								color="purple.500"
							/>
						</Center>
					) : notifications.length === 0 ? (
						<Center py={8}>
							<VStack spacing={3}>
								<Icon
									as={FiBell}
									boxSize={12}
									color="gray.300"
								/>
								<Text
									color={textColor}
									fontSize="md">
									No notifications yet
								</Text>
							</VStack>
						</Center>
					) : (
						<VStack
							spacing={0}
							align="stretch">
							{notifications.map((notification, index) => (
								<Box
									key={notification._id}
									p={4}
									borderBottom={
										index !== notifications.length - 1
											? "1px"
											: "none"
									}
									borderColor={borderColor}
									bg={
										!notification.is_read
											? unreadBgColor
											: "transparent"
									}
									_hover={{ bg: hoverBgColor }}
									transition="background 0.2s"
									cursor="pointer"
									onClick={() =>
										handleNotificationClick(notification)
									}>
									<HStack
										spacing={3}
										align="start">
										{/* Sender Avatar */}
										<Avatar
											size="sm"
											name={notification.sender.name}
											src={notification.sender.avatar}
											bg="purple.400"
											color="white"
										/>

										{/* Notification Content */}
										<VStack
											align="start"
											spacing={1}
											flex={1}>
											<HStack
												spacing={2}
												align="center">
												<Icon
													as={getNotificationIcon(
														notification.type,
													)}
													boxSize={4}
													color="purple.500"
												/>
												<Text
													fontSize="sm"
													fontWeight="medium"
													color={textColor}>
													{getNotificationMessage(
														notification,
													)}
												</Text>
											</HStack>
											<Text
												fontSize="xs"
												color="gray.500">
												{formatDistanceToNow(
													new Date(
														notification.createdAt,
													),
													{ addSuffix: true },
												)}
											</Text>
										</VStack>

										{/* Unread indicator */}
										{!notification.is_read && (
											<Box
												w={2}
												h={2}
												borderRadius="full"
												bg="purple.500"
												flexShrink={0}
											/>
										)}
									</HStack>
								</Box>
							))}
						</VStack>
					)}

					{/* Pagination Controls */}
					{totalPages > 1 && (
						<>
							<Divider my={4} />
							<HStack
								justify="space-between"
								align="center">
								<Button
									size="sm"
									variant="ghost"
									leftIcon={<FiChevronLeft />}
									onClick={() =>
										handlePageChange(currentPage - 1)
									}
									isDisabled={currentPage === 1 || isLoading}>
									Previous
								</Button>
								<Text
									fontSize="sm"
									color={textColor}>
									Page {currentPage} of {totalPages}
								</Text>
								<Button
									size="sm"
									variant="ghost"
									rightIcon={<FiChevronRight />}
									onClick={() =>
										handlePageChange(currentPage + 1)
									}
									isDisabled={
										currentPage === totalPages || isLoading
									}>
									Next
								</Button>
							</HStack>
						</>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default NotificationModal;
