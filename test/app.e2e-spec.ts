import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface ExtensionDto {
  id: string;
  url: string;
  key?: string;
  value: string;
}

interface PersonDto {
  id: string;
  names: string[];
  gender?: string;
  extensions: ExtensionDto[];
}

interface EventDto {
  id: string;
  type: string;
  date?: string;
  placeId?: string;
  participants: string[];
  sourceIds?: string[];
  extensions: ExtensionDto[];
}

interface FamilyDto {
  id: string;
  parents: string[];
  children: string[];
  eventIds?: string[];
  extensions: ExtensionDto[];
}

interface SourceDto {
  id: string;
  title: string;
  citation?: string;
  extensions: ExtensionDto[];
}

const mockPerson = {
  identity: { low: 1, high: 0 },
  labels: ['Person'],
  properties: {
    id: 'person-1',
    names: ['John Doe', 'Johnny'],
    gender: 'male',
  },
};

const mockEvent = {
  identity: { low: 2, high: 0 },
  labels: ['Event'],
  properties: {
    id: 'event-1',
    type: 'birth',
    date: '1900-01-15',
    placeId: 'place-1',
    participants: ['person-1'],
    sourceIds: ['source-1'],
  },
};

const mockFamily = {
  identity: { low: 3, high: 0 },
  labels: ['Family'],
  properties: {
    id: 'family-1',
    parents: ['person-1', 'person-2'],
    children: ['person-3', 'person-4'],
    eventIds: ['event-2'],
  },
};

const mockSource = {
  identity: { low: 4, high: 0 },
  labels: ['Source'],
  properties: {
    id: 'source-1',
    title: "Parish Records of St. Mary's Church",
    citation: "St. Mary's Church, Gdańsk. Baptismal register 1895–1910, p. 42.",
  },
};

const mockExtension = {
  identity: { low: 5, high: 0 },
  labels: ['Extension'],
  properties: {
    id: 'ext-1',
    url: 'http://schema.org/sameAs',
    key: 'wikidata',
    value: 'Q12345',
  },
};

function makeSession(node: object | null, extensions: object[] = []) {
  return {
    run: jest.fn().mockResolvedValue({
      records: node
        ? [
            {
              get: (key: string) => {
                if (key === 'extensions') return extensions;
                return node;
              },
            },
          ]
        : [],
    }),
    close: jest.fn().mockResolvedValue(undefined),
  };
}

describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let mockSessionFactory: jest.Mock;

  beforeEach(async () => {
    mockSessionFactory = jest.fn();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('NEO4J_DRIVER')
      .useValue({ session: mockSessionFactory })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  // ─── Person ────────────────────────────────────────────────────────────────

  describe('Person', () => {
    it('POST /persons — creates a person', async () => {
      mockSessionFactory.mockReturnValue(makeSession(mockPerson));

      await request(app.getHttpServer())
        .post('/persons')
        .send({
          id: 'person-1',
          names: ['John Doe'],
          gender: 'male',
          extensions: [],
        })
        .expect(201);
    });

    it('GET /persons/:id — returns a person with extensions', async () => {
      mockSessionFactory.mockReturnValue(
        makeSession(mockPerson, [mockExtension]),
      );

      const res = await request(app.getHttpServer())
        .get('/persons/person-1')
        .expect(200);

      const body = res.body as PersonDto;

      expect(body.id).toBe('person-1');
      expect(body.names).toEqual(['John Doe', 'Johnny']);
      expect(body.gender).toBe('male');
      expect(body.extensions).toHaveLength(1);
      expect(body.extensions[0].id).toBe('ext-1');
    });

    it('GET /persons/:id — throws when not found', async () => {
      mockSessionFactory.mockReturnValue(makeSession(null));

      await request(app.getHttpServer())
        .get('/persons/does-not-exist')
        .expect(500);
    });
  });

  // ─── Event ─────────────────────────────────────────────────────────────────

  describe('Event', () => {
    it('POST /events — creates an event', async () => {
      mockSessionFactory.mockReturnValue(makeSession(mockEvent));

      await request(app.getHttpServer())
        .post('/events')
        .send({
          id: 'event-1',
          type: 'birth',
          date: '1900-01-15',
          placeId: 'place-1',
          participants: ['person-1'],
          sourceIds: ['source-1'],
          extensions: [],
        })
        .expect(201);
    });

    it('GET /events/:id — returns an event with extensions', async () => {
      mockSessionFactory.mockReturnValue(
        makeSession(mockEvent, [mockExtension]),
      );

      const res = await request(app.getHttpServer())
        .get('/events/event-1')
        .expect(200);

      const body = res.body as EventDto;

      expect(body.id).toBe('event-1');
      expect(body.type).toBe('birth');
      expect(body.date).toBe('1900-01-15');
      expect(body.participants).toContain('person-1');
      expect(body.extensions).toHaveLength(1);
    });

    it('GET /events/:id — throws when not found', async () => {
      mockSessionFactory.mockReturnValue(makeSession(null));

      await request(app.getHttpServer())
        .get('/events/does-not-exist')
        .expect(500);
    });
  });

  // ─── Family ────────────────────────────────────────────────────────────────

  describe('Family', () => {
    it('POST /families — creates a family', async () => {
      mockSessionFactory.mockReturnValue(makeSession(mockFamily));

      await request(app.getHttpServer())
        .post('/families')
        .send({
          id: 'family-1',
          parents: ['person-1', 'person-2'],
          children: ['person-3', 'person-4'],
          eventIds: ['event-2'],
          extensions: [],
        })
        .expect(201);
    });

    it('GET /families/:id — returns a family with extensions', async () => {
      mockSessionFactory.mockReturnValue(
        makeSession(mockFamily, [mockExtension]),
      );

      const res = await request(app.getHttpServer())
        .get('/families/family-1')
        .expect(200);

      const body = res.body as FamilyDto;

      expect(body.id).toBe('family-1');
      expect(body.parents).toContain('person-1');
      expect(body.children).toContain('person-3');
      expect(body.extensions).toHaveLength(1);
    });

    it('GET /families/:id — throws when not found', async () => {
      mockSessionFactory.mockReturnValue(makeSession(null));

      await request(app.getHttpServer())
        .get('/families/does-not-exist')
        .expect(500);
    });
  });

  // ─── Source ────────────────────────────────────────────────────────────────

  describe('Source', () => {
    it('POST /sources — creates a source', async () => {
      mockSessionFactory.mockReturnValue(makeSession(mockSource));

      await request(app.getHttpServer())
        .post('/sources')
        .send({
          id: 'source-1',
          title: "Parish Records of St. Mary's Church",
          citation: "St. Mary's Church, Gdańsk.",
          extensions: [],
        })
        .expect(201);
    });

    it('GET /sources/:id — returns a source with extensions', async () => {
      mockSessionFactory.mockReturnValue(
        makeSession(mockSource, [mockExtension]),
      );

      const res = await request(app.getHttpServer())
        .get('/sources/source-1')
        .expect(200);

      const body = res.body as SourceDto;

      expect(body.id).toBe('source-1');
      expect(body.title).toBe("Parish Records of St. Mary's Church");
      expect(body.extensions).toHaveLength(1);
    });

    it('GET /sources/:id — throws when not found', async () => {
      mockSessionFactory.mockReturnValue(makeSession(null));

      await request(app.getHttpServer())
        .get('/sources/does-not-exist')
        .expect(500);
    });
  });
});
