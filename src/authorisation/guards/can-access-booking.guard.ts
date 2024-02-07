import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserParams } from '../user.params';
import { getUserParamsFromContext } from '../get-user-params-from-context';
import { UserRole } from '../user-roles.enum';
import { BookingService } from '../../booking/services';
import { BookingEntity } from '../../booking/entities';

@Injectable()
export class CanAccessBookingGuard implements CanActivate {
  private readonly logger = new Logger(CanAccessBookingGuard.name);
  constructor(private readonly bookingService: BookingService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userParams: UserParams = getUserParamsFromContext(context);
    const request = context.switchToHttp().getRequest();
    const bookingId = Number(request.params.bookingId);

    if (!(await this.bookingService.exists(bookingId))) {
      throw new NotFoundException(`Booking with ID [${bookingId}] not found!`);
    }

    if (userParams.role === UserRole.ADMIN) {
      return true;
    }

    const booking: BookingEntity = await this.bookingService.getById(bookingId);

    if (booking.createdBy.id !== userParams.userId) {
      this.logger.warn(
        `Request to access booking: [${bookingId}] is not authorised for userId: [${userParams.userId}]!`,
      );
      return false;
    }

    return true;
  }
}
