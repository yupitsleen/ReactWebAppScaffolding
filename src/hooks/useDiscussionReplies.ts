/**
 * useDiscussionReplies Hook
 *
 * Manages state for discussion reply functionality.
 * Extracted from Discussions component to follow Single Responsibility Principle.
 *
 * Features:
 * - Reply text management per discussion
 * - Reply box visibility state per discussion
 * - Clean API for showing/hiding/submitting replies
 *
 * Performance benefits:
 * - Encapsulates reply state logic
 * - Prevents unnecessary re-renders of parent component
 */

import { useState, useCallback } from 'react';

export interface UseDiscussionRepliesReturn {
  // State
  replyText: Record<string, string>;
  showReplyBox: Record<string, boolean>;

  // Actions
  showReply: (discussionId: string) => void;
  hideReply: (discussionId: string) => void;
  updateReplyText: (discussionId: string, text: string) => void;
  clearReply: (discussionId: string) => void;
  getReplyText: (discussionId: string) => string;
  isReplyBoxVisible: (discussionId: string) => boolean;
}

export const useDiscussionReplies = (): UseDiscussionRepliesReturn => {
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplyBox, setShowReplyBox] = useState<Record<string, boolean>>({});

  const showReply = useCallback((discussionId: string) => {
    setShowReplyBox(prev => ({ ...prev, [discussionId]: true }));
  }, []);

  const hideReply = useCallback((discussionId: string) => {
    setShowReplyBox(prev => ({ ...prev, [discussionId]: false }));
  }, []);

  const updateReplyText = useCallback((discussionId: string, text: string) => {
    setReplyText(prev => ({ ...prev, [discussionId]: text }));
  }, []);

  const clearReply = useCallback((discussionId: string) => {
    setReplyText(prev => {
      const newState = { ...prev };
      delete newState[discussionId];
      return newState;
    });
    setShowReplyBox(prev => {
      const newState = { ...prev };
      delete newState[discussionId];
      return newState;
    });
  }, []);

  const getReplyText = useCallback((discussionId: string) => {
    return replyText[discussionId] || '';
  }, [replyText]);

  const isReplyBoxVisible = useCallback((discussionId: string) => {
    return showReplyBox[discussionId] || false;
  }, [showReplyBox]);

  return {
    replyText,
    showReplyBox,
    showReply,
    hideReply,
    updateReplyText,
    clearReply,
    getReplyText,
    isReplyBoxVisible,
  };
};
