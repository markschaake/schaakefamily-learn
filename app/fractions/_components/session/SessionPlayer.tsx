'use client';

import { useReducer, useEffect, useRef } from 'react';
import { sessionReducer, initialState } from './session-reducer';
import { buildSession } from '../../_lib/problems/session-builder';
import { writeProgress } from '../../_lib/storage/progress';
import { playChime, AnswerFeedback } from '../feedback';
import { RulePanel } from '../rule-panel';
import { QuestionHost } from '../questions';
import { ProgressIndicator } from './ProgressIndicator';
import { SessionSummary } from './SessionSummary';
import { PageShell } from './PageShell';

export function SessionPlayer() {
  const [state, dispatch] = useReducer(
    sessionReducer,
    undefined,
    () => initialState(buildSession(), new Date().toISOString()),
  );

  // Effect 1: persist progress exactly once when the session enters 'summary'.
  // A useRef boolean guards against double-writes (React StrictMode, re-renders).
  const persistedRef = useRef(false);
  useEffect(() => {
    if (state.phase === 'summary' && !persistedRef.current) {
      persistedRef.current = true;
      writeProgress(state.counts);
    }
  }, [state.phase, state.counts]);

  // Effect 2: play chime whenever correctTick increments.
  const prevTickRef = useRef(state.correctTick);
  useEffect(() => {
    if (state.correctTick > prevTickRef.current) {
      playChime();
    }
    prevTickRef.current = state.correctTick;
  }, [state.correctTick]);

  // Effect 3: dispatch REBUILT when pendingRebuild is set (after RESTART).
  useEffect(() => {
    if (state.pendingRebuild) {
      // Reset the persist guard so the next session's summary can be written.
      persistedRef.current = false;
      dispatch({
        type: 'REBUILT',
        problems: buildSession(),
        startedAt: new Date().toISOString(),
      });
    }
  }, [state.pendingRebuild]);

  // Effect 4: auto-advance from 'correct' phase after 800 ms.
  useEffect(() => {
    if (state.phase === 'correct') {
      const id = setTimeout(() => {
        dispatch({ type: 'ADVANCE_FROM_CORRECT' });
      }, 800);
      return () => clearTimeout(id);
    }
  }, [state.phase, state.index]);

  const current = state.problems[state.index];

  // --- Summary screen ---
  if (state.phase === 'summary') {
    return (
      <PageShell>
        <SessionSummary
          counts={state.counts}
          onRestart={() => dispatch({ type: 'RESTART' })}
        />
      </PageShell>
    );
  }

  // --- Active question screen ---
  const showQuestion = state.phase === 'question' || state.phase === 'retry';
  const feedbackOutcome =
    state.phase === 'correct'
      ? ('correct' as const)
      : state.phase === 'retry'
        ? ('retry' as const)
        : state.phase === 'reveal'
          ? ('reveal' as const)
          : null;

  return (
    <PageShell>
      <RulePanel highlighted={state.phase === 'correct'} />
      {/* pt-28 clears the fixed RulePanel; safe-area inset already applied by RulePanel itself */}
      <div className="pt-28 flex flex-col items-center gap-6 pb-12">
        <ProgressIndicator total={state.problems.length} current={state.index} />

        {showQuestion && current && (
          <QuestionHost
            key={`${state.index}-${state.attemptKey}`}
            problem={current}
            onAnswer={(answer) => dispatch({ type: 'SUBMIT_ANSWER', answer })}
          />
        )}

        {feedbackOutcome && current && state.lastAnswer && (
          <AnswerFeedback
            problem={current}
            userAnswer={state.lastAnswer}
            outcome={feedbackOutcome}
            onContinue={
              state.phase === 'reveal'
                ? () => dispatch({ type: 'CONTINUE' })
                : undefined
            }
          />
        )}
      </div>
    </PageShell>
  );
}
