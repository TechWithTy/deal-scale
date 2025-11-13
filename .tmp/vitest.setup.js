import "dotenv/config";
import "@testing-library/jest-dom";
const shouldEnableAdapter = process.env.USE_TEST_FRAMEWORK_ADAPTER === "true" || process.env.SKIP_TEST_FRAMEWORK_ADAPTER === "false";
if (shouldEnableAdapter) {
  const {
    default: nodeFetch,
    Headers: NodeHeaders,
    Request: NodeRequest,
    Response: NodeResponse
  } = await import("node-fetch");
  const ensureJestFacade = () => {
    if (typeof globalThis.jest !== "undefined") {
      return;
    }
    const vi = globalThis.vi;
    const expect = globalThis.expect;
    if (!vi || !expect) {
      return;
    }
    const moduleMockRegistry = /* @__PURE__ */ new Map();
    const mock = (specifier, factory, options) => {
      if (factory) {
        vi.mock(
          specifier,
          () => {
            const mockedModule = factory();
            moduleMockRegistry.set(specifier, mockedModule);
            return mockedModule;
          },
          options
        );
        return;
      }
      vi.mock(specifier, factory, options);
    };
    const requireMock = (specifier) => {
      if (!moduleMockRegistry.has(specifier)) {
        throw new Error(
          "Module has not been registered via jest.mock(). Provide a factory when mocking under Vitest so the adapter can expose it synchronously."
        );
      }
      return moduleMockRegistry.get(specifier);
    };
    const clearRegistry = () => moduleMockRegistry.clear();
    const jestFacade = {
      mock,
      mocked: vi.mocked.bind(vi),
      requireActual: () => {
        throw new Error(
          "jest.requireActual is not supported by the Vitest compatibility shim. Import the module directly instead."
        );
      },
      requireMock,
      resetModules: () => {
        clearRegistry();
        vi.resetModules();
      },
      setTimeout: vi.setTimeout.bind(vi),
      clearAllMocks: () => {
        clearRegistry();
        vi.clearAllMocks();
      },
      resetAllMocks: () => {
        clearRegistry();
        vi.resetAllMocks();
      },
      restoreAllMocks: () => {
        clearRegistry();
        vi.restoreAllMocks();
      },
      useFakeTimers: vi.useFakeTimers.bind(vi),
      useRealTimers: vi.useRealTimers.bind(vi),
      runOnlyPendingTimers: vi.runOnlyPendingTimers.bind(vi),
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
      clearAllTimers: vi.clearAllTimers.bind(vi),
      spyOn: vi.spyOn.bind(vi),
      fn: vi.fn.bind(vi),
      expect
    };
    globalThis.jest = jestFacade;
  };
  ensureJestFacade();
  if (typeof globalThis.fetch === "undefined") {
    globalThis.fetch = nodeFetch;
  }
  if (typeof globalThis.Request === "undefined") {
    globalThis.Request = NodeRequest;
    globalThis.Response = NodeResponse;
    globalThis.Headers = NodeHeaders;
  }
  afterAll(async () => {
    const agent = globalThis.fetch?.__agent;
    if (agent && typeof agent.destroy === "function") {
      agent.destroy();
    }
  });
}
