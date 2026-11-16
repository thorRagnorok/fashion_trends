export function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl rounded-sm border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-950">
      <p className="font-medium">Supabase not configured</p>
      <p className="mt-1 text-amber-900/80">
        Copy <code className="rounded bg-amber-100 px-1">.env.example</code> to{" "}
        <code className="rounded bg-amber-100 px-1">.env.local</code>, run the SQL
        migration in <code className="rounded bg-amber-100 px-1">supabase/migrations</code>,
        and restart the dev server.
      </p>
    </div>
  );
}