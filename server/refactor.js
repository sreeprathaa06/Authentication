const fs = require('fs');

const path = './controllers/authController.js';
let content = fs.readFileSync(path, 'utf8');

// Replace { message: "..." } with { success: false, message: "..." } for errors
content = content.replace(/res\.status\((4\d\d|5\d\d)\)\.json\(\{\s*message:/g, 'res.status($1).json({\n            success: false,\n            message:');
// Replace { message: "..." } with { success: true, message: "..." } for success
content = content.replace(/res\.status\((2\d\d)\)\.json\(\{\s*message:/g, 'res.status($1).json({\n            success: true,\n            message:');

fs.writeFileSync(path, content);
console.log('authController.js updated');

const middlewarePath = './middleware/validationMiddleware.js';
let mwContent = fs.readFileSync(middlewarePath, 'utf8');
mwContent = mwContent.replace(/message: "Validation failed"/g, 'success: false,\n            message: "Validation failed"');
fs.writeFileSync(middlewarePath, mwContent);
console.log('validationMiddleware.js updated');

const routesPath = './routes/authRoutes.js';
let routesContent = fs.readFileSync(routesPath, 'utf8');
routesContent = routesContent.replace(/res\.status\(200\)\.json\(\{\s*message:/g, 'res.status(200).json({\n            success: true,\n            message:');
fs.writeFileSync(routesPath, routesContent);
console.log('authRoutes.js updated');
