import { Todo, User } from './types';

export interface TaskStatistics {
  total: number;
  active: number;
  completed: number;
}

/**
 * Calculate task statistics from a list of tasks
 * @param tasks - Array of task objects
 * @returns TaskStatistics object with total, active, and completed counts
 */
export const calculateTaskStats = (tasks: Todo[]): TaskStatistics => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;

  return {
    total,
    active,
    completed
  };
};