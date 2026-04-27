import { describe, it, expect } from 'vitest';
import { createProjectSchema, createIssueSchema, createWorklogSchema } from './validators';

describe('validators', () => {
  describe('createProjectSchema', () => {
    it('validates a correct project', () => {
      const data = {
        name: 'Test Project',
        key: 'TEST',
        teamId: 'team-1',
      };
      const result = createProjectSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid key', () => {
      const data = {
        name: 'Test',
        key: 'test', // lowercase not allowed
        teamId: 'team-1',
      };
      const result = createProjectSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('createIssueSchema', () => {
    it('validates correct issue', () => {
      const data = {
        projectId: 'proj-1',
        title: 'New bug',
        type: 'BUG',
        priority: 'HIGH',
      };
      const result = createIssueSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('createWorklogSchema', () => {
    it('validates correct worklog', () => {
      const data = {
        issueId: 'issue-1',
        date: new Date().toISOString(),
        durationMinutes: 120,
      };
      const result = createWorklogSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects duration <= 0', () => {
      const data = {
        issueId: 'issue-1',
        date: new Date().toISOString(),
        durationMinutes: 0,
      };
      const result = createWorklogSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
