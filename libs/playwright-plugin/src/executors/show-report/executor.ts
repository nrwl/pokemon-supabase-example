import { ExecutorContext } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { getCwdForPlaywright } from '../utils';
import { ShowReportExecutorSchema } from './schema';

export default async function runExecutor(
  options: ShowReportExecutorSchema,
  context: ExecutorContext & { projectName: string }
) {
  const cwd = getCwdForPlaywright(context);
  execSync('playwright show-report playwright-report', {
    stdio: 'inherit',
    cwd,
  });
  return {
    success: true,
  };
}
