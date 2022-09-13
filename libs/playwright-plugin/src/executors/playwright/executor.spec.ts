import { PlaywrightExecutorSchema } from './schema';
import executor from './executor';
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));
import { execSync } from 'child_process';

const mockContext = {
  workspace: { projects: { foo: { root: 'libs/foo' } } },
  projectName: 'foo',
} as any;

describe('Playwright Executor', () => {
  beforeEach(() => {
    (execSync as any) = jest.fn();
  });

  test('config', async () => {
    const options: PlaywrightExecutorSchema = {
      playwrightConfig: 'foo.config.js',
    };
    const output = await executor(options, mockContext);
    expectCommandToHaveBeenCalled('playwright test -c foo.config.js');
    expect(output.success).toBe(true);
  });

  test('project option', async () => {
    const options: PlaywrightExecutorSchema = {
      project: 'bar',
    };
    const output = await executor(options, mockContext);
    expectCommandToHaveBeenCalled('playwright test --project=bar');
    expect(output.success).toBe(true);
  });

  test('empty options', async () => {
    const options: PlaywrightExecutorSchema = {};
    const output = await executor(options, mockContext);
    expectCommandToHaveBeenCalled('playwright test');
    expect(output.success).toBe(true);
  });

  test('debug mode', async () => {
    const options: PlaywrightExecutorSchema = { debug: true };
    const output = await executor(options, mockContext);
    expectCommandToHaveBeenCalled('playwright test --debug');
    expect(output.success).toBe(true);
  });
});

function expectCommandToHaveBeenCalled(
  expectedCommandLineText: string,
  cwd = 'libs/foo'
) {
  // const actualCommandLineText = (execSync as any).mock.calls[0][0];
  // console.log(actualCommandLineText);
  expect(execSync).toHaveBeenCalledWith(expectedCommandLineText, {
    stdio: 'inherit',
    cwd,
  });
}
