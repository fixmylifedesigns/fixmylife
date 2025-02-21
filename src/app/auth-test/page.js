"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthTest() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p>Loading authentication status...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Auth Status: {status}</h2>
        {session ? (
          <pre className="bg-white p-4 rounded overflow-auto max-w-xl">
            {JSON.stringify(session, null, 2)}
          </pre>
        ) : (
          <p>Not signed in</p>
        )}
      </div>

      <div className="space-x-4">
        {!session ? (
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Sign in with Google
          </button>
        ) : (
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        )}
      </div>

      {session?.error && (
        <div className="text-red-500 bg-red-50 p-4 rounded">
          <p>Error: {session.error}</p>
        </div>
      )}
    </div>
  );
}
