export const generateTasks = (scope) => {
  // Simple simulation based on scope text
  const tasks = [
    'Day 1: Site Prep',
    'Day 2: Materials Setup',
    `Milestone: ${scope ? scope.split(' ')[0] : 'Project'} Start`,
    'Day 3: Initial Work',
    'Milestone: Foundation Complete'
  ];
  return tasks;
};