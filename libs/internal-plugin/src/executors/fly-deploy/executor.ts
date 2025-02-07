import { PromiseExecutor } from '@nx/devkit';
import { FlyDeployExecutorSchema } from './schema';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

const runExecutor: PromiseExecutor<FlyDeployExecutorSchema> = async (
  options
) => {
  const cwd = options.distLocation;
  
  // Load environment variables from .local.env
  dotenv.config({ path: path.join(process.cwd(), 'apps/movies-api/.local.env') });

  // Set the FLY_API_TOKEN in the environment
  if (!process.env.FLY_API_TOKEN) {
    console.error('FLY_API_TOKEN not found in environment variables');
    return { success: false };
  }

  const results = execSync(`flyctl apps list`, {
    env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
  });

  console.log(results.toString());

  try {
    if (results.toString().includes(options.flyAppName)) {
      execSync(`flyctl deploy`, { 
        cwd, 
        stdio: 'inherit',
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
    } else {
      execSync(`flyctl launch --now --name=${options.flyAppName} --yes --copy-config --region=atl`, { 
        cwd, 
        stdio: 'inherit',
        env: { ...process.env, FLY_API_TOKEN: process.env.FLY_API_TOKEN }
      });
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
