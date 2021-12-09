import { ISpecificationsRepository } from "../../repositories/ISpecificationsRepository";

interface IRequest {
  name: string;
  description: string;
}

class CreateSpecificationUseCase {
  constructor(private specificationsRepository: ISpecificationsRepository) {}

  execute({ name, description } : IRequest): void {
    const specificationExists = this.specificationsRepository.findByName(name);

    if(specificationExists) {
      throw new Error('Category already exists');
    }

    this.specificationsRepository.create({
      name,
      description,
    });
  }
}

export { CreateSpecificationUseCase }