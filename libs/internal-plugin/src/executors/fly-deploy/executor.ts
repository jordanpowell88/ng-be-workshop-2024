import { PromiseExecutor } from '@nx/devkit';
import { FlyDeployExecutorSchema } from './schema';
import { execSync } from 'child_process';

const runExecutor: PromiseExecutor<FlyDeployExecutorSchema> = async (
  options
) => {
  const cwd = options.distLocation;
  
  const results = execSync(`flyctl apps list`);

  try {
    if (results.toString().includes(options.flyAppName)) {
      execSync(`flyctl deploy`, { cwd, stdio: 'inherit' });
    } else {
      execSync(`flyctl launch --now --name=${options.flyAppName} --yes --copy-config --region=atl`, { cwd, stdio: 'inherit' })
    }
    return {
      success: true,
    };
  } catch (e) {
    console.error('Deployment failed', e);
    return {
      success: false,
    };
  }
};

export default runExecutor;
