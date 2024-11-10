'use client';

import {
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

const SCALE = 2.25; // max scale factor of an icon
const SELECTED_SCALE = 2.5; // scale factor for selected icon
const DISTANCE = 110; // pixels before mouse affects an icon
const NUDGE = 40; // pixels icons are moved away from mouse
const SPRING = {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
};
const APPS = [
    'Safari',
    'Mail',
    'Messages',
    'Photos',
    'Notes',
    'Calendar',
    'Reminders',
    'Music', // Last icon for clearing canvas
];

export default function Dock({
    setStrokeWidth,
    clearCanvas,
}: {
    setStrokeWidth: (width: number) => void;
    clearCanvas: () => void;
}) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const mouseLeft = useMotionValue(-Infinity);
    const mouseRight = useMotionValue(-Infinity);
    const left = useTransform(mouseLeft, [0, 40], [0, -40]);
    const right = useTransform(mouseRight, [0, 40], [0, -40]);
    const leftSpring = useSpring(left, SPRING);
    const rightSpring = useSpring(right, SPRING);

    return (
        <>
            <motion.div
                onMouseMove={(e) => {
                    const { left, right } = e.currentTarget.getBoundingClientRect();
                    const offsetLeft = e.clientX - left;
                    const offsetRight = right - e.clientX;
                    mouseLeft.set(offsetLeft);
                    mouseRight.set(offsetRight);
                }}
                onMouseLeave={() => {
                    mouseLeft.set(-Infinity);
                    mouseRight.set(-Infinity);
                }}
                className="mx-auto h-16 w-[20rem] justify-center items-center gap-3 px-2 sm:flex relative"
            >
                <motion.div
                    className="absolute rounded-2xl inset-y-0 bg-white border border-gray-600 -z-10"
                    style={{ left: leftSpring, right: rightSpring }}
                />

                {APPS.map((app, i) => (
                    <AppIcon
                        key={i}
                        mouseLeft={mouseLeft}
                        isSelected={selectedIndex === i}
                        onClick={() => {
                            setSelectedIndex(i);
                            if (app === 'Music') {
                                clearCanvas(); // Clear the canvas when 'Music' is clicked
                            } else {
                                setStrokeWidth(i + 1); // Set the stroke width based on the selected icon
                            }
                        }}
                    >
                        {app}
                    </AppIcon>
                ))}
            </motion.div>
        </>
    );
}

function AppIcon({
    mouseLeft,
    isSelected,
    onClick,
}: {
    mouseLeft: MotionValue;
    isSelected: boolean;
    children: ReactNode;
    onClick: () => void;
}) {
    const ref = useRef<HTMLButtonElement>(null);

    const distance = useTransform(() => {
        const bounds = ref.current
            ? { x: ref.current.offsetLeft, width: ref.current.offsetWidth }
            : { x: 0, width: 0 };

        return mouseLeft.get() - bounds.x - bounds.width / 2;
    });

    const scale = useTransform(
        distance,
        [-DISTANCE, 0, DISTANCE],
        [1, isSelected ? SELECTED_SCALE : SCALE, 1]
    );

    const x = useTransform(() => {
        const d = distance.get();
        if (d === -Infinity) {
            return 0;
        } else if (d < -DISTANCE || d > DISTANCE) {
            return Math.sign(d) * -1 * NUDGE;
        } else {
            return (-d / DISTANCE) * NUDGE * scale.get();
        }
    });

    const scaleSpring = useSpring(scale, SPRING);
    const xSpring = useSpring(x, SPRING);
    const y = useMotionValue(0);

    return (
        <motion.button
            ref={ref}
            style={{ x: xSpring, scale: scaleSpring, y }}
            onClick={onClick}
            className={`aspect-square block w-10 rounded-full shadow origin-bottom ${
                isSelected ? 'bg-gray-300' : 'bg-white'
            }`}
        />
    );
}
