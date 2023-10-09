import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.post('/pessoas', async (request, reply) => {
  try {
    const { apelido, nome, nascimento, stack } = request.body;

    if (!apelido || typeof apelido !== 'string') {
      reply.status(422).send({
        error: 'O campo "apelido" é obrigatório e deve ser uma string.',
      });
      return;
    }

    if (!nome || typeof nome !== 'string') {
      reply
        .status(422)
        .send({ error: 'O campo "nome" é obrigatório e deve ser uma string.' });
      return;
    }

    if (!nascimento || !/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
      reply.status(422).send({
        error:
          'O campo "nascimento" é obrigatório e deve estar no formato AAAA-MM-DD.',
      });
      return;
    }

    if (
      stack &&
      (!Array.isArray(stack) ||
        stack.some((item) => typeof item !== 'string' || item.length > 32))
    ) {
      reply.status(422).send({
        error:
          'O campo "stack" é opcional, mas se fornecido, deve ser um array de strings com cada elemento contendo no máximo 32 caracteres.',
      });
      return;
    }

    const existingPerson = await prisma.pessoa.findUnique({
      where: { apelido },
    });

    if (existingPerson) {
      reply.status(422).send({ error: 'O apelido fornecido já está em uso.' });
      return;
    }

    const pessoa = await prisma.pessoa.create({
      data: {
        apelido,
        nome,
        nascimento,
        stack,
      },
    });

    const pessoaId = pessoa.id;
    const location = `/pessoas/${pessoaId}`;

    reply.status(201).header('Location', location).send(pessoa);
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno do servidor' });
    fastify.log.error(error);
  }
});

fastify.get('/pessoas/:id', async (request, reply) => {
  const id = request.params.id;
  try {
    const pessoa = await prisma.pessoa.findUnique({
      where: { id },
    });

    if (!pessoa) {
      reply.status(404).send({ error: 'Pessoa não encontrada' });
      return;
    }

    reply.status(200).send(pessoa);
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno do servidor' });
    fastify.log.error(error);
  }
});

fastify.get('/pessoas', async (request, reply) => {
  const termoBusca = request.query.t;

  if (!termoBusca) {
    reply
      .status(400)
      .send({ error: 'O parâmetro "t" é obrigatório na query string.' });
    return;
  }

  try {
    const pessoas = await prisma.pessoa.findMany({
      where: {
        OR: [
          { apelido: { contains: termoBusca, mode: 'insensitive' } },
          { nome: { contains: termoBusca, mode: 'insensitive' } },
          { stack: { hasSome: [termoBusca], mode: 'insensitive' } },
        ],
      },
    });

    reply.status(200).send(pessoas);
  } catch (error) {
    reply.status(500).send({ error: 'Erro interno do servidor' });
    fastify.log.error(error);
  }
});

fastify.get('/contagem-pessoas', async (request, reply) => {
  try {
    const count = await prisma.pessoa.count();
    reply.status(200).send(count.toString());
  } catch (error) {
    reply.status(500).send('Erro interno do servidor');
    fastify.log.error(error);
  }
});

fastify.addHook('onClose', async () => {
  await prisma.$disconnect();
});

try {
  await fastify.listen(8080);
  console.log(`Server listening on ${fastify.server.address().port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
