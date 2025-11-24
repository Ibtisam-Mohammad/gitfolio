import { GitHubUser } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Link as LinkIcon, Twitter, Eye } from 'lucide-react';
import format from 'date-fns/format';

function StatItem({ icon: Icon, value, label }: { icon: React.ElementType, value: number | string, label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span className="font-medium text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}

function InfoLink({ icon: Icon, href, text }: { icon: React.ElementType, href: string | null | undefined, text: string | null | undefined }) {
  if (!text) return null;
  const link = href?.startsWith('http') ? href : `https://${href}`;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span>{text}</span>
    </a>
  );
}

export function HeroSection({ user, views }: { user: GitHubUser, views: number | null }) {
  const name = user.name || user.login;
  const username = user.login;
  const avatarInitial = (user.name?.charAt(0) || user.login.charAt(0)).toUpperCase();

  return (
    <section className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <Avatar className="h-32 w-32 border-2 border-black shadow-hard">
        <AvatarImage src={user.avatar_url} alt={name} className="rounded-none" />
        <AvatarFallback className="text-4xl rounded-none">{avatarInitial}</AvatarFallback>
      </Avatar>
      <div className="flex-grow text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">{name}</h1>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-xl text-muted-foreground hover:text-primary font-headline transition-colors">
          @{username}
        </a>

        {user.bio && <p className="mt-3 max-w-prose text-lg text-muted-foreground">{user.bio}</p>}

        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
          {user.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{user.location}</span>
            </div>
          )}
          <InfoLink icon={LinkIcon} href={user.blog} text={user.blog?.replace(/^https?:\/\//, '')} />
          <InfoLink icon={Twitter} href={`https://twitter.com/${user.twitter_username}`} text={user.twitter_username ? `@${user.twitter_username}` : undefined} />
        </div>

        <div className="mt-4 flex items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm">
          <StatItem icon={Users} value={user.followers} label="followers" />
          <span>&middot;</span>
          <StatItem icon={Users} value={user.following} label="following" />
          {views !== null && (
            <>
              <span>&middot;</span>
              <StatItem icon={Eye} value={views} label="views" />
            </>
          )}
        </div>
        <Badge variant="outline" className="mt-4">Joined {format(new Date(user.created_at), 'MMMM yyyy')}</Badge>
      </div>
    </section>
  );
}
