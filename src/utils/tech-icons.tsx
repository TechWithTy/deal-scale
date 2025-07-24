import {
	Braces,
	CloudCog,
	Code,
	Database,
	type LucideIcon,
	Server,
	Share2,
} from "lucide-react";

// Map technology names to their respective icons
export const getTechIcon = (techName: string): LucideIcon => {
	const normalizedName = techName.toLowerCase();

	// Frontend technologies
	if (normalizedName.includes("react") || normalizedName.includes("native"))
		return Braces;
	if (normalizedName.includes("node")) return Server;
	if (normalizedName.includes("python") || normalizedName.includes("tensor"))
		return Code;

	// Backend/Database technologies
	if (
		normalizedName.includes("sql") ||
		normalizedName.includes("mongo") ||
		normalizedName.includes("firebase")
	)
		return Database;

	// Cloud/DevOps technologies
	if (
		normalizedName.includes("aws") ||
		normalizedName.includes("azure") ||
		normalizedName.includes("cloud")
	)
		return CloudCog;

	// Blockchain/Web3 technologies
	if (
		normalizedName.includes("ethereum") ||
		normalizedName.includes("web3") ||
		normalizedName.includes("solidity")
	)
		return Share2;

	// Default icon for unmatched technologies
	return Code;
};
