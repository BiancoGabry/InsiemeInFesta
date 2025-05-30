import { Router } from "express";
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "@/controllers/category.controller";
import { checkCategoryNameAlreadyExist, checkCategoryObj} from "@/middlewares/checkObjects/checkCategory";
import { validateIdParam } from "@/middlewares/validateIdParam";
import { checkRole } from "@/middlewares/authMiddleware";

const router = Router();

router.get(
    "/",
    getCategories
);

router.post(
    "/",
    checkRole(["admin"]),
    checkCategoryObj,
    checkCategoryNameAlreadyExist,
    createCategory
);

router.put(
    "/:id",
    checkRole(["admin"]),
    validateIdParam,
    checkCategoryObj,
    checkCategoryNameAlreadyExist,
    updateCategory
);

router.delete(
    "/:id",
    checkRole(["admin"]),
    validateIdParam,
    deleteCategory
);

router.get(
    "/:id",
    validateIdParam,
    getCategoryById
);

export default router;