import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import type { BarChartData } from "../../../types";

interface CustomBarChartProps {
	title: string;
	data: BarChartData[];
	dataKey?: string;
	xAxisKey?: string;
	barName?: string;
	color?: string;
	height?: number;
}

export const CustomBarChart = ({
	title,
	data,
	dataKey = "value",
	xAxisKey = "name",
	barName = "Số lượng",
	color = "#0073e6",
	height = 300,
}: CustomBarChartProps) => {
	const bgColor = useColorModeValue("white", "gray.800");

	return (
		<Box
			bg={bgColor}
			p={6}
			borderRadius="xl"
			boxShadow="md">
			<Heading
				size="md"
				mb={4}
				color="gray.700">
				{title}
			</Heading>
			<ResponsiveContainer
				width="100%"
				height={height}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey={xAxisKey} />
					<YAxis />
					<Tooltip
						formatter={(value: number) =>
							value.toLocaleString("vi-VN")
						}
					/>
					<Legend />
					<Bar
						dataKey={dataKey}
						name={barName}
						fill={color}
						radius={[8, 8, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
};
