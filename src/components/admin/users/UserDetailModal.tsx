// Chuẩn hóa mục tiêu
const getGoalLabel = (goal: string) => {
	const goalMap: Record<string, string> = {
		lose_weight: "Lose Weight",
		maintain_weight: "Maintain Weight",
		gain_weight: "Gain Weight",
		build_muscle: "Build Muscle",
		improve_health: "Improve Health",
	};
	return goalMap[goal] || goal;
};

// Chuẩn hóa hoạt động
const getActivityLabel = (activity: string) => {
	const activityMap: Record<string, string> = {
		sedentary: "Sedentary",
		lightly_active: "Lightly Active",
		moderately_active: "Moderately Active",
		very_active: "Very Active",
		extra_active: "Extra Active",
	};
	return activityMap[activity] || activity;
};

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Box,
	Text,
	Badge,
	Stack,
	useBreakpointValue,
} from "@chakra-ui/react";
import type { User } from "@/types";

interface UserDetailModalProps {
	user: User | null;
	isOpen: boolean;
	onClose: () => void;
	onToggleStatus: (user: User) => void;
}

export const UserDetailModal = ({
	user,
	isOpen,
	onClose,
	onToggleStatus,
}: UserDetailModalProps) => {
	const isMobile = useBreakpointValue({ base: true, md: false });
	if (!user) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={isMobile ? "full" : "xl"}>
			<ModalOverlay />
			<ModalContent
				maxW="600px"
				borderRadius="2xl">
				<ModalHeader
					fontSize="2xl"
					fontWeight="bold"
					color="gray.700"
					pb={2}>
					Thông tin người dùng
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody
					px={{ base: 4, md: 8 }}
					py={4}>
					<Box
						as="section"
						w="100%">
						<Stack
							direction={{ base: "column", md: "row" }}
							spacing={8}>
							<Stack
								spacing={4}
								flex={1}>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Họ tên
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{user.name}
									</Text>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Email
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{user.email}
									</Text>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Giới tính
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{user.gender === "male"
											? "Nam"
											: user.gender === "female"
											? "Nữ"
											: "Khác"}
									</Text>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Tuổi
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{user.age}
									</Text>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Chiều cao / Cân nặng
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{user.height} cm / {user.weight} kg
									</Text>
								</Box>
							</Stack>
							<Stack
								spacing={4}
								flex={1}>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Mục tiêu
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{getGoalLabel(user.goal)}
									</Text>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Hoạt động
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{getActivityLabel(user.activity)}
									</Text>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Trạng thái
									</Text>
									<Badge
										fontSize="md"
										px={3}
										py={1}
										borderRadius="md"
										colorScheme={
											user.isActive ? "green" : "red"
										}>
										{user.isActive
											? "Hoạt động"
											: "Vô hiệu hóa"}
									</Badge>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Email xác minh
									</Text>
									<Badge
										fontSize="md"
										px={3}
										py={1}
										borderRadius="md"
										colorScheme={
											user.isEmailVerified
												? "green"
												: "red"
										}>
										{user.isEmailVerified
											? "Đã xác minh"
											: "Chưa xác minh"}
									</Badge>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Lần đăng nhập cuối
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{user.lastLogin
											? new Date(
													user.lastLogin,
											  ).toLocaleString("vi-VN")
											: "-"}
									</Text>
								</Box>
								<Box>
									<Text
										fontWeight="bold"
										color="gray.600"
										fontSize="md">
										Ngày tạo
									</Text>
									<Text
										fontSize="lg"
										color="gray.800">
										{new Date(
											user.createdAt,
										).toLocaleDateString("vi-VN")}
									</Text>
								</Box>
							</Stack>
						</Stack>
					</Box>
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme={user.isActive ? "red" : "green"}
						variant={user.isActive ? "outline" : "solid"}
						mr={3}
						onClick={() => onToggleStatus(user)}
						fontWeight="bold"
						fontSize="md"
						px={6}
						py={2}
						borderRadius="lg">
						{user.isActive ? "Deactivate" : "Activate"}
					</Button>
					<Button
						onClick={onClose}
						fontWeight="bold"
						fontSize="md"
						px={6}
						py={2}
						borderRadius="lg">
						Đóng
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
