import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { checkUser } from '../services/user.service.js';

passport.use(new BasicStrategy((login, password, done) => {
	const result = checkUser(login, password);
	if (result) {
		return done(null, login);
	} else {
		return done(null, false);
	}
}));

passport.serializeUser((login, done) => {
	done(null, login);
});

passport.deserializeUser((login: string, done) => {
	done(null, login);
});

export default passport;