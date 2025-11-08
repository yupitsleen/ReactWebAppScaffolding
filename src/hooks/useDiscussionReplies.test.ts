/**
 * Tests for useDiscussionReplies hook
 *
 * Tests state management for discussion reply functionality:
 * - Reply text management per discussion
 * - Reply box visibility state per discussion
 * - Clean API for showing/hiding/submitting replies
 * - Proper state isolation between discussions
 */

import { renderHook, act } from '@testing-library/react';
import { useDiscussionReplies } from './useDiscussionReplies';

describe('useDiscussionReplies', () => {
  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      expect(result.current.replyText).toEqual({});
      expect(result.current.showReplyBox).toEqual({});
    });

    it('should return empty string for non-existent discussion reply text', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      expect(result.current.getReplyText('discussion-1')).toBe('');
    });

    it('should return false for non-existent discussion reply box visibility', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(false);
    });
  });

  describe('Reply Box Visibility', () => {
    it('should show reply box for a discussion', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.showReply('discussion-1');
      });

      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(true);
      expect(result.current.showReplyBox['discussion-1']).toBe(true);
    });

    it('should hide reply box for a discussion', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.showReply('discussion-1');
      });

      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(true);

      act(() => {
        result.current.hideReply('discussion-1');
      });

      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(false);
      expect(result.current.showReplyBox['discussion-1']).toBe(false);
    });

    it('should manage multiple discussion reply boxes independently', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.showReply('discussion-1');
        result.current.showReply('discussion-2');
      });

      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(true);
      expect(result.current.isReplyBoxVisible('discussion-2')).toBe(true);

      act(() => {
        result.current.hideReply('discussion-1');
      });

      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(false);
      expect(result.current.isReplyBoxVisible('discussion-2')).toBe(true);
    });
  });

  describe('Reply Text Management', () => {
    it('should update reply text for a discussion', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.updateReplyText('discussion-1', 'This is a reply');
      });

      expect(result.current.getReplyText('discussion-1')).toBe('This is a reply');
      expect(result.current.replyText['discussion-1']).toBe('This is a reply');
    });

    it('should update reply text multiple times for same discussion', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.updateReplyText('discussion-1', 'First version');
      });

      expect(result.current.getReplyText('discussion-1')).toBe('First version');

      act(() => {
        result.current.updateReplyText('discussion-1', 'Second version');
      });

      expect(result.current.getReplyText('discussion-1')).toBe('Second version');
    });

    it('should manage reply text for multiple discussions independently', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.updateReplyText('discussion-1', 'Reply to discussion 1');
        result.current.updateReplyText('discussion-2', 'Reply to discussion 2');
      });

      expect(result.current.getReplyText('discussion-1')).toBe('Reply to discussion 1');
      expect(result.current.getReplyText('discussion-2')).toBe('Reply to discussion 2');
    });

    it('should handle empty string reply text', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.updateReplyText('discussion-1', 'Some text');
      });

      expect(result.current.getReplyText('discussion-1')).toBe('Some text');

      act(() => {
        result.current.updateReplyText('discussion-1', '');
      });

      expect(result.current.getReplyText('discussion-1')).toBe('');
    });
  });

  describe('Clear Reply', () => {
    it('should clear both reply text and visibility for a discussion', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.showReply('discussion-1');
        result.current.updateReplyText('discussion-1', 'Some reply text');
      });

      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(true);
      expect(result.current.getReplyText('discussion-1')).toBe('Some reply text');

      act(() => {
        result.current.clearReply('discussion-1');
      });

      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(false);
      expect(result.current.getReplyText('discussion-1')).toBe('');
      expect(result.current.replyText['discussion-1']).toBeUndefined();
      expect(result.current.showReplyBox['discussion-1']).toBeUndefined();
    });

    it('should clear only the specified discussion', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.showReply('discussion-1');
        result.current.updateReplyText('discussion-1', 'Reply 1');
        result.current.showReply('discussion-2');
        result.current.updateReplyText('discussion-2', 'Reply 2');
      });

      act(() => {
        result.current.clearReply('discussion-1');
      });

      // discussion-1 should be cleared
      expect(result.current.getReplyText('discussion-1')).toBe('');
      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(false);

      // discussion-2 should remain unchanged
      expect(result.current.getReplyText('discussion-2')).toBe('Reply 2');
      expect(result.current.isReplyBoxVisible('discussion-2')).toBe(true);
    });

    it('should handle clearing non-existent discussion gracefully', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      expect(() => {
        act(() => {
          result.current.clearReply('non-existent-discussion');
        });
      }).not.toThrow();

      expect(result.current.replyText).toEqual({});
      expect(result.current.showReplyBox).toEqual({});
    });
  });

  describe('State Isolation', () => {
    it('should maintain independent state for different discussion IDs', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.showReply('discussion-1');
        result.current.updateReplyText('discussion-1', 'Reply to discussion 1');
        result.current.showReply('discussion-2');
        result.current.updateReplyText('discussion-2', 'Reply to discussion 2');
        result.current.showReply('discussion-3');
        result.current.updateReplyText('discussion-3', 'Reply to discussion 3');
      });

      expect(result.current.replyText).toEqual({
        'discussion-1': 'Reply to discussion 1',
        'discussion-2': 'Reply to discussion 2',
        'discussion-3': 'Reply to discussion 3',
      });

      expect(result.current.showReplyBox).toEqual({
        'discussion-1': true,
        'discussion-2': true,
        'discussion-3': true,
      });
    });

    it('should allow mixing operations on different discussions', () => {
      const { result } = renderHook(() => useDiscussionReplies());

      act(() => {
        result.current.showReply('discussion-1');
        result.current.updateReplyText('discussion-1', 'Reply 1');
        result.current.showReply('discussion-2');
        result.current.updateReplyText('discussion-2', 'Reply 2');
        result.current.hideReply('discussion-1');
        result.current.clearReply('discussion-2');
      });

      // discussion-1: text remains, visibility hidden
      expect(result.current.getReplyText('discussion-1')).toBe('Reply 1');
      expect(result.current.isReplyBoxVisible('discussion-1')).toBe(false);

      // discussion-2: both cleared
      expect(result.current.getReplyText('discussion-2')).toBe('');
      expect(result.current.isReplyBoxVisible('discussion-2')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in discussion IDs', () => {
      const { result } = renderHook(() => useDiscussionReplies());
      const specialId = 'discussion-@#$%^&*()';

      act(() => {
        result.current.showReply(specialId);
        result.current.updateReplyText(specialId, 'Reply with special ID');
      });

      expect(result.current.getReplyText(specialId)).toBe('Reply with special ID');
      expect(result.current.isReplyBoxVisible(specialId)).toBe(true);
    });

    it('should handle numeric-like discussion IDs as strings', () => {
      const { result } = renderHook(() => useDiscussionReplies());
      const numericId = '12345';

      act(() => {
        result.current.showReply(numericId);
        result.current.updateReplyText(numericId, 'Reply to numeric ID');
      });

      expect(result.current.getReplyText(numericId)).toBe('Reply to numeric ID');
      expect(result.current.isReplyBoxVisible(numericId)).toBe(true);
    });

    it('should handle very long reply text', () => {
      const { result } = renderHook(() => useDiscussionReplies());
      const longText = 'A'.repeat(10000);

      act(() => {
        result.current.updateReplyText('discussion-1', longText);
      });

      expect(result.current.getReplyText('discussion-1')).toBe(longText);
      expect(result.current.getReplyText('discussion-1').length).toBe(10000);
    });
  });

  describe('Callback Stability', () => {
    it('should maintain stable function references across re-renders', () => {
      const { result, rerender } = renderHook(() => useDiscussionReplies());

      const initialShowReply = result.current.showReply;
      const initialHideReply = result.current.hideReply;
      const initialUpdateReplyText = result.current.updateReplyText;
      const initialClearReply = result.current.clearReply;

      act(() => {
        result.current.updateReplyText('discussion-1', 'Some text');
      });

      rerender();

      // Callbacks should be referentially stable (useCallback)
      expect(result.current.showReply).toBe(initialShowReply);
      expect(result.current.hideReply).toBe(initialHideReply);
      expect(result.current.updateReplyText).toBe(initialUpdateReplyText);
      expect(result.current.clearReply).toBe(initialClearReply);
    });
  });
});
