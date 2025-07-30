'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { ICourseAttributes, ITagsAttributes } from '../../types';

type TTagsCreationAttributes = Optional<ITagsAttributes, 'id'>;

class Tag extends Model<ITagsAttributes, TTagsCreationAttributes> implements ITagsAttributes {
    public id!: number;
    public name!: string;
    public readonly updatedAt?: Date | undefined;
    public readonly createdAt?: Date | undefined;

    public tagCourses?: ICourseAttributes[] | undefined;
}
Tag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        modelName: 'Tags',
    },
);
export default Tag;
