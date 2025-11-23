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

interface GroupedBarChartProps {
	title: string;
	data: any[];
	bars: {
		dataKey: string;
		name: string;
		color: string;
	}[];
	xAxisKey?: string;
	height?: number;
}

export const GroupedBarChart = ({
	title,
	data,
	bars,
	xAxisKey = "gender",
	height = 300,
}: GroupedBarChartProps) => {
	const bgColor = useColorModeValue("white", "gray.800");

	return (
		<Box
			bg={bgColor}
			p={6}
			borderRadius="xl"
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
					{bars.map((bar) => (
						<Bar
							key={bar.dataKey}
							dataKey={bar.dataKey}
							name={bar.name}
							fill={bar.color}
							radius={[8, 8, 0, 0]}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
};
