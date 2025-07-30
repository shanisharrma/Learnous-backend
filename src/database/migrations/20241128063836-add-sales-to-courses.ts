'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.addColumn('Courses', 'sales', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    });
}
export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Courses', 'sales');
}
