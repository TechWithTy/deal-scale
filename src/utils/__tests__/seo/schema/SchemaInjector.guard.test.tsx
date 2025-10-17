import { renderToStaticMarkup } from "react-dom/server.node";

import { SchemaInjector } from "@/utils/seo/schema";

describe("SchemaInjector client guard", () => {
        const originalNodeEnv = process.env.NODE_ENV;
        const originalJestWorkerId = process.env.JEST_WORKER_ID;

        afterEach(() => {
                process.env.NODE_ENV = originalNodeEnv;
                if (originalJestWorkerId === undefined) {
                        delete process.env.JEST_WORKER_ID;
                } else {
                        process.env.JEST_WORKER_ID = originalJestWorkerId;
                }
        });

        it("throws when rendered in a browser context outside of test environments", () => {
                process.env.NODE_ENV = "production";
                delete process.env.JEST_WORKER_ID;

                expect(() =>
                        renderToStaticMarkup(
                                <SchemaInjector
                                        schema={{
                                                "@context": "https://schema.org",
                                                "@type": "TestSchema",
                                                name: "Client guard",
                                        }}
                                />,
                        ),
                ).toThrowError("SchemaInjector must be rendered on the server only.");
        });
});
