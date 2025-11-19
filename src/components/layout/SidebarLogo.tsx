import { animationPresets, transitions } from "@/styles/animation";
import {
	Box,
	HStack,
	Text,
	Tooltip,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";

interface SidebarLogoProps {
	isCollapsed: boolean;
}

export const SidebarLogo = ({ isCollapsed }: SidebarLogoProps) => {
	const headerBg = useColorModeValue("rgba(255, 255, 255, 0.7)", "gray.800");
	const borderColor = useColorModeValue(
		"rgba(159, 122, 234, 0.1)",
		"gray.700",
	);

	return (
		<Box
			p={isCollapsed ? 3 : 6}
			bg={headerBg}
			borderBottom="1px"
			borderColor={borderColor}
			backdropFilter="blur(10px)"
			position="relative"
			_after={{
				content: '""',
				position: "absolute",
				bottom: 0,
				left: 0,
				right: 0,
				height: "1px",
				bgGradient:
					"linear(to-r, transparent, purple.400, pink.400, transparent)",
				opacity: 0.6,
			}}>
			{isCollapsed ? (
				<Tooltip
					label="MealGenie"
					placement="right"
					hasArrow>
					<Box
						display="flex"
						justifyContent="center">
						<Box
							p={2}
							bgGradient="linear(135deg, purple.400, pink.400)"
							borderRadius="xl"
							shadow="lg"
							animation={animationPresets.float}
							transition={transitions.smooth}
							cursor="pointer"
							_hover={{
								transform: "scale(1.1) rotate(5deg)",
								shadow: "xl",
								bgGradient:
									"linear(135deg, purple.500, pink.500)",
							}}
							_active={{
								transform: "scale(0.95)",
							}}>
							<img
								src="/vite.svg"
								alt="MealGenie Logo"
								style={{
									width: "28px",
									height: "28px",
									objectFit: "contain",
									filter: "brightness(0) invert(1)",
								}}
							/>
						</Box>
					</Box>
				</Tooltip>
			) : (
				<HStack spacing={3}>
					<Box
						p={2.5}
						bgGradient="linear(135deg, purple.400, pink.400)"
						borderRadius="xl"
						shadow="lg"
						animation={animationPresets.float}
						transition={transitions.smooth}
						_hover={{
							transform: "scale(1.05) rotate(5deg)",
							shadow: "xl",
							bgGradient: "linear(135deg, purple.500, pink.500)",
						}}>
						<img
							src="/vite.svg"
							alt="MealGenie Logo"
							style={{
								width: "36px",
								height: "36px",
								objectFit: "contain",
								filter: "brightness(0) invert(1)",
							}}
						/>
					</Box>
					<VStack
						spacing={0}
						align="start">
						<Text
							fontSize="xl"
							fontWeight="extrabold"
							bgGradient="linear(to-r, purple.500, pink.500)"
							bgClip="text"
							lineHeight={1.2}
							letterSpacing="tight">
							MealGenie
						</Text>
						<Text
							fontSize="xs"
							color="gray.500"
							fontWeight="medium"
							letterSpacing="wide">
							Smart Meal Planner
						</Text>
					</VStack>
				</HStack>
			)}
		</Box>
	);
};
