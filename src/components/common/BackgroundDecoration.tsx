import {animationPresets} from "@/styles/animation";
import {Box} from "@chakra-ui/react";

export default function BackgroundDecoration() {
    return (
        <>
            <Box
                position="absolute"
                top="-50%"
                right="-50%"
                width="200%"
                height="200%"
                bgGradient="radial(circle, blue.100 0%, transparent 50%)"
                opacity={0.3}
                animation={`${animationPresets.pulse.replace("2s", "8s")}`}
            />
            <Box
                position="absolute"
                bottom="-50%"
                left="-50%"
                width="200%"
                height="200%"
                bgGradient="radial(circle, purple.100 0%, transparent 50%)"
                opacity={0.2}
                animation={`${animationPresets.pulse.replace("2s", "10s")} reverse`}
            />
        </>
    );
}
