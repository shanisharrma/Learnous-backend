import Stripe from 'stripe';
import {
    ICreateOrderResponse,
    IPaymentGateway,
    IPaymentNotesData,
    IRefundResponse,
    IVerifyPaymentParams,
} from './payment-gateway-interface';
import { ServerConfig } from '../../../config';
import { ResponseMessage } from '../../../utils/constants';
import { AppError } from '../../../utils/error';
import { StatusCodes } from 'http-status-codes';

class StripePaymentService implements IPaymentGateway {
    private stripeInstance: Stripe;

    constructor() {
        this.stripeInstance = new Stripe(ServerConfig.STRIPE_SECRET_KEY as string);
    }

    public async createOrder(
        amount: number,
        currency: string,
        receipt: string,
        notesData: IPaymentNotesData,
    ): Promise<ICreateOrderResponse> {
        try {
            const paymentIntent = await this.stripeInstance.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: currency,
                metadata: { receipt, email: notesData.email },
            });

            return {
                id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                clientSecret: paymentIntent.client_secret,
            };
        } catch (error) {
            throw new AppError(ResponseMessage.FAILED_TO_MAKE_PAYMENT, StatusCodes.PAYMENT_REQUIRED, error);
        }
    }

    public async verifyPayment(paymentResponse: IVerifyPaymentParams): Promise<boolean> {
        try {
            const paymentIntent = await this.stripeInstance.paymentIntents.retrieve(paymentResponse.paymentId);
            return paymentIntent.status === 'succeeded';
        } catch (error) {
            throw new AppError(ResponseMessage.FAILED_TO_VERIFY_PAYMENT, StatusCodes.PAYMENT_REQUIRED, error);
        }
    }

    public async refundPayment(paymentId: string, amount?: number): Promise<IRefundResponse> {
        try {
            const refund = await this.stripeInstance.refunds.create({
                payment_intent: paymentId,
                amount: amount ? Math.round(amount * 100) : undefined,
            });

            return {
                id: refund.id,
                amount: refund.amount,
                status: refund.status ? refund.status : 'Failed',
            };
        } catch (error) {
            throw new AppError(ResponseMessage.FAILED_TO_REFUND_PAYMENT, StatusCodes.PAYMENT_REQUIRED, error);
        }
    }
}
export default StripePaymentService;
