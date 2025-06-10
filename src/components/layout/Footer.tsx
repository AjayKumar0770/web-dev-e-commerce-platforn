export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Boutique Minimal. All rights reserved.</p>
        <p className="mt-1">Minimalist design for a modern lifestyle.</p>
      </div>
    </footer>
  );
}
