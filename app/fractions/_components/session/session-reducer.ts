import type { Problem, Answer, QuestionType } from '../../_lib/problems/types';
import type { SessionRecord, PerTypeCounts } from '../../_lib/storage/progress';
import { isCorrect } from './answer-check';

export type Phase = 'question' | 'correct' | 'retry' | 'reveal' | 'summary';

export interface SessionState {
  problems: Problem[]; // length SESSION_LENGTH
  index: number; // 0..problems.length-1; equals problems.length when summary
  phase: Phase;
  attemptKey: number; // bumps on transition to 'retry'
  lastAnswer: Answer | null;
  counts: SessionRecord;
  correctTick: number; // monotonic; bumped whenever a correct submit occurs, to trigger the chime effect
  pendingRebuild: boolean; // set by RESTART; cleared by the player's effect that calls buildSession again
}

export type SessionAction =
  | { type: 'SUBMIT_ANSWER'; answer: Answer }
  | { type: 'ADVANCE_FROM_CORRECT' }
  | { type: 'CONTINUE' }
  | { type: 'RESTART' }
  | { type: 'REBUILT'; problems: Problem[]; startedAt: string };

export function emptyByType(): Record<QuestionType, PerTypeCounts> {
  return {
    'visual-to-fraction': { correctFirstTry: 0, correctOnRetry: 0, incorrect: 0 },
    'fraction-to-number-line': { correctFirstTry: 0, correctOnRetry: 0, incorrect: 0 },
    'word-to-visual': { correctFirstTry: 0, correctOnRetry: 0, incorrect: 0 },
  };
}

export function initialState(problems: Problem[], startedAt: string): SessionState {
  return {
    problems,
    index: 0,
    phase: 'question',
    attemptKey: 0,
    lastAnswer: null,
    counts: {
      date: startedAt,
      correctFirstTry: 0,
      correctOnRetry: 0,
      incorrect: 0,
      byQuestionType: emptyByType(),
    },
    correctTick: 0,
    pendingRebuild: false,
  };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SUBMIT_ANSWER': {
      const current = state.problems[state.index];
      if (!current) return state;
      const correct = isCorrect(current, action.answer);

      if (state.phase === 'question') {
        if (correct) return advanceAfterCorrect(state, 'firstTry', action.answer);
        return {
          ...state,
          phase: 'retry',
          attemptKey: state.attemptKey + 1,
          lastAnswer: action.answer,
        };
      }
      if (state.phase === 'retry') {
        if (correct) return advanceAfterCorrect(state, 'onRetry', action.answer);
        // Second wrong → reveal, count as incorrect.
        const qt = current.questionType;
        return {
          ...state,
          phase: 'reveal',
          lastAnswer: action.answer,
          counts: {
            ...state.counts,
            incorrect: state.counts.incorrect + 1,
            byQuestionType: bump(state.counts.byQuestionType, qt, 'incorrect'),
          },
        };
      }
      return state;
    }
    case 'ADVANCE_FROM_CORRECT': {
      if (state.phase !== 'correct') return state;
      return moveToNextOrSummary(state);
    }
    case 'CONTINUE': {
      if (state.phase !== 'reveal') return state;
      return moveToNextOrSummary(state);
    }
    case 'RESTART': {
      return { ...state, pendingRebuild: true };
    }
    case 'REBUILT': {
      return initialState(action.problems, action.startedAt);
    }
  }
}

function advanceAfterCorrect(
  state: SessionState,
  tryKind: 'firstTry' | 'onRetry',
  answer: Answer,
): SessionState {
  const current = state.problems[state.index]!;
  const qt = current.questionType;
  const field = tryKind === 'firstTry' ? 'correctFirstTry' : 'correctOnRetry';
  return {
    ...state,
    phase: 'correct',
    lastAnswer: answer,
    correctTick: state.correctTick + 1,
    counts: {
      ...state.counts,
      [field]: state.counts[field] + 1,
      byQuestionType: bump(state.counts.byQuestionType, qt, field),
    },
  };
}

function moveToNextOrSummary(state: SessionState): SessionState {
  const nextIndex = state.index + 1;
  if (nextIndex >= state.problems.length) {
    return { ...state, index: nextIndex, phase: 'summary' };
  }
  return { ...state, index: nextIndex, phase: 'question', attemptKey: 0, lastAnswer: null };
}

function bump(
  byType: Record<QuestionType, PerTypeCounts>,
  qt: QuestionType,
  field: keyof PerTypeCounts,
): Record<QuestionType, PerTypeCounts> {
  const current = byType[qt]!;
  return { ...byType, [qt]: { ...current, [field]: current[field] + 1 } };
}
