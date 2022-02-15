import * as CANNON from 'cannon-es';

export class Utils {
    static lookRotation (forward: CANNON.Vec3, up: CANNON.Vec3): CANNON.Quaternion {
        forward.normalize();

        const c0 = new CANNON.Vec3().copy(up.cross(forward));
        c0.normalize();
        const c1 = new CANNON.Vec3().copy(forward.cross(c0));
        c1.normalize();
        const c2 = new CANNON.Vec3().copy(forward);

        const q = new CANNON.Quaternion();
        const num8 = c0.x + c1.y + c2.z;
        if (num8 > 0.0) {
            let num = Math.sqrt(num8 + 1.0);
            q.w = num * 0.5;
            num = 0.5 / num;
            q.x = (c1.z - c2.y) * num;
            q.y = (c2.x - c0.z) * num;
            q.z = (c0.y - c1.x) * num;
            return q;
        }
        if (c0.x >= c1.y && c0.x >= c2.z) {
            const num7 = Math.sqrt(1.0 + c0.x - c1.y - c2.z);
            const num4 = 0.5 / num7;
            q.x = 0.5 * num7;
            q.y = (c0.y + c1.x) * num4;
            q.z = (c0.z + c2.x) * num4;
            q.w = (c1.z - c2.y) * num4;
            return q;
        }
        if (c1.y > c2.z) {
            const num6 = Math.sqrt(1.0 + c1.y - c0.x - c2.z);
            const num3 = 0.5 / num6;
            q.x = (c1.x + c0.y) * num3;
            q.y = 0.5 * num6;
            q.z = (c2.y + c1.z) * num3;
            q.w = (c2.x - c0.z) * num3;
            return q;
        }
        const num5 = Math.sqrt(1.0 + c2.z - c0.x - c1.y);
        const num2 = 0.5 / num5;
        q.x = (c2.x + c0.z) * num2;
        q.y = (c2.y + c1.z) * num2;
        q.z = 0.5 * num5;
        q.w = (c0.y - c1.x) * num2;

        return q;
    }
}
