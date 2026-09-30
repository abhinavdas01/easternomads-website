import type { SimpleIcon } from 'simple-icons';
import { siAndroid, siApple, siDocker, siFigma, siFlutter, siGooglecloud, siMongodb, siMysql, siNextdotjs, siNodedotjs, siOpenjdk, siPostgresql, siPython, siReact, siSpringboot, siTypescript } from 'simple-icons';
import { cn } from '@/lib/utils';

export type Brand = { name: string; icon: SimpleIcon };

/* The technologies Eastern Nomads builds with for clients (see the Services and Solutions sections). */
const techStack: Brand[] = [
  { name: 'React', icon: siReact },
  { name: 'Next.js', icon: siNextdotjs },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'Node.js', icon: siNodedotjs },
  { name: 'Python', icon: siPython },
  { name: 'Java', icon: siOpenjdk },
  { name: 'Spring Boot', icon: siSpringboot },
  { name: 'PostgreSQL', icon: siPostgresql },
  { name: 'MySQL', icon: siMysql },
  { name: 'MongoDB', icon: siMongodb },
  { name: 'Flutter', icon: siFlutter },
  { name: 'Android', icon: siAndroid },
  { name: 'iOS', icon: siApple },
  { name: 'Figma', icon: siFigma },
  { name: 'Google Cloud', icon: siGooglecloud },
  { name: 'Docker', icon: siDocker },
];

function BrandList({ brands, duplicate = false }: { brands: Brand[]; duplicate?: boolean }) {
  return <ul aria-hidden={duplicate || undefined} className='m-0 flex shrink-0 list-none items-center p-0 animate-infinite-scroll [&_li]:mx-6 sm:[&_li]:mx-10'>
    {brands.map(({ name, icon }) => <li key={name} className='flex items-center gap-3 whitespace-nowrap text-muted-foreground transition-colors duration-300 group-hover:text-neutral-700 hover:text-black!'>
      <svg viewBox='0 0 24 24' aria-hidden='true' className='size-7 fill-current'><path d={icon.path} /></svg>
      <span className='text-lg font-medium tracking-tight'>{name}</span>
    </li>)}
  </ul>;
}

/* Endless logo marquee on a black band that turns white on hover. Logos are cut cleanly at the band's ends.
   The second list is a visual copy so the loop has no seam; screen readers read the first only. */
export function InfinityBrand({ brands = techStack, className }: { brands?: Brand[]; className?: string }) {
  return <div className={cn('group w-full overflow-hidden border-0 border-y border-solid border-border bg-black py-6 transition-colors duration-300 hover:border-white hover:bg-white', className)}>
    <div className='inline-flex w-full flex-nowrap overflow-hidden'>
      <BrandList brands={brands} />
      <BrandList brands={brands} duplicate />
    </div>
  </div>;
}

export const Component = InfinityBrand;
