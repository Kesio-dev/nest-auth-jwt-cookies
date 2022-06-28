import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        function isEmpty(obj) {
            for (let key in obj) {
                return false;
            }
            return true;
        }


        try {
            const roles = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()])
            if (!roles) return true;
            const req = context.switchToHttp().getRequest();
            if (isEmpty(req.cookies)) throw new ForbiddenException("Отказано в доступе");
            const user = this.jwtService.verify(req.cookies['jwt'])
            return roles.includes(user.role)
        } catch (e) {
            console.log('trycath error' + e)
            throw new ForbiddenException("Отказано в доступе");
        }
    }

}