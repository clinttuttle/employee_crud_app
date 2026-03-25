import sequelize from './src/config/db.js';

async function checkDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Show database info
    console.log(`📊 Database: ${sequelize.getDatabaseName()}`);
    console.log(`🏠 Host: ${sequelize.config.host}:${sequelize.config.port}`);

    // List all tables
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log('\n📋 Available tables:');
    if (tables.length === 0) {
      console.log('  ❌ No tables found in database');
    } else {
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`  ${index + 1}. ${tableName}`);
      });
    }

    // Check if employees table exists
    const employeeTableExists = tables.some(table =>
      Object.values(table)[0].toLowerCase() === 'employees'
    );

    if (employeeTableExists) {
      console.log('\n✅ Employees table found');

      // Show table structure
      const [columns] = await sequelize.query("DESCRIBE employees");
      console.log('\n🏗️  Employees table structure:');
      columns.forEach(column => {
        console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? '(required)' : '(optional)'}`);
      });

      // Show sample data
      const [rows] = await sequelize.query("SELECT COUNT(*) as count FROM employees");
      console.log(`\n📊 Records in employees table: ${rows[0].count}`);

    } else {
      console.log('\n❌ Employees table NOT found');
      console.log('\n💡 Checking for similar table names...');

      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        if (tableName.toLowerCase().includes('employee') ||
            tableName.toLowerCase().includes('emp') ||
            tableName.toLowerCase().includes('staff') ||
            tableName.toLowerCase().includes('user')) {
          console.log(`  🔍 Found similar table: ${tableName}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();