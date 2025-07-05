"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React from "react";

// Animation speed controls
const MOVEMENT_SPEED = 1.5; // Pixels per frame (lower = slower) [try 1-5]
const TIME_STEP = 0.02; // Time increment (lower = slower) [try 0.005-0.02]
const VERTICAL_SPEED = 0.5; // Vertical movement speed multiplier [try 0.3-1]

const Footer = () => {
  // Create smooth animated values for the gradient position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Add spring animation for smoother movement
  const springX = useSpring(mouseX, { stiffness: 100, damping: 35 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 35 });

  // Transform spring values to CSS translate values
  const translateX = useTransform(springX, (value) => `${value}px`);
  const translateY = useTransform(springY, (value) => `${value}px`);

  // Automatic gradient animation that starts on page load and resumes when not hovering
  const [isHovering, setIsHovering] = React.useState(false);
  const animationRef = React.useRef<number | null>(null);
  const lastMousePosition = React.useRef({ x: 0, y: 0 });
  const time = React.useRef(0);
  const direction = React.useRef(1); // 1 for right, -1 for left

  // Animation function that creates a flowing gradient movement
  const animateGradient = React.useCallback(() => {
    // Increment time for animation
    time.current += TIME_STEP;

    // Calculate the position with a wider range of motion
    const width = 600; // Width of movement
    const currentX = lastMousePosition.current.x;

    // Create a moving position that goes back and forth
    const newX = currentX + direction.current * MOVEMENT_SPEED;

    // Change direction when reaching bounds
    if (Math.abs(newX) > width) {
      direction.current *= -1; // Reverse direction
    }

    // Add some vertical movement using sine wave
    const verticalRange = 100;
    const newY = lastMousePosition.current.y + Math.sin(time.current * VERTICAL_SPEED) * verticalRange;

    // Update last position
    lastMousePosition.current.x = newX;

    // Update motion values with some randomness
    mouseX.set(newX + (Math.random() - 0.5) * 10); // Reduced random jitter
    mouseY.set(newY + (Math.random() - 0.5) * 10);

    // Continue animation loop if not hovering
    if (!isHovering) {
      animationRef.current = requestAnimationFrame(animateGradient);
    }
  }, [isHovering, mouseX, mouseY]);

  // Start animation on component mount and handle cleanup
  React.useEffect(() => {
    // Start the animation immediately
    animationRef.current = requestAnimationFrame(animateGradient);

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering, animateGradient]);

  // Modified mouse handlers to work with the automatic animation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(true);

    const rect = e.currentTarget.getBoundingClientRect();
    // Get mouse position relative to container center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    // Store the current position
    lastMousePosition.current = { x, y };

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
    // Animation will continue from last position with the new movement pattern

    // Resume the automatic animation
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animateGradient);
    }
  };

  return (
    <div
      className="flex h-[130px] items-center overflow-hidden px-4 sm:h-auto sm:px-0"
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
    >
      <svg width="100%" height="213" viewBox="0 0 932 213" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#2C2C2C" strokeLinejoin="round">
          <path
            d="M33.375 43V171H14.0625V43H33.375ZM164.813 43V171H147.062L82 77.125H80.8125V171H61.5V43H79.375L144.5 137H145.687V43H164.813ZM204.172 43L239.797 147.25H241.234L276.859 43H297.734L251.672 171H229.359L183.297 43H204.172ZM421.047 107C421.047 120.667 418.547 132.417 413.547 142.25C408.547 152.042 401.693 159.583 392.984 164.875C384.318 170.125 374.464 172.75 363.422 172.75C352.339 172.75 342.443 170.125 333.734 164.875C325.068 159.583 318.234 152.021 313.234 142.187C308.234 132.354 305.734 120.625 305.734 107C305.734 93.3333 308.234 81.6042 313.234 71.8125C318.234 61.9792 325.068 54.4375 333.734 49.1875C342.443 43.8958 352.339 41.25 363.422 41.25C374.464 41.25 384.318 43.8958 392.984 49.1875C401.693 54.4375 408.547 61.9792 413.547 71.8125C418.547 81.6042 421.047 93.3333 421.047 107ZM401.922 107C401.922 96.5833 400.234 87.8125 396.859 80.6875C393.526 73.5208 388.943 68.1042 383.109 64.4375C377.318 60.7292 370.755 58.875 363.422 58.875C356.047 58.875 349.464 60.7292 343.672 64.4375C337.88 68.1042 333.297 73.5208 329.922 80.6875C326.589 87.8125 324.922 96.5833 324.922 107C324.922 117.417 326.589 126.208 329.922 133.375C333.297 140.5 337.88 145.917 343.672 149.625C349.464 153.292 356.047 155.125 363.422 155.125C370.755 155.125 377.318 153.292 383.109 149.625C388.943 145.917 393.526 140.5 396.859 133.375C400.234 126.208 401.922 117.417 401.922 107ZM464.438 43V171H445.125V43H464.438ZM598.875 84.625H579.375C578.625 80.4583 577.229 76.7917 575.188 73.625C573.146 70.4583 570.646 67.7708 567.688 65.5625C564.729 63.3542 561.417 61.6875 557.75 60.5625C554.125 59.4375 550.271 58.875 546.188 58.875C538.813 58.875 532.208 60.7292 526.375 64.4375C520.583 68.1458 516 73.5833 512.625 80.75C509.292 87.9167 507.625 96.6667 507.625 107C507.625 117.417 509.292 126.208 512.625 133.375C516 140.542 520.604 145.958 526.437 149.625C532.271 153.292 538.833 155.125 546.125 155.125C550.167 155.125 554 154.583 557.625 153.5C561.292 152.375 564.604 150.729 567.563 148.562C570.521 146.396 573.021 143.75 575.062 140.625C577.146 137.458 578.583 133.833 579.375 129.75L598.875 129.812C597.833 136.104 595.813 141.896 592.813 147.187C589.854 152.438 586.042 156.979 581.375 160.812C576.75 164.604 571.458 167.542 565.5 169.625C559.542 171.708 553.042 172.75 546 172.75C534.917 172.75 525.042 170.125 516.375 164.875C507.708 159.583 500.875 152.021 495.875 142.187C490.917 132.354 488.438 120.625 488.438 107C488.438 93.3333 490.938 81.6042 495.938 71.8125C500.938 61.9792 507.771 54.4375 516.438 49.1875C525.104 43.8958 534.958 41.25 546 41.25C552.792 41.25 559.125 42.2292 565 44.1875C570.917 46.1042 576.229 48.9375 580.938 52.6875C585.646 56.3958 589.542 60.9375 592.625 66.3125C595.708 71.6458 597.792 77.75 598.875 84.625ZM621.984 171V43H702.234V59.625H641.297V98.625H698.047V115.187H641.297V154.375H702.984V171H621.984ZM728.031 171V43H747.344V154.375H805.344V171H728.031ZM808.047 43H829.984L863.422 101.187H864.797L898.234 43H920.172L873.734 120.75V171H854.484V120.75L808.047 43Z"
            fill="url(#text-gradient)"
            stroke="#2C2C2C"
          />
          <path d="M87 35H68L61 42.5H79.5L87 35ZM87 35L145.5 121" />
          <path d="M81 171.5L89 165V88" />
          <path d="M145 42.5L151 35H172M172 35L165.5 42.5M172 35V166L165 171.5" />
          <path d="M40 36H21L13.5 42.5H34M40 36L34 42.5M40 36V164L34 171.5V42.5" />
          <path d="M182.5 42.5L189 35H211.5M211.5 35L204.5 42.5M211.5 35L245.5 134M276.5 42.5L283 35H307.5M307.5 35L298.5 42.5M307.5 35L261 166L252 171.5" />
          <path d="M327.5 52.9999C334.333 43.9999 355.9 27.8999 387.5 35.4999C427 44.9999 430.949 95.7487 427.5 112.5C424 129.5 419.5 138.5 409 151M339 69C331.5 85.8333 323.7 124.1 352.5 142.5C358.5 146 381 151 393.5 139" />
          <path d="M470.5 36H451.5L444.618 42.5H465M470.5 36L465 42.5M470.5 36V164L465 171.5V42.5" />
          <path d="M506 57C514.833 44.3334 542 23.2 580 40C591.5 45.5 602.5 57 606.5 78L599.5 85M606.5 122.5H586L579 129.5H599L606.5 122.5ZM606.5 122.5C604.5 138.9 593.333 150.667 588 154.5M525 66C516.167 84.3333 506.9 126 540.5 146C553 152 573 145.5 577.5 135" />
          <path d="M709.5 35.5H628.5L621.5 42.5H702.5M709.5 35.5L702.5 42.5M709.5 35.5V53L702.5 60V42.5M649 115.5V147M649 147H710.5M649 147L642 154M710.5 147L703.5 154M710.5 147V164.5L703.5 172M649 60V91M649 91L641.5 98.5M649 91H705.5M705.5 91L698.5 98.5M705.5 91V108.5L698.5 116" />
          <path d="M727.5 42.5L734.5 35.5H755M755 35.5L748 42.5M755 35.5V147M755 147L748 154M755 147H813M813 147L805.5 154.5M813 147V164.5L806 171.5" />
          <path d="M807 42.5L814 35.5H837M837 35.5L830 42.5M837 35.5L869.5 91.5M898 42.5L907.5 35.5H931.5M931.5 35.5L921 42.5M931.5 35.5L881.5 120.5V164.5L874.5 171.5" />
        </g>
        <foreignObject x="0" y="0" width="100%" height="100%" overflow="visible" mask="url(#stroke-mask)">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="h-50 w-50 rounded-full blur-2xl"
              style={{
                background: `conic-gradient(from 0deg, red, orange, yellow, green, blue, indigo, violet, red)`,
                x: translateX,
                y: translateY,
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />
          </div>
        </foreignObject>
        <defs>
          <mask id="stroke-mask">
            <g stroke="white" strokeLinejoin="round" fill="none" opacity="0.6">
              <path
                d="M33.375 43V171H14.0625V43H33.375ZM164.813 43V171H147.062L82 77.125H80.8125V171H61.5V43H79.375L144.5 137H145.687V43H164.813ZM204.172 43L239.797 147.25H241.234L276.859 43H297.734L251.672 171H229.359L183.297 43H204.172ZM421.047 107C421.047 120.667 418.547 132.417 413.547 142.25C408.547 152.042 401.693 159.583 392.984 164.875C384.318 170.125 374.464 172.75 363.422 172.75C352.339 172.75 342.443 170.125 333.734 164.875C325.068 159.583 318.234 152.021 313.234 142.187C308.234 132.354 305.734 120.625 305.734 107C305.734 93.3333 308.234 81.6042 313.234 71.8125C318.234 61.9792 325.068 54.4375 333.734 49.1875C342.443 43.8958 352.339 41.25 363.422 41.25C374.464 41.25 384.318 43.8958 392.984 49.1875C401.693 54.4375 408.547 61.9792 413.547 71.8125C418.547 81.6042 421.047 93.3333 421.047 107ZM401.922 107C401.922 96.5833 400.234 87.8125 396.859 80.6875C393.526 73.5208 388.943 68.1042 383.109 64.4375C377.318 60.7292 370.755 58.875 363.422 58.875C356.047 58.875 349.464 60.7292 343.672 64.4375C337.88 68.1042 333.297 73.5208 329.922 80.6875C326.589 87.8125 324.922 96.5833 324.922 107C324.922 117.417 326.589 126.208 329.922 133.375C333.297 140.5 337.88 145.917 343.672 149.625C349.464 153.292 356.047 155.125 363.422 155.125C370.755 155.125 377.318 153.292 383.109 149.625C388.943 145.917 393.526 140.5 396.859 133.375C400.234 126.208 401.922 117.417 401.922 107ZM464.438 43V171H445.125V43H464.438ZM598.875 84.625H579.375C578.625 80.4583 577.229 76.7917 575.188 73.625C573.146 70.4583 570.646 67.7708 567.688 65.5625C564.729 63.3542 561.417 61.6875 557.75 60.5625C554.125 59.4375 550.271 58.875 546.188 58.875C538.813 58.875 532.208 60.7292 526.375 64.4375C520.583 68.1458 516 73.5833 512.625 80.75C509.292 87.9167 507.625 96.6667 507.625 107C507.625 117.417 509.292 126.208 512.625 133.375C516 140.542 520.604 145.958 526.437 149.625C532.271 153.292 538.833 155.125 546.125 155.125C550.167 155.125 554 154.583 557.625 153.5C561.292 152.375 564.604 150.729 567.563 148.562C570.521 146.396 573.021 143.75 575.062 140.625C577.146 137.458 578.583 133.833 579.375 129.75L598.875 129.812C597.833 136.104 595.813 141.896 592.813 147.187C589.854 152.438 586.042 156.979 581.375 160.812C576.75 164.604 571.458 167.542 565.5 169.625C559.542 171.708 553.042 172.75 546 172.75C534.917 172.75 525.042 170.125 516.375 164.875C507.708 159.583 500.875 152.021 495.875 142.187C490.917 132.354 488.438 120.625 488.438 107C488.438 93.3333 490.938 81.6042 495.938 71.8125C500.938 61.9792 507.771 54.4375 516.438 49.1875C525.104 43.8958 534.958 41.25 546 41.25C552.792 41.25 559.125 42.2292 565 44.1875C570.917 46.1042 576.229 48.9375 580.938 52.6875C585.646 56.3958 589.542 60.9375 592.625 66.3125C595.708 71.6458 597.792 77.75 598.875 84.625ZM621.984 171V43H702.234V59.625H641.297V98.625H698.047V115.187H641.297V154.375H702.984V171H621.984ZM728.031 171V43H747.344V154.375H805.344V171H728.031ZM808.047 43H829.984L863.422 101.187H864.797L898.234 43H920.172L873.734 120.75V171H854.484V120.75L808.047 43Z"
                fill="none"
              />
              <path d="M87 35H68L61 42.5H79.5L87 35ZM87 35L145.5 121" />
              <path d="M81 171.5L89 165V88" />
              <path d="M145 42.5L151 35H172M172 35L165.5 42.5M172 35V166L165 171.5" />
              <path d="M40 36H21L13.5 42.5H34M40 36L34 42.5M40 36V164L34 171.5V42.5" />
              <path d="M182.5 42.5L189 35H211.5M211.5 35L204.5 42.5M211.5 35L245.5 134M276.5 42.5L283 35H307.5M307.5 35L298.5 42.5M307.5 35L261 166L252 171.5" />
              <path d="M327.5 52.9999C334.333 43.9999 355.9 27.8999 387.5 35.4999C427 44.9999 430.949 95.7487 427.5 112.5C424 129.5 419.5 138.5 409 151M339 69C331.5 85.8333 323.7 124.1 352.5 142.5C358.5 146 381 151 393.5 139" />
              <path d="M470.5 36H451.5L444.618 42.5H465M470.5 36L465 42.5M470.5 36V164L465 171.5V42.5" />
              <path d="M506 57C514.833 44.3334 542 23.2 580 40C591.5 45.5 602.5 57 606.5 78L599.5 85M606.5 122.5H586L579 129.5H599L606.5 122.5ZM606.5 122.5C604.5 138.9 593.333 150.667 588 154.5M525 66C516.167 84.3333 506.9 126 540.5 146C553 152 573 145.5 577.5 135" />
              <path d="M709.5 35.5H628.5L621.5 42.5H702.5M709.5 35.5L702.5 42.5M709.5 35.5V53L702.5 60V42.5M649 115.5V147M649 147H710.5M649 147L642 154M710.5 147L703.5 154M710.5 147V164.5L703.5 172M649 60V91M649 91L641.5 98.5M649 91H705.5M705.5 91L698.5 98.5M705.5 91V108.5L698.5 116" />
              <path d="M727.5 42.5L734.5 35.5H755M755 35.5L748 42.5M755 35.5V147M755 147L748 154M755 147H813M813 147L805.5 154.5M813 147V164.5L806 171.5" />
              <path d="M807 42.5L814 35.5H837M837 35.5L830 42.5M837 35.5L869.5 91.5M898 42.5L907.5 35.5H931.5M931.5 35.5L921 42.5M931.5 35.5L881.5 120.5V164.5L874.5 171.5" />
            </g>
          </mask>
          <linearGradient id="text-gradient" x1="463" y1="4.18174e-06" x2="463" y2="171" gradientUnits="userSpaceOnUse">
            <stop stopColor="#09090B" />
            <stop offset="1" stopColor="#121212" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Footer;
