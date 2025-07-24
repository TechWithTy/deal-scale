// In src/context/CategoryContext.ts
import { createContext, useContext, useState } from "react";

type CategoryContextType = {
	activeCategory: string;
	setActiveCategory: (category: string) => void;
};

export const CategoryContext = createContext<CategoryContextType>({
	activeCategory: "all",
	setActiveCategory: () => {},
});

export const CategoryProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const [activeCategory, setActiveCategory] = useState("all");
	return (
		<CategoryContext.Provider value={{ activeCategory, setActiveCategory }}>
			{children}
		</CategoryContext.Provider>
	);
};

export const useCategoryContext = () => useContext(CategoryContext);
