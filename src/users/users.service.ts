import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(username: string, password: string): Promise<User> {
    const user = this.userRepository.create({ username, password: password });
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
