import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export = fp(async (fastify, opts) => {
  fastify.addHook(
    'onRequest',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        console.info('ONRESPONSE');
      } catch (error) {
        throw new UnauthorizedException(error.errors);
      }
    }
  );
});
