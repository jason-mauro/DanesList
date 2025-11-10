import { User } from "../../schemas/user.schema.ts";

declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }