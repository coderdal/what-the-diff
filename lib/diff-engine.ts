import { diffLines, diffWords, diffChars, Change } from 'diff';
import { DiffGranularity, DiffOptions } from './store';

export interface DiffChunk {
  value: string;
  added?: boolean;
  removed?: boolean;
  count?: number;
}

export interface DiffStats {
  additions: number;
  deletions: number;
  unchanged: number;
  totalChanges: number;
}

export function computeDiff(
  original: string,
  modified: string,
  options: DiffOptions
): DiffChunk[] {
  let a = original;
  let b = modified;

  if (!options.caseSensitive) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  const diffOpts = { ignoreWhitespace: options.ignoreWhitespace };

  let changes: Change[];
  switch (options.granularity) {
    case 'words':
      // @ts-expect-error Types in @types/diff might slightly differ
      changes = diffWords(a, b, diffOpts);
      break;
    case 'chars':
      // @ts-expect-error Types in @types/diff might slightly differ
      changes = diffChars(a, b, diffOpts);
      break;
    case 'lines':
    default:
      changes = diffLines(a, b, diffOpts);
      break;
  }

  return changes;
}

export function computeStats(chunks: DiffChunk[]): DiffStats {
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const chunk of chunks) {
    const lines = chunk.value.split('\n').filter((l) => l.length > 0).length;
    if (chunk.added) {
      additions += lines;
    } else if (chunk.removed) {
      deletions += lines;
    } else {
      unchanged += lines;
    }
  }

  return {
    additions,
    deletions,
    unchanged,
    totalChanges: additions + deletions,
  };
}

export function buildUnifiedPatch(original: string, modified: string): string {
  const chunks = computeDiff(original, modified, {
    granularity: 'lines',
    ignoreWhitespace: false,
    caseSensitive: true,
    collapseUnchanged: false,
    contextLines: 3,
  });

  const lines: string[] = ['--- original', '+++ modified'];

  for (const chunk of chunks) {
    const chunkLines = chunk.value.split('\n');
    // Remove trailing empty string from split
    if (chunkLines[chunkLines.length - 1] === '') chunkLines.pop();

    for (const line of chunkLines) {
      if (chunk.added) {
        lines.push(`+${line}`);
      } else if (chunk.removed) {
        lines.push(`-${line}`);
      } else {
        lines.push(` ${line}`);
      }
    }
  }

  return lines.join('\n');
}
