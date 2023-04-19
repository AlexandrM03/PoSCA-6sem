import jwt from 'jsonwebtoken';

interface TokenConfig {
	type: string;
	expiresIn: string;
	secret: string;
}

interface JwtConfig {
	tokens: {
		access: TokenConfig;
		refresh: TokenConfig;
	};
}

interface Config {
	port: number;
	jwt: JwtConfig;
}

const config: Config = {
	port: 3000,
	jwt: {
		tokens: {
			access: {
				type: 'access',
				expiresIn: '1m',
				secret: 'access-secret',
			},
			refresh: {
				type: 'refresh',
				expiresIn: '24h',
				secret: 'refresh-secret',
			},
		},
	},
};

const generateAccessToken = (id: number, login: string): string => {
	const payload = { id, login, type: config.jwt.tokens.access.type };
	const options = { expiresIn: config.jwt.tokens.access.expiresIn };

	return jwt.sign(payload, config.jwt.tokens.access.secret, options);
};

const generateRefreshToken = (id: number, login: string): string => {
	const payload = { id, login, type: config.jwt.tokens.refresh.type };
	const options = { expiresIn: config.jwt.tokens.refresh.expiresIn };

	return jwt.sign(payload, config.jwt.tokens.refresh.secret, options);
};

export { generateAccessToken, generateRefreshToken };
