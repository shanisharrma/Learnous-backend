import { Payment } from '../database/models';
import CrudRepository from './crud-repository';

class PaymentRepository extends CrudRepository<Payment> {
    constructor() {
        super(Payment);
    }
}

export default PaymentRepository;
