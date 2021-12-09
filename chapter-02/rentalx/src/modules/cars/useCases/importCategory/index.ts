import { ImportCategoryController } from "./ImportCategoryController";
import { ImportCategoryUseCase } from "./ImportCategoryUseCase";

const importCategoryUseCase = new ImportCategoryUseCase();
const importCategoryControler = new ImportCategoryController(importCategoryUseCase);

export {importCategoryControler}