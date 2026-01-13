---
name: auth-skill
description: Handle secure authentication flows including signup, signin, password hashing, JWT tokens, and Better Auth integration. Use for user authentication systems.
---

# Auth Skill

## Instructions

1. **User Signup Flow**
   - Validate email and password inputs
   - Hash password with bcrypt (12+ rounds)
   - Create user in database
   - Generate JWT tokens
   - Set secure httpOnly cookies

2. **User Signin Flow**
   - Verify user credentials
   - Compare password hash with bcrypt
   - Generate access and refresh tokens
   - Create session
   - Return user data

3. **Password Security**
   - Use bcrypt for hashing (never plain text)
   - Minimum 8 characters, include special chars
   - Implement password strength validation
   - Support secure reset flows with time-limited tokens

4. **JWT Token Management**
   - Access token: 15-30 min expiration
   - Refresh token: 7-30 day expiration
   - Include claims: userId, email, roles
   - Sign with secret from environment variables
   - Validate signature and expiration

5. **Better Auth Integration**
   - Configure Better Auth providers
   - Set up OAuth flows (Google, GitHub, etc.)
   - Handle social login callbacks
   - Sync user data across providers
   - Manage session state

## Best Practices

- Use environment variables for secrets (JWT_SECRET, API_KEYS)
- Implement rate limiting on auth endpoints (max 5 attempts per 15 min)
- Return generic errors to prevent user enumeration ("Invalid credentials" not "Email not found")
- Set secure cookie flags: `httpOnly: true, secure: true, sameSite: 'strict'`
- Validate all inputs on both client and server
- Log authentication events for security monitoring
- Use HTTPS in production always

## Example Implementation
```typescript
// Signup
async function signup(email: string, password: string) {
  // 1. Validate input
  if (!isValidEmail(email)) throw new Error("Invalid email");
  if (password.length < 8) throw new Error("Password too short");

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create user
  const user = await db.user.create({
    data: { email, password: hashedPassword }
  });

  // 4. Generate tokens
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // 5. Set secure cookies
  setCookie('accessToken', accessToken, { httpOnly: true, secure: true });
  setCookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

  return { user, accessToken };
}

// Signin
async function signin(email: string, password: string) {
  // 1. Find user
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  // 3. Generate tokens (same as signup)
  // 4. Return user data
}

// Better Auth Setup
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: prisma,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
```

## Common Patterns

- **Signup**: Validate → Hash → Create → Generate Tokens → Set Session
- **Signin**: Verify → Compare Hash → Generate Tokens → Return User
- **Token Refresh**: Verify Refresh Token → Generate New Access Token → Update Session
- **Password Reset**: Generate Token → Send Email → Verify Token → Hash New Password
- **OAuth**: Redirect to Provider → Handle Callback → Create/Update User → Set Session

## Security Checklist

- ✅ Passwords hashed with bcrypt (12+ rounds)
- ✅ JWT secrets stored in environment variables
- ✅ Tokens have appropriate expiration times
- ✅ Cookies set with httpOnly and secure flags
- ✅ Rate limiting enabled on auth endpoints
- ✅ Input validation on all fields
- ✅ HTTPS enforced in production
- ✅ Generic error messages used
- ✅ Authentication events logged
