try {
  const pg = require('pg');
  console.log('pg is available');
} catch (e) {
  console.log('pg is not available');
}
