import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("next/navigation", () => ({
        useRouter: () => ({ push: jest.fn() }),
        useSearchParams: () => new URLSearchParams(""),
}));

jest.mock("@/components/blog/BlogCard", () => ({
        BlogCard: () => <div data-testid="blog-card">Mock BlogCard</div>,
}));

describe("BlogGrid", () => {
        it("renders without crashing when no posts are available", () => {
                const { default: BlogGrid } = require("@/components/blog/BlogGrid");
                render(<BlogGrid posts={[]} />);

                expect(
                        screen.getByText(/No posts found/i),
                ).toBeInTheDocument();
        });
});
