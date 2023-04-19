import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { User } from '../models/user.model.js';
import usersJson from '../data/users.json' assert { type: 'json' };

passport.use(new LocalStrategy((username, password, done) => {
	const user = usersJson.find((user: User) => user.username === username);

	if (!user) {
		return done(null, false, { message: 'Incorrect username.' });
	}
	return done(null, user);
}));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user: User, done) => {
	done(null, user);
});

export default passport;