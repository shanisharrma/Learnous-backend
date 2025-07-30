import { Tag } from '../database/models';
import CrudRepository from './crud-repository';

class TagRepository extends CrudRepository<Tag> {
    constructor() {
        super(Tag);
    }
}

export default TagRepository;
