'use strict';

import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../sequelize';
import { ICourseTagsAttributes } from '../../types';

type TCourseTagsCreationAttributes = Optional<ICourseTagsAttributes, 'id'>;

class Course_Tag extends Model<ICourseTagsAttributes, TCourseTagsCreationAttributes> implements ICourseTagsAttributes {
    public id!: number;
    public tagId!: number;
    public courseId!: number;
    public readonly createdAt?: Date | undefined;
    public readonly updatedAt?: Date | undefined;
}
Course_Tag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        tagId: { type: DataTypes.INTEGER, allowNull: false },
        courseId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        sequelize: connection,
        modelName: 'Course_Tag',
    },
);

export default Course_Tag;
