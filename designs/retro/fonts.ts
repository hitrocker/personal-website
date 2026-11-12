import { Courier_Prime, Space_Grotesk, Space_Mono, VT323 } from "next/font/google";

// Typefaces from the Stitch "Retro Terminal OS" design system (see ./stitch-export/DESIGN.md).
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], weight: ["500", "700"] });
const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"] });
const courierPrime = Courier_Prime({ variable: "--font-courier-prime", subsets: ["latin"], weight: ["400", "700"] });
const vt323 = VT323({ variable: "--font-vt323", subsets: ["latin"], weight: "400" });

/** CSS variables for all retro fonts; apply to the element that wraps the retro desktop. */
export const retroFontVariables = [spaceGrotesk, spaceMono, courierPrime, vt323].map((font) => font.variable).join(" ");
