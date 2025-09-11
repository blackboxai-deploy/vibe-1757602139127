import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
      },
      checks: {
        fileSystem: await checkFileSystem(),
        api: true, // If we reach this point, API is working
      }
    };

    return NextResponse.json(checks);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

async function checkFileSystem(): Promise<boolean> {
  try {
    // Check if we can create temporary directories
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const tempDir = path.join(process.cwd(), 'temp');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const outputsDir = path.join(process.cwd(), 'outputs');

    // Check if directories exist and are writable
    await Promise.all([
      fs.access(tempDir).catch(() => fs.mkdir(tempDir, { recursive: true })),
      fs.access(uploadsDir).catch(() => fs.mkdir(uploadsDir, { recursive: true })),
      fs.access(outputsDir).catch(() => fs.mkdir(outputsDir, { recursive: true })),
    ]);

    return true;
  } catch (error) {
    console.error('File system check failed:', error);
    return false;
  }
}