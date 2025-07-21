export const generateTasks = (scope, instructions) => {
  const baseTasks = [
    'Day 1: Site Prep',
    'Day 2: Materials Setup',
    `Milestone: ${scope ? scope.split(' ')[0] : 'Project'} Start`
  ];

  // Incorporate instructions
  if (instructions.difficulty > 5) baseTasks.push('Extra Day for Difficult Tasks');
  instructions.milestones?.forEach(m => baseTasks.push(`Milestone: ${m}`));
  if (instructions.dumpsterNeeded) baseTasks.push('Arrange Dumpster at ' + instructions.dumpsterLocation);
  if (instructions.permitsNeeded) baseTasks.push('Obtain Permits');
  if (instructions.architectNeeded) baseTasks.push('Consult Architect');

  baseTasks.push('Day 3: Initial Work', 'Milestone: Foundation Complete');
  return baseTasks;
};