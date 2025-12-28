import { authRoutes } from "./auth/routes.js"
import { settingsRoutes } from "./settings/routes.js";
import { roleRoutes } from "./roles/routes.js";


import { categoriesRoutes } from "./categories/routes.js";
import { subcategoriesRoutes } from "./subcategories/routes.js";

import { reviewsRoutes } from "./reviews/routes.js";

export const routes = (app: any) =>{
  app.use('/api/v1/auth' , authRoutes)
  app.use('/api/v1/settings' , settingsRoutes)
  app.use('/api/v1/roles' , roleRoutes)
  app.use('/api/v1/categories' , categoriesRoutes)
  app.use('/api/v1/subcategories' , subcategoriesRoutes)
  app.use('/api/v1/reviews' , reviewsRoutes)
}