import type { AuthView } from "@/types/auth";
import { create } from "zustand";
import { AuthModal } from "./AuthModal";

interface AuthModalStore {
	isOpen: boolean;
	view: AuthView;
	onSuccess?: () => void;
	open: (view?: AuthView, onSuccess?: () => void) => void;
	close: () => void;
	setView: (view: AuthView) => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
	isOpen: false,
	view: "signin",
	onSuccess: undefined,
	open: (view: AuthView = "signin", onSuccess?: () => void) =>
		set({ isOpen: true, view, onSuccess }),
	close: () => set({ isOpen: false, onSuccess: undefined }),
	setView: (view) => set({ view }),
}));

// Helper hooks for common auth modal actions
export const useSignInModal = () => {
	const { open } = useAuthModal();
	return () => open("signin");
};

export const useSignUpModal = () => {
	const { open } = useAuthModal();
	return () => open("signup");
};

export const useResetPasswordModal = () => {
	const { open } = useAuthModal();
	return () => open("reset");
};
