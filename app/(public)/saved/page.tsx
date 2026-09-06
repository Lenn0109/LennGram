import { PersonalList } from '@/components/feed/PersonalList';

export const dynamic = 'force-dynamic';

export default function SavedPage() {
  return (
    <PersonalList
      storageKey="lenngram:saved"
      icon="bookmark"
      iconFilled="bookmark"
      title="Saved"
      subtitle={'Projects you\u2019ve bookmarked.'}
      emptyTitle="No bookmarks yet."
      emptyBody="Tap the bookmark on any project to save it for later. Your bookmarks live in this browser only."
      emptyCta={{ label: 'Browse projects', href: '/' }}
      toastOnRemove="Removed from saved"
    />
  );
}
