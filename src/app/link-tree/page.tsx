import { Redis } from '@upstash/redis';

export default async function LinkTreePage() {
  const redis = Redis.fromEnv();
  const keys = await redis.keys('campaign:*');
  
  const links = await Promise.all(keys.map(async (key) => {
    const campaign = await redis.hgetall<{ 
      destination: string; 
      linkTreeEnabled: boolean;
      title?: string;
    }>(key);
    return { ...campaign, slug: key.replace('campaign:', '') };
  }));

  const enabledLinks = links.filter(link => link.linkTreeEnabled);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Link Tree</h1>
      <div className="space-y-4">
        {enabledLinks.map((link) => (
          <a 
            key={link.slug}
            href={`/${link.slug}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">{link.title || link.slug}</h2>
            <p className="text-gray-600 truncate">{link.destination}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
