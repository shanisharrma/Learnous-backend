'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { IPaymentCourseAttributes } from '../../types';

type TPaymentCourseCreationAttributes = Optional<IPaymentCourseAttributes, 'id'>;

class Payment_Course
    extends Model<IPaymentCourseAttributes, TPaymentCourseCreationAttributes>
    implements IPaymentCourseAttributes
{
    public id!: number;
    public courseId!: number;
    public paymentId!: string;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
    public readonly deletedAt?: Date | undefined;
}
Payment_Course.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        paymentId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize: connection,
        modelName: 'Payment_Course',
    },
);

export default Payment_Course;
