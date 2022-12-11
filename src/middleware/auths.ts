/**
 * Module dependencies.
 */

import { Request } from 'express';
import { GraphQLError } from 'graphql';
import { TokenExpiredError, verify } from 'jsonwebtoken';

/**
 * Function `isAuthenticated`.
 */

function isAuthenticated(req: Request) {
	const authHeader = req.headers.authorization;
	const secret = process.env.JWT_SECRET || 'UNSAFE_STRING';

	if (authHeader) {
		const token = authHeader.split('Bearer')[1].trim();
		if (token) {
			try {
				const user = verify(token, secret);
				return user;
			} catch (err) {
				if (err instanceof TokenExpiredError) {
					throw new GraphQLError('Expired_Token');
				}

				throw new GraphQLError('Invalid/Expired Token');
			}
		}
		throw new Error('Authentication token must be Bearer [token]');
	}
	throw new Error('Authorization header must be provided');
}

/**
 * Export `isAuthenticated` function.
 */

export default isAuthenticated;
