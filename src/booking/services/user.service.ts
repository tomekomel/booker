import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async exists(id: number): Promise<boolean> {
    return this.userRepository.existsBy({ id });
  }

  async getById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
    });
  }
}
