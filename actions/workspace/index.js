// src/actions/workspace/index.js
import * as workspaceActions from './workspace';
import * as cardActions from './card';
import * as boardActions from './board';

// Export namespaced objects
export const workspace = workspaceActions;
export const card = cardActions;
export const board = boardActions;
