import { agentProducts } from "@/data/products/agents";
import { mockProducts } from "@/data/products";
import { ProductCategory } from "@/types/products";

describe("agent marketplace catalog", () => {
        const agentCategory = ProductCategory.Agents;

        it("exposes dedicated agent product configurations", () => {
                expect(agentProducts.length).toBeGreaterThanOrEqual(3);

                for (const product of agentProducts) {
                        expect(Array.isArray(product.categories)).toBe(true);
                        expect(product.categories).toContain(agentCategory);
                        expect(product.types.length).toBeGreaterThan(0);

                        const agent = product.agent;

                        expect(agent).toBeDefined();
                        expect(agent?.type).toMatch(/phone|direct mail|social/);
                        expect(typeof agent?.isPublic).toBe("boolean");
                        expect(typeof agent?.isFree).toBe("boolean");
                        expect(agent?.priceMultiplier ?? 0).toBeGreaterThanOrEqual(1);
                        expect(agent?.priceMultiplier ?? 0).toBeLessThanOrEqual(5);
                        expect(agent?.billingCycle).toMatch(/monthly|one-time/);
                }
        });

        it("registers agents as a first-class product category", () => {
                const catalogAgents = mockProducts.filter((product) =>
                        product.categories.includes(agentCategory),
                );

                expect(catalogAgents.length).toBe(agentProducts.length);
                expect(catalogAgents.length).toBeGreaterThan(0);

                const agentSkus = new Set(agentProducts.map((product) => product.sku));
                const catalogSkus = new Set(catalogAgents.map((product) => product.sku));

                for (const sku of agentSkus) {
                        expect(catalogSkus.has(sku)).toBe(true);
                }
        });
});
