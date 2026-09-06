'use client';

import { PersonalList } from '@/components/feed/PersonalList';

export default function LikedPage() {
  return (
    <PersonalList
      storageKey="lenngram:liked"
      iconKind="heart"
      eyebrow="Liked"
      emptyEyebrow="Nothing here yet"
      emptyTitle="No likes yet."
      emptyBody="Tap the heart on any project to add it here. Your likes live in this browser only."
      emptyCta={{ label: 'Browse projects', href: '/' }}
      populatedTitle={(n) => (n === 1 ? '1 like' : `${n} likes`)}
      populatedSubtitle={() => 'Projects you’ve found worth keeping.'}
      clearAllLabel="Clear all"
      clearAllConfirm="Remove all liked projects from this browser?"
      removedToast="Removed from liked"
      clearedToast="Liked list cleared"
    />
  );
}
