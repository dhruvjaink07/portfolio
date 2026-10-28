// Lets a long address wrap before the "@" instead of mid-word on narrow screens.
export default function EmailText({ email }: { email: string }) {
  const at = email.indexOf('@');
  if (at === -1) return <>{email}</>;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}
