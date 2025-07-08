// src/repositories/ApiKeyRepository.ts
import { Repository } from 'typeorm';
import { ApiKey } from '../entities/ApiKey';

export class ApiKeyRepository {
  private repository: Repository<ApiKey>;

  constructor(apiKeyRepository: Repository<ApiKey>) {
    this.repository = apiKeyRepository;
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    return this.repository.findOne({ where: { key, isActive: true } });
  }

  async createKey(key: string, userId: number): Promise<ApiKey> {
    const apiKey = this.repository.create({ key, userId, isActive: true });
    return this.repository.save(apiKey);
  }

  // Ajoute d'autres méthodes selon tes besoins (désactivation, suppression, etc.)
}
