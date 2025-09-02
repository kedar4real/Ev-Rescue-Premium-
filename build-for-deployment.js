const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building EV Rescue Premium for deployment...');

// Step 1: Temporarily move API routes to avoid build issues
const apiDir = path.join(__dirname, 'src', 'app', 'api');
const tempApiDir = path.join(__dirname, 'temp-api');

if (fs.existsSync(apiDir)) {
  console.log('📁 Moving API routes temporarily...');
  if (fs.existsSync(tempApiDir)) {
    fs.rmSync(tempApiDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, tempApiDir);
}

try {
  // Step 2: Build the application
  console.log('🏗️ Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Restore API routes even if build fails
  if (fs.existsSync(tempApiDir)) {
    console.log('🔄 Restoring API routes...');
    fs.renameSync(tempApiDir, apiDir);
  }
  
  process.exit(1);
}

// Step 3: Restore API routes
if (fs.existsSync(tempApiDir)) {
  console.log('🔄 Restoring API routes...');
  fs.renameSync(tempApiDir, apiDir);
}

console.log('🎉 Build process completed!');
console.log('📦 Static files are ready in the "out" directory');
console.log('🌐 Ready for Firebase deployment!');
