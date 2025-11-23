import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
	Text,
} from "recharts";
import type { PieChartData } from "../../../types";

interface CustomPieChartProps {
	title: string;
	data: PieChartData[];
	colors?: string[];
	height?: number;
}

const DEFAULT_COLORS = ["#0073e6", "#00a8e6", "#00d4e6", "#4da6ff", "#80bfff"];

export const CustomPieChart = ({
	title,
	data,
	colors = DEFAULT_COLORS,
	height = 300,
}: CustomPieChartProps) => {
	const bgColor = useColorModeValue("white", "gray.800");

	const renderCustomLabel = ({
		cx,
		cy,
		midAngle,
		outerRadius,
		percent,
		name,
	}: any) => {
		const RADIAN = Math.PI / 180;
		const radius = outerRadius + 25;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<Text
				x={x}
				y={y}
				fill="black"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="auto"
				fontSize="10"
				fontWeight="500">
				{`${name}: ${(percent * 100).toFixed(0)}%`}
			</Text>
		);
	};

	return (
		<Box
			bg={bgColor}
			p={6}
			borderRadius="xl"
			h="500"
			boxShadow="md">
			<Heading
				size="md"
				mb={6}
				color="gray.700">
				{title}
			</Heading>
			<ResponsiveContainer
				width="100%"
				height={height}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={true}
						label={renderCustomLabel}
						outerRadius={70}
						fill="#8884d8"
						dataKey="value">
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={
									entry.color || colors[index % colors.length]
								}
							/>
						))}
					</Pie>
					<Tooltip
						formatter={(value: number) =>
							value.toLocaleString("vi-VN")
						}
					/>
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</Box>
	);
};
