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
	Divider,
	Wrap,
	WrapItem,
	Grid,
} from "@chakra-ui/react";
import type { User } from "@/types";

// Helper functions to format labels
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

const getGenderLabel = (gender: string) => {
	const genderMap: Record<string, string> = {
		male: "Male",
		female: "Female",
		other: "Other",
	};
	return genderMap[gender] || gender;
};

interface UserDetailModalProps {
	user: User | null;
	isOpen: boolean;
	onClose: () => void;
	onToggleStatus: (user: User) => void;
	onPromoteToAdmin?: (user: User) => void;
	onDemoteToUser?: (user: User) => void;
}

const InfoField = ({ label, value }: { label: string; value: React.ReactNode }) => (
	<Box>
		<Text fontWeight="bold" color="gray.600" fontSize="sm" mb={1}>
			{label}
		</Text>
		<Text fontSize="md" color="gray.800">
			{value}
		</Text>
	</Box>
);

export const UserDetailModal = ({
	user,
	isOpen,
	onClose,
	onToggleStatus,
	onPromoteToAdmin,
	onDemoteToUser,
}: UserDetailModalProps) => {
	const isMobile = useBreakpointValue({ base: true, md: false });
	if (!user) return null;

	const isAdmin = user.role === "admin";

	return (
		<Modal isOpen={isOpen} onClose={onClose} size={isMobile ? "full" : "2xl"}>
			<ModalOverlay />
			<ModalContent maxW="800px" borderRadius="2xl">
				<ModalHeader fontSize="2xl" fontWeight="bold" color="gray.700" pb={2}>
					User Details
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody px={{ base: 4, md: 8 }} py={4}>
					{/* Basic Information */}
					<Box mb={6}>
						<Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
							Basic Information
						</Text>
						<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
							<InfoField label="Full Name" value={user.name} />
							<InfoField label="Email" value={user.email} />
							{!isAdmin && (
								<>
									<InfoField label="Gender" value={getGenderLabel(user.gender)} />
									<InfoField label="Age" value={`${user.age} years old`} />
									<InfoField label="Height" value={`${user.height} cm`} />
									<InfoField label="Weight" value={`${user.weight} kg`} />
								</>
							)}
							<InfoField label="Role" value={
								<Badge colorScheme={user.role === "admin" ? "purple" : "blue"} fontSize="sm" px={2} py={1}>
									{user.role?.toUpperCase() || "USER"}
								</Badge>
							} />
							<InfoField label="Account Status" value={
								<Badge colorScheme={user.isActive ? "green" : "red"} fontSize="sm" px={2} py={1}>
									{user.isActive ? "Active" : "Inactive"}
								</Badge>
							} />
						</Grid>
					</Box>

					{!isAdmin && (
						<>
							<Divider my={4} />

							{/* Health & Fitness Goals */}
							<Box mb={6}>
								<Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
									Health & Fitness
								</Text>
								<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
									<InfoField label="Goal" value={getGoalLabel(user.goal)} />
									<InfoField label="Activity Level" value={getActivityLabel(user.activity)} />
								</Grid>
							</Box>

							<Divider my={4} />

							{/* Preferences & Restrictions */}
							<Box mb={6}>
								<Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
									Dietary Preferences & Restrictions
								</Text>
								<Stack spacing={4}>
									<Box>
										<Text fontWeight="bold" color="gray.600" fontSize="sm" mb={2}>
											Preferences
										</Text>
										{user.preferences && user.preferences.length > 0 ? (
											<Wrap spacing={2}>
												{user.preferences.map((pref, index) => (
													<WrapItem key={index}>
														<Badge colorScheme="green" fontSize="sm" px={2} py={1}>
															{pref}
														</Badge>
													</WrapItem>
												))}
											</Wrap>
										) : (
											<Text fontSize="sm" color="gray.500">
												No preferences specified
											</Text>
										)}
									</Box>

									<Box>
										<Text fontWeight="bold" color="gray.600" fontSize="sm" mb={2}>
											Allergies
										</Text>
										{user.allergies && user.allergies.length > 0 ? (
											<Wrap spacing={2}>
												{user.allergies.map((allergy, index) => (
													<WrapItem key={index}>
														<Badge colorScheme="red" fontSize="sm" px={2} py={1}>
															{allergy}
														</Badge>
													</WrapItem>
												))}
											</Wrap>
										) : (
											<Text fontSize="sm" color="gray.500">
												No allergies specified
											</Text>
										)}
									</Box>

									<Box>
										<Text fontWeight="bold" color="gray.600" fontSize="sm" mb={2}>
											Favorite Foods
										</Text>
										{user.favoriteFoods && user.favoriteFoods.length > 0 ? (
											<Wrap spacing={2}>
												{user.favoriteFoods.map((food, index) => (
													<WrapItem key={index}>
														<Badge colorScheme="orange" fontSize="sm" px={2} py={1}>
															{food}
														</Badge>
													</WrapItem>
												))}
											</Wrap>
										) : (
											<Text fontSize="sm" color="gray.500">
												No favorite foods specified
											</Text>
										)}
									</Box>
								</Stack>
							</Box>
						</>
					)}

					<Divider my={4} />

					{/* Account Information */}
					<Box>
						<Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
							Account Information
						</Text>
						<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
							<InfoField label="Email Verified" value={
								<Badge colorScheme={user.isEmailVerified ? "green" : "yellow"} fontSize="sm" px={2} py={1}>
									{user.isEmailVerified ? "Verified" : "Not Verified"}
								</Badge>
							} />
							<InfoField
								label="Last Login"
								value={
									user.lastLogin
										? new Date(user.lastLogin).toLocaleString("en-US", {
												dateStyle: "medium",
												timeStyle: "short",
										  })
										: "Never"
								}
							/>
							<InfoField
								label="Created At"
								value={new Date(user.createdAt).toLocaleString("en-US", {
									dateStyle: "medium",
									timeStyle: "short",
								})}
							/>
							<InfoField
								label="Updated At"
								value={new Date(user.updatedAt).toLocaleString("en-US", {
									dateStyle: "medium",
									timeStyle: "short",
								})}
							/>
						</Grid>
					</Box>
				</ModalBody>
				<ModalFooter>
					{!isAdmin && onPromoteToAdmin && (
						<Button
							colorScheme="purple"
							variant="solid"
							mr="auto"
							onClick={() => onPromoteToAdmin(user)}
							fontWeight="bold"
							fontSize="md"
							px={6}
							py={2}
							borderRadius="lg">
							Promote to Admin
						</Button>
					)}
					{isAdmin && onDemoteToUser && (
						<Button
							colorScheme="orange"
							variant="solid"
							mr="auto"
							onClick={() => onDemoteToUser(user)}
							fontWeight="bold"
							fontSize="md"
							px={6}
							py={2}
							borderRadius="lg">
							Demote to User
						</Button>
					)}
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
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
