import { HTTP_UNAUTHORIZED } from "../constants/http_status";
import authMid from "../middlewares/auth.mid"

const adminMid = (req:any, res:any, next:any) => {
  if (!req.user.isAdmin) res.status(HTTP_UNAUTHORIZED).send();

  return next();
};

export default [authMid, adminMid];