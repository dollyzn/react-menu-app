import sign from "jwt-encode";
import { jwtDecode } from "jwt-decode";

function encode(userData: User): string {
  return sign(userData, "secret");
}

function decode(token: string | undefined): User | null {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export { encode, decode };
