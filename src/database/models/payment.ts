'use strict';

import {
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import connection from '../sequelize';
import { ICourseAttributes, IPaymentAttributes, IUserAttributes } from '../../types';
import Course from './course';

type TPaymentCreationAttributes = Optional<IPaymentAttributes, 'id'>;

class Payment extends Model<IPaymentAttributes, TPaymentCreationAttributes> implements IPaymentAttributes {
    public id!: string;
    public userId!: number;
    public provider!: 'stripe' | 'razorpay';
    public orderId!: string;
    public amount!: number;
    public status!: 'pending' | 'succeeded' | 'failed';
    public currency!: string;
    public paymentId?: string | undefined;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
    public readonly deletedAt?: Date | undefined;

    // Associations
    public courses?: ICourseAttributes[] | undefined;
    public students?: IUserAttributes | undefined;

    // Association hooks
    declare addCourse: BelongsToManyAddAssociationMixin<Course, Course['id']>;
    declare getCourses: BelongsToManyGetAssociationsMixin<Course>;
}
Payment.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
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
        modelName: 'Payment',
    },
);

export default Payment;
