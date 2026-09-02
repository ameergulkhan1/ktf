// fix-all-admin.js
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing ALL admin API endpoints...\n');

// Find all service files
const serviceDir = path.join(process.cwd(), 'src/services/admin');

if (!fs.existsSync(serviceDir)) {
  console.log('❌ Admin services directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(serviceDir).filter(f => f.endsWith('.js'));

console.log(`📁 Found ${files.length} service files\n`);

files.forEach(file => {
  const filePath = path.join(serviceDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  console.log(`📝 Processing: ${file}`);
  
  // 1. Fix: Replace 'api/admin' with 'admin' (remove /api prefix)
  const patterns = [
    { find: "'/api/admin/", replace: "'/admin/" },
    { find: '"/api/admin/', replace: '"/admin/' },
    { find: "`/api/admin/", replace: "`/admin/" },
    { find: "'/api/commissions/", replace: "'/commissions/" },
    { find: '"/api/commissions/', replace: '"/commissions/' },
    { find: "`/api/commissions/", replace: "`/commissions/" },
    { find: "'/api/users/", replace: "'/users/" },
    { find: '"/api/users/', replace: '"/users/' },
    { find: "`/api/users/", replace: "`/users/" },
    { find: "'/api/vendors/", replace: "'/vendors/" },
    { find: '"/api/vendors/', replace: '"/vendors/' },
    { find: "`/api/vendors/", replace: "`/vendors/" },
    { find: "'/api/orders/", replace: "'/orders/" },
    { find: '"/api/orders/', replace: '"/orders/' },
    { find: "`/api/orders/", replace: "`/orders/" },
    { find: "'/api/products/", replace: "'/products/" },
    { find: '"/api/products/', replace: '"/products/' },
    { find: "`/api/products/", replace: "`/products/" },
    { find: "'/api/restaurants/", replace: "'/restaurants/" },
    { find: '"/api/restaurants/', replace: '"/restaurants/' },
    { find: "`/api/restaurants/", replace: "`/restaurants/" },
    { find: "'/api/auth/", replace: "'/auth/" },
    { find: '"/api/auth/', replace: '"/auth/' },
    { find: "`/api/auth/", replace: "`/auth/" },
    { find: "'/api/analytics/", replace: "'/analytics/" },
    { find: '"/api/analytics/', replace: '"/analytics/' },
    { find: "`/api/analytics/", replace: "`/analytics/" },
    { find: "'/api/dashboard/", replace: "'/dashboard/" },
    { find: '"/api/dashboard/', replace: '"/dashboard/' },
    { find: "`/api/dashboard/", replace: "`/dashboard/" },
    { find: "'/api/reports/", replace: "'/reports/" },
    { find: '"/api/reports/', replace: '"/reports/' },
    { find: "`/api/reports/", replace: "`/reports/" },
  ];
  
  patterns.forEach(pattern => {
    while (content.includes(pattern.find)) {
      content = content.replace(pattern.find, pattern.replace);
      changed = true;
    }
  });
  
  // 2. Fix: Remove duplicate slashes
  while (content.includes('//')) {
    content = content.replace(/\/\//g, '/');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Updated: ${file}`);
  } else {
    console.log(`  ⏭️ No changes needed: ${file}`);
  }
});

console.log('\n✅ All admin service files updated!');
console.log('\n📋 Correct endpoint format:');
console.log('  ✅ /admin/dashboard');
console.log('  ✅ /admin/users');
console.log('  ✅ /admin/vendors');
console.log('  ✅ /admin/orders');
console.log('  ✅ /admin/products');
console.log('  ✅ /admin/restaurants');
console.log('  ✅ /admin/commissions/overview');
console.log('  ✅ /auth/login');
console.log('  ✅ /auth/logout');
console.log('\n❌ INCORRECT (fixed):');
console.log('  ❌ /api/admin/dashboard');
console.log('  ❌ /api/api/admin/users');
console.log('  ❌ /api/admin/commissions/overview');