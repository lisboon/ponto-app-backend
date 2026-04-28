import { Announcement } from '../../domain/announcement.entity';
import { AnnouncementStatus } from '@/modules/@shared/domain/enums';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';

const valid = () =>
  Announcement.create({
    authorId: '00000000-0000-4000-8000-000000000001',
    title: 'Reunião geral',
    content: 'Haverá uma reunião na sexta.',
  });

describe('Announcement entity', () => {
  it('cria rascunho', () => {
    const a = valid();
    expect(a.status).toBe(AnnouncementStatus.DRAFT);
    expect(a.publishedAt).toBeUndefined();
  });

  it('publish altera status e emite evento', () => {
    const a = valid();
    a.publish();
    expect(a.status).toBe(AnnouncementStatus.PUBLISHED);
    expect(a.publishedAt).toBeInstanceOf(Date);
    const events = a.pullEvents();
    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('AnnouncementPublishedEvent');
  });

  it('publish em status não-DRAFT lança erro', () => {
    const a = valid();
    a.publish();
    expect(() => a.publish()).toThrow('Somente rascunhos podem ser publicados');
  });

  it('archive funciona', () => {
    const a = valid();
    a.archive();
    expect(a.status).toBe(AnnouncementStatus.ARCHIVED);
  });

  it('lança EntityValidationError com título inválido', () => {
    expect(() =>
      Announcement.create({
        authorId: '00000000-0000-4000-8000-000000000001',
        title: 'AB',
        content: 'ok',
      }),
    ).toThrow(EntityValidationError);
  });
});
