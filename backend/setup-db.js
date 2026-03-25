import sequelize from './src/config/db.js';
import Employee from './src/models/Employee.js';

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Create tables (sync without force since database is empty)
    console.log('📋 Creating employees table...');
    await Employee.sync();
    console.log('✅ Employees table created successfully');

    // Verify table creation
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log('\n📋 Tables now in database:');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`  ${index + 1}. ${tableName}`);
    });

    // Show table structure
    console.log('\n🏗️  Employees table structure:');
    const [columns] = await sequelize.query("DESCRIBE employees");
    columns.forEach(column => {
      const required = column.Null === 'NO' ? '(required)' : '(optional)';
      const key = column.Key === 'PRI' ? ' PRIMARY KEY' : column.Key === 'UNI' ? ' UNIQUE' : '';
      console.log(`  - ${column.Field}: ${column.Type} ${required}${key}`);
    });

    // Insert sample data for testing
    console.log('\n📊 Inserting sample employee data...');
    const sampleEmployees = [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@company.com',
        birthdate: '1990-05-15',
        salary: 75000.00,
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@company.com',
        birthdate: '1985-08-22',
        salary: 85000.00,
      },
      {
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob.johnson@company.com',
        birthdate: '1992-12-03',
        salary: 65000.00,
      },
      {
        first_name: 'Alice',
        last_name: 'Williams',
        email: 'alice.williams@company.com',
        birthdate: null, // Testing optional field
        salary: null,    // Testing optional field
      },
    ];

    for (const employeeData of sampleEmployees) {
      await Employee.create(employeeData);
      console.log(`  ✅ Created: ${employeeData.first_name} ${employeeData.last_name}`);
    }

    // Show final count
    const count = await Employee.count();
    console.log(`\n🎉 Database setup complete! ${count} sample employees added.`);

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();