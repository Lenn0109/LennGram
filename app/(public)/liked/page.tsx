import { PersonalList } from '@/components/feed/PersonalList';

export const dynamic = 'force-dynamic';

export default function LikedPage() {
  return (
    <PersonalList
      storageKey="lenngram:liked"
      icon="heart"
      iconFilled="heart"
      title="Liked"
      subtitle={'Projects you\u2019ve liked.'}
      emptyTitle="No likes yet."
      emptyBody="Tap the heart on any project to add it here. Your likes live in this browser only."
      emptyCta={{ label: 'Browse projects', href: '/' }}
      toastOnRemove="Removed from liked"
    />
  );
}
