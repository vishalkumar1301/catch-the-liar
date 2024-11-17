import LiesOfTheDay from '@/components/LiesOfTheDay';

export default function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-8 mb-6">
        Lies of the Day
      </h1>
      <LiesOfTheDay />
    </div>
  );
}
