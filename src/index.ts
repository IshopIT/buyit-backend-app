/**
 * Module dependencies.
 */

import 'reflect-metadata';
import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import express from 'express';
import { readFileSync } from 'fs';
import { connect } from 'mongoose';

interface MyContext {
	token?: string;
}

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const books = [
	{
		author: {
			name: 'Rui',
		},
		title: 'The Awakening',
	},

	{
		author: {
			name: 'Pedro',
		},
		title: 'City of Glass',
	},
];

const resolvers = {
	Query: {
		books: () => books,
	},
};

/**
 * Function `main`.
 */

async function main() {
	const app = express();
	const port = process.env.PORT;
	const uri = process.env.DATABASE_URI;

	try {
		await connect(uri ?? '');
		console.log('Connection successful.');
	} catch (error) {
		console.error('Connection unseccessful.', error);
	}

	const server = new ApolloServer({
		resolvers,
		typeDefs,
	});

	// Passing an ApolloServer instance to the `startStandaloneServer` function:

	//  1. creates an Express app

	//  2. installs your ApolloServer instance as middleware

	//  3. prepares your app to handle incoming requests

	const { url } = await startStandaloneServer(server, {
		listen: { port: parseInt(port || '') },
	});

	console.log(`🚀  Server ready at: ${url}`);
}

main();
