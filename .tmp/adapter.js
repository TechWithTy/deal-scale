const moduleMockRegistry = /* @__PURE__ */ new Map();
const isVitest = () => typeof globalThis.vi !== "undefined";
const resolveExistingJest = () => {
  if (typeof globalThis.jest !== "undefined") {
    return globalThis.jest;
  }
  const globalRequire = (() => {
    try {
      return eval("require");
    } catch {
      return void 0;
    }
  })();
  if (typeof globalRequire === "function") {
    try {
      const { jest } = globalRequire("@jest/globals");
      return jest;
    } catch {
      return void 0;
    }
  }
  return void 0;
};
const createVitestFacade = () => {
  const vi = globalThis.vi;
  const expect = globalThis.expect;
  if (!vi || !expect) {
    throw new Error(
      "Vitest globals were not detected. Ensure Vitest runs with the --globals flag."
    );
  }
  const fn = (impl) => vi.fn(impl);
  const mocked = (item) => vi.mocked(item);
  const mock = (modulePath, factory, options) => {
    if (factory) {
      vi.mock(
        modulePath,
        () => {
          const mockedModule = factory();
          moduleMockRegistry.set(modulePath, mockedModule);
          return mockedModule;
        },
        options
      );
      return;
    }
    vi.mock(modulePath, factory, options);
  };
  const requireActual = (modulePath) => {
    throw new Error(
      "jest.requireActual is not supported by the Vitest compatibility shim. Import the module directly instead."
    );
  };
  const requireMock = (modulePath) => {
    if (moduleMockRegistry.has(modulePath)) {
      return moduleMockRegistry.get(modulePath);
    }
    throw new Error(
      "Module has not been registered via jest.mock(). Provide a factory when mocking under Vitest so the adapter can expose it synchronously."
    );
  };
  const resetRegistry = () => moduleMockRegistry.clear();
  return {
    mock,
    mocked,
    requireActual,
    requireMock,
    resetModules: () => {
      resetRegistry();
      vi.resetModules();
    },
    setTimeout: vi.setTimeout.bind(vi),
    clearAllMocks: () => {
      resetRegistry();
      vi.clearAllMocks();
    },
    resetAllMocks: () => {
      resetRegistry();
      vi.resetAllMocks();
    },
    restoreAllMocks: () => {
      resetRegistry();
      vi.restoreAllMocks();
    },
    useFakeTimers: vi.useFakeTimers.bind(vi),
    useRealTimers: vi.useRealTimers.bind(vi),
    runOnlyPendingTimers: vi.runOnlyPendingTimers.bind(vi),
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    clearAllTimers: vi.clearAllTimers.bind(vi),
    spyOn: vi.spyOn.bind(vi),
    fn,
    expect
  };
};
const jestLike = (() => {
  if (!isVitest()) {
    const existing = resolveExistingJest();
    if (!existing) {
      throw new Error(
        "Neither Jest nor Vitest detected. Unified test framework adapter requires one of them."
      );
    }
    if (typeof globalThis.jest === "undefined") {
      globalThis.jest = existing;
    }
    return existing;
  }
  return createVitestFacade();
})();
if (typeof globalThis.jest === "undefined") {
  globalThis.jest = jestLike;
}
console.info("[test-framework-adapter] loaded", {
  isVitest: typeof globalThis.vi !== "undefined",
  jestDefined: typeof globalThis.jest !== "undefined"
});
const testFramework = jestLike;
export {
  testFramework
};
//# sourceMappingURL=adapter.js.map
