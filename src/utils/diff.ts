import { DiffLine } from '../types';

/**
 * Calculates a line-by-line diff between two text blocks
 */
export function computeLineDiff(original: string, modified: string): {
  diffs: DiffLine[];
  additions: number;
  deletions: number;
  unchanged: number;
} {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');

  const diffs: DiffLine[] = [];
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  // LCS Matrix algorithm for lines
  const n = origLines.length;
  const m = modLines.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (origLines[i] === modLines[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to assemble diffs
  let i = n;
  let j = m;
  const tempDiffs: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      tempDiffs.push({
        type: 'unchanged',
        oldLineNumber: i,
        newLineNumber: j,
        text: origLines[i - 1],
      });
      unchanged++;
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      tempDiffs.push({
        type: 'added',
        newLineNumber: j,
        text: modLines[j - 1],
      });
      additions++;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      tempDiffs.push({
        type: 'removed',
        oldLineNumber: i,
        text: origLines[i - 1],
      });
      deletions++;
      i--;
    }
  }

  tempDiffs.reverse();

  return {
    diffs: tempDiffs,
    additions,
    deletions,
    unchanged,
  };
}
