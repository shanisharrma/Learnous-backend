'use strict';

import { DataTypes, QueryInterface } from 'sequelize';
import { Enums } from '../../utils/constants';

const { FAILED, PENDING, SUCCEEDED } = Enums.EPaymentStatus;
const { RAZORPAY, STRIPE } = Enums.EPaymentMethod;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
        await queryInterface.createTable('Payments', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            provider: {
                type: Sequelize.ENUM,
                values: [STRIPE, RAZORPAY],
                allowNull: false,
            },
            orderId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            amount: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            currency: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM,
                values: [PENDING, SUCCEEDED, FAILED],
                allowNull: false,
                defaultValue: PENDING,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            paymentId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface: QueryInterface) {
        await queryInterface.dropTable('Payments');
    },
};
