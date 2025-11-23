import { Box } from "@chakra-ui/react";

const float = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
  }
`;

const float2 = `
  @keyframes float2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-40px, 40px) scale(1.1); }
  }
`;

const float3 = `
  @keyframes float3 {
    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
    25% { transform: translate(20px, -40px) rotate(90deg) scale(1.2); }
    75% { transform: translate(-30px, 30px) rotate(270deg) scale(0.9); }
  }
`;

export default function BackgroundDecoration() {
	return (
		<>
			<style>
				{float}
				{float2}
				{float3}
			</style>

			{/* Animated gradient orbs */}
			<Box
				position="absolute"
				top="-10%"
				right="-5%"
				width="600px"
				height="600px"
				borderRadius="full"
				bgGradient="radial(circle, rgba(100, 181, 246, 0.4) 0%, transparent 70%)"
				filter="blur(60px)"
				sx={{ animation: "float 20s ease-in-out infinite" }}
				opacity={0.6}
			/>

			<Box
				position="absolute"
				bottom="-15%"
				left="-10%"
				width="700px"
				height="700px"
				borderRadius="full"
				bgGradient="radial(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)"
				filter="blur(80px)"
				sx={{ animation: "float2 25s ease-in-out infinite" }}
				opacity={0.5}
			/>

			<Box
				position="absolute"
				top="30%"
				left="10%"
				width="400px"
				height="400px"
				borderRadius="full"
				bgGradient="radial(circle, rgba(156, 39, 176, 0.35) 0%, transparent 70%)"
				filter="blur(70px)"
				sx={{ animation: "float3 18s ease-in-out infinite" }}
				opacity={0.4}
			/>

			{/* Subtle overlay pattern */}
			<Box
				position="absolute"
				top={0}
				left={0}
				right={0}
				bottom={0}
				opacity={0.05}
				bgImage="radial-gradient(circle, white 1px, transparent 1px)"
				bgSize="50px 50px"
			/>
		</>
	);
}
