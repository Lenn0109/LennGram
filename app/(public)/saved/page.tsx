'use client';

import { PersonalList } from '@/components/feed/PersonalList';

export default function SavedPage() {
  return (
    <PersonalList
      storageKey="lenngram:saved"
      iconKind="bookmark"
      eyebrow="Saved"
      emptyEyebrow="Nothing here yet"
      emptyTitle="No bookmarks yet."
      emptyBody="Tap the bookmark on any project to keep it for later. Your saved projects live in this browser only."
      emptyCta={{ label: 'Browse projects', href: '/' }}
      populatedTitle={(n) => `${n} saved`}
      populatedSubtitle={() => 'Projects you’ve bookmarked for later.'}
      clearAllLabel="Clear all"
      clearAllConfirm="Remove all saved projects from this browser?"
      removedToast="Removed from saved"
      clearedToast="Saved list cleared"
    />
  );
}
