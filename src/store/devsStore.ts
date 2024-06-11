import { create } from "zustand";

const loadCompiler = async () => {
  if (typeof window !== "undefined") {
    const module = await import("@kittenbot/devs_compiler");
    return module.compileWithHost;
  }
};

export const useDevsStore = create<{
  code: string;
  params: Record<string, string>;
  setCode: (code: string) => void;
  setParams: (params: Record<string, string>) => void;
  compileWithHost: (code?: string) => Promise<any>;
  compiler: any;
}>((set, get) => {
  const devsState = {
    code: "// Write your code here",
    params: {},
    setCode: (code: string) => set({ code }),
    setParams: (params) => set({ params }),
    compileWithHost: null,
    compiler: null,
  };

  loadCompiler().then((compiler) => {
    const compileWithHost = async (userCode) => {
      const { code, params } = get();
      if (!compiler) {
        console.error("Compiler not loaded");
        return;
      }
      const { DevsHost } = await import("../lib/DevsHost");
      let _code = userCode || code;
      for (const key in params) {
        const value = params[key];
        _code = code.replace(new RegExp(`\\$${key}`, "g"), value);
      }
      console.log("download", _code);
      const host = new DevsHost({
        hwInfo: {
          // progName: "DeviceScript-workspace devs/hello",
          // progVersion: "6.0.0",
        },
        files: {
          "src/main.ts": _code,
        },
      });
      const result = compiler("src/main.ts", host);
      return result;
    };
    set({ compiler, compileWithHost });
  });

  return devsState;
});
