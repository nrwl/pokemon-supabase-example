export function getCwdForPlaywright(context: {
    workspace: {
      projects: Record<string, { root: string }>;
    };
    projectName: string;
  }) {
    return context.workspace.projects[context.projectName].root;
  }
  