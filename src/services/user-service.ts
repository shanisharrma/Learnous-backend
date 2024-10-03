import { StatusCodes } from 'http-status-codes';
import { RoleRepository, UserRepository } from '../repositories';
import { IRegisterRequestBody, IUserAttributes } from '../types';
import { Enums, ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { Quicker } from '../utils/helper';
import PhoneNumberService from './phone-number-service';
import AccountConfirmationService from './account-confirmation-service';
import MailService from './mail-service';
import { ServerConfig } from '../config';
import { Logger } from '../utils/common';

class UserService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;
    private phoneNumberService: PhoneNumberService;
    private accountConfirmationService: AccountConfirmationService;
    private mailService: MailService;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.phoneNumberService = new PhoneNumberService();
        this.accountConfirmationService = new AccountConfirmationService();
        this.mailService = new MailService();
    }

    public async registerUser(data: IRegisterRequestBody) {
        try {
            // * destructure data;
            const {
                consent,
                email,
                firstName,
                lastName,
                password,
                phoneNumber,
                username,
                role,
            } = data;

            // * Parsing the phone number
            const { countryCode, internationalNumber, isoCode } =
                Quicker.parsePhoneNumber('+' + phoneNumber);

            // ----> check if any key is empty
            if (!countryCode || !isoCode || !internationalNumber) {
                throw new AppError(
                    ResponseMessage.INVALID_PHONE_NUMBER,
                    StatusCodes.UNPROCESSABLE_ENTITY,
                );
            }

            // * get timezone from phone number iso code
            const timezone = Quicker.getCountryTimezone(isoCode);

            // * check timezone exists or not
            if (!timezone || timezone.length === 0) {
                throw new AppError(
                    ResponseMessage.INVALID_PHONE_NUMBER,
                    StatusCodes.UNPROCESSABLE_ENTITY,
                );
            }

            // * check if user already exists
            const isUserExists = await this.userRepository.findByEmail(email);
            if (isUserExists) {
                throw new AppError(
                    ResponseMessage.EMAIL_ALREADY_IN_USE,
                    StatusCodes.BAD_REQUEST,
                );
            }

            // * create new user
            const user = await this.userRepository.create({
                firstName,
                lastName,
                email,
                password,
                consent,
                username,
                timezone: timezone[0].name,
            });

            // * check if role exists ---> if yes then assign to new user, else ---> throw error
            const user_role = await this.roleRepository.findByRole(role);
            if (user_role) {
                user.addRole(user_role);
            } else {
                throw new AppError(
                    ResponseMessage.NOT_FOUND('Role'),
                    StatusCodes.NOT_FOUND,
                );
            }

            // * create Phone number entry
            const newPhoneNumber =
                await this.phoneNumberService.createPhoneNumber({
                    isoCode,
                    internationalNumber,
                    countryCode,
                    userId: user.id,
                });

            // * create OTP and random token for account verification
            const code = Quicker.generateRandomOTP(6);
            const token = Quicker.generateRandomTokenId();
            const expiresAt = Quicker.generateAccountConfirmationExpiry(10);

            const accountConfirmation =
                await this.accountConfirmationService.createAccountConfirmation(
                    { code, token, userId: user.id, status: false, expiresAt },
                );

            // create mail payload
            const confirmationUrl = `${ServerConfig.FRONTEND_URL}/account-confirmation/${token}?code=${code}`;
            const to = [user.email];
            const subject = `Account Verification`;
            const text = `Hey ${user.firstName + ' ' + user.lastName}, Please click the below link to verify you email for the account creation at Learnovous.\n\nThe confirmation email valid for 10 minutes only.\n\n\n${confirmationUrl}`;

            // * send email
            await this.mailService
                .sendEmail(to, subject, text)
                .catch((error) => {
                    Logger.error(Enums.EApplicationEvent.EMAIL_SERVICE, {
                        meta: error,
                    });
                });

            // * return the complete user
            const userDetails: IUserAttributes = {
                ...user,
                accountConfirmation,
                phoneNumber: newPhoneNumber,
            };

            return userDetails;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(
                ResponseMessage.SOMETHING_WENT_WRONG,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async confirmation(data: { token: string; code: string }) {
        try {
            // * destructure data
            const { token, code } = data;
            // * find the account confirmation details based on token and code
            const accountConfirmationDetails =
                await this.accountConfirmationService.findAccountConfirmationWithUser(
                    token,
                    code,
                );
            // * check user exist with given userId in account confirmation details
            if (
                !accountConfirmationDetails ||
                !accountConfirmationDetails.user
            ) {
                throw new AppError(
                    ResponseMessage.INVALID_VERIFICATION_CODE_TOKEN,
                    StatusCodes.BAD_REQUEST,
                );
            }
            // * check is User Already verified?
            if (accountConfirmationDetails.status === true) {
                throw new AppError(
                    ResponseMessage.ACCOUNT_ALREADY_VERIFIED,
                    StatusCodes.BAD_REQUEST,
                );
            }
            // * check confirmation url expired
            const expiresAt = accountConfirmationDetails.expiresAt;
            const currentTimestamp = Quicker.getCurrentTimeStamp();
            if (expiresAt < currentTimestamp) {
                // * delete the current account confirmation details
                await this.accountConfirmationService.deleteAccountConfirmation(
                    accountConfirmationDetails.id!,
                );
                throw new AppError(
                    ResponseMessage.EXPIRED_CONFIRMATION_URL,
                    StatusCodes.BAD_REQUEST,
                );
            }
            // * verify the account
            const verifiedAt = Quicker.getCurrentDateAndTime();
            const accountVerified =
                await this.accountConfirmationService.updateAccountConfirmation(
                    accountConfirmationDetails.id!,
                    { status: true, verifiedAt },
                );

            // * create email body
            const to = [accountConfirmationDetails.user.email];
            const subject = `Account Verified Successfully`;
            const text = `Hey ${accountConfirmationDetails.user.username}, Your account ahs been successfully verified.`;

            // * send verified account email
            await this.mailService
                .sendEmail(to, subject, text)
                .catch((error) => {
                    Logger.error(Enums.EApplicationEvent.EMAIL_SERVICE, {
                        meta: error,
                    });
                });

            return accountVerified;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                ResponseMessage.SOMETHING_WENT_WRONG,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

export default UserService;
