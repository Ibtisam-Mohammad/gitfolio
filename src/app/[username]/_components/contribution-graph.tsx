import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import Image from 'next/image';

export function ContributionGraph({ username }: { username: string }) {
  // Primary color: #FACC15. The service doesn't need the '#'.
  const chartUrl = `https://ghchart.rshah.org/FACC15/${username}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Activity className="w-6 h-6 text-primary" />
          Contribution History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-2 border-2 border-black bg-white">
          {/* Using a standard img tag as the external SVG's dimensions are not fixed */}
          <img
            src={chartUrl}
            alt={`${username}'s Contribution Graph`}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
