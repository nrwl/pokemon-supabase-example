import { PlaywrightExecutorSchema } from './schema';
import { execSync } from 'child_process';
import { getCwdForPlaywright } from '../utils';
import { ExecutorContext } from '@nrwl/devkit';

export default async function runExecutor(
  options: PlaywrightExecutorSchema,
  context: ExecutorContext & { projectName: string }
) {
  const cwd = getCwdForPlaywright(context);
  const args = argsFromOptions(options);
  const command = ['playwright', 'test'].concat(args).join(' ');
  console.log(cwd);
  execSync(command, { stdio: 'inherit', cwd });
  return { success: true };
}

function argsFromOptions(options: PlaywrightExecutorSchema): string[] {
  const args = [];
  if (options.playwrightConfig) {
    args.push('-c', options.playwrightConfig);
  }
  if (options.project) {
    args.push(`--project=${options.project}`);
  }
  if (options.debug) {
    args.push('--debug');
  }
  if (options.timeout != null) {
    args.push(`--timeout=${options.timeout}`);
  }
  return args;
}
