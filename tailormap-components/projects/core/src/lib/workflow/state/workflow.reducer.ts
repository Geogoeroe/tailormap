import { Action, createReducer, on } from '@ngrx/store';
import { initialWorkflowState,  WorkflowState } from './workflow.state';
import * as WorkflowActions from './workflow.actions';
import { WORKFLOW_ACTION } from './workflow-models';

const onSetAction = (state: WorkflowState, payload : { action: WORKFLOW_ACTION }): WorkflowState => ({
  ...state,
  action: payload.action,
});

const workflowReducerImpl = createReducer(
  initialWorkflowState,
  on(WorkflowActions.setAction, onSetAction),
);

export const workflowReducer = (state: WorkflowState | undefined, action: Action) => {
  return workflowReducerImpl(state, action);
}
