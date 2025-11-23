import {
	Box,
	Icon,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	useColorModeValue,
} from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface StatsCardProps {
	title: string;
	value: string | number;
	helpText?: string;
	icon: IconType;
	colorScheme?: string;
}

export const StatsCard = ({
	title,
	value,
	helpText,
	icon,
	colorScheme = "brand",
}: StatsCardProps) => {
	const bgColor = useColorModeValue("white", "gray.800");
	const iconBgColor = useColorModeValue(
		`${colorScheme}.50`,
		`${colorScheme}.900`,
	);
	const iconColor = useColorModeValue(
		`${colorScheme}.500`,
		`${colorScheme}.200`,
	);

	return (
		<Box
			bg={bgColor}
			p={6}
			borderRadius="xl"
			boxShadow="md"
			h="150"
			_hover={{
				boxShadow: "lg",
				transform: "translateY(-2px)",
			}}
			transition="all 0.2s">
			<Stat>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					mb={2}>
					<StatLabel
						fontSize="sm"
						fontWeight="medium"
						color="gray.500">
						{title}
					</StatLabel>
					<Box
						bg={iconBgColor}
						p={2}
						borderRadius="lg">
						<Icon
							as={icon}
							w={5}
							h={5}
							color={iconColor}
						/>
					</Box>
				</Box>
				<StatNumber
					fontSize="2xl"
					fontWeight="bold">
					{typeof value === "number"
						? value.toLocaleString("vi-VN")
						: value}
				</StatNumber>
				{helpText && (
					<StatHelpText
						fontSize="xs"
						mb={0}>
						{helpText}
					</StatHelpText>
				)}
			</Stat>
		</Box>
	);
};
