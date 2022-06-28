import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuth implements CanActivate {
    constructor(private jwtService: JwtService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        function isEmpty(obj) {
            for (let key in obj) {
                return false;
            }
            return true;
        }
        try {
            console.log('xz')
            if (isEmpty(req.cookies)) throw new UnauthorizedException('пользователь не автризован');

            const user = this.jwtService.verify(req.cookies['jwt'])
            return true

        } catch (e) {
            console.log(e)
            throw new UnauthorizedException('пользователь не автризован')
        }


        return true;
    }

}