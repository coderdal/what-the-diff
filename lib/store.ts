import { create } from "zustand";

export type DiffGranularity = "lines" | "words" | "chars";
export type ViewMode = "split" | "unified";

export interface DiffOptions {
  granularity: DiffGranularity;
  ignoreWhitespace: boolean;
  caseSensitive: boolean;
  collapseUnchanged: boolean;
  contextLines: number;
}

interface DiffStore {
  original: string;
  modified: string;
  language: string;
  viewMode: ViewMode;
  options: DiffOptions;
  hasResult: boolean;
  // Actions
  setOriginal: (val: string) => void;
  setModified: (val: string) => void;
  setLanguage: (lang: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setOptions: (opts: Partial<DiffOptions>) => void;
  clear: () => void;
}

const DEFAULT_OPTIONS: DiffOptions = {
  granularity: "lines",
  ignoreWhitespace: false,
  caseSensitive: true,
  collapseUnchanged: false,
  contextLines: 3,
};

const SAMPLE_ORIGINAL = `function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return message;
}

const result = greet("World");
console.log(result);`;

const SAMPLE_MODIFIED = `function greet(name, greeting = "Hello") {
  const message = \`\${greeting}, \${name}!\`;
  console.log(message);
  return message;
}

// Add a farewell function
function farewell(name) {
  return \`Goodbye, \${name}!\`;
}

const result = greet("World", "Hi");
console.log(result);`;

export const useDiffStore = create<DiffStore>((set) => ({
  original: SAMPLE_ORIGINAL,
  modified: SAMPLE_MODIFIED,
  language: "javascript",
  viewMode: "split",
  hasResult: true,
  options: DEFAULT_OPTIONS,

  setOriginal: (val) => set({ original: val, hasResult: val.length > 0 }),
  setModified: (val) => set({ modified: val, hasResult: val.length > 0 }),
  setLanguage: (lang) => set({ language: lang }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setOptions: (opts) =>
    set((state) => ({ options: { ...state.options, ...opts } })),
  clear: () =>
    set({
      original: "",
      modified: "",
      hasResult: false,
    }),
}));
