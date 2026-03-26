import sequelize from './src/config/db.js';

async function addPhoneColumn() {
  try {
    console.log('🔧 Adding phone column to employees table...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Add phone column to existing employees table
    await sequelize.getQueryInterface().addColumn('employees', 'phone', {
      type: sequelize.Sequelize.DataTypes.STRING(20),
      allowNull: true,
    });

    console.log('✅ Phone column added successfully');

    // Verify column was added
    console.log('\n🏗️  Updated employees table structure:');
    const [columns] = await sequelize.query("DESCRIBE employees");
    columns.forEach(column => {
      const required = column.Null === 'NO' ? '(required)' : '(optional)';
      const key = column.Key === 'PRI' ? ' PRIMARY KEY' : column.Key === 'UNI' ? ' UNIQUE' : '';
      console.log(`  - ${column.Field}: ${column.Type} ${required}${key}`);
    });

    console.log('\n🎉 Phone column migration complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await sequelize.close();
  }
}

addPhoneColumn();