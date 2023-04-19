import { Strategy } from 'passport-github2';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new Strategy({
	clientID: process.env.GITHUB_CLIENT_ID!,
	clientSecret: process.env.GITHUB_CLIENT_SECRET!,
	callbackURL: "http://127.0.0.1:3000/auth/github/callback",
}, (accessToken, refreshToken, profile, done) => {
	console.log(profile);
	done(null, {
		profile,
		token: accessToken,
	});
}));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user: any, done) => {
	done(null, user);
});

export default passport;