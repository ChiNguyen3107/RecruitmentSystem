export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground">Trang này đang được phát triển...</p>
      </div>
    </div>
  );
}

