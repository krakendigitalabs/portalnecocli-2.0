import "server-only";
import { firebaseConfig, hasFirebasePublicConfig } from "@/lib/firebase/config";

type FirestoreScalarValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { nullValue: null }
  | { timestampValue: string };

type FirestoreArrayValue = {
  arrayValue: {
    values?: FirestoreValue[];
  };
};

type FirestoreMapValue = {
  mapValue: {
    fields?: Record<string, FirestoreValue>;
  };
};

type FirestoreValue =
  | FirestoreScalarValue
  | FirestoreArrayValue
  | FirestoreMapValue;

type FirestoreDocumentResponse = {
  fields?: Record<string, FirestoreValue>;
};

function fromFirestoreValue(value: FirestoreValue): unknown {
  if ("stringValue" in value) {
    return value.stringValue;
  }

  if ("booleanValue" in value) {
    return value.booleanValue;
  }

  if ("integerValue" in value) {
    return Number(value.integerValue);
  }

  if ("doubleValue" in value) {
    return value.doubleValue;
  }

  if ("nullValue" in value) {
    return null;
  }

  if ("timestampValue" in value) {
    return value.timestampValue;
  }

  if ("arrayValue" in value) {
    return (value.arrayValue.values ?? []).map(fromFirestoreValue);
  }

  if ("mapValue" in value) {
    return fromFirestoreFields(value.mapValue.fields ?? {});
  }

  return null;
}

function fromFirestoreFields(
  fields: Record<string, FirestoreValue>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value)]),
  );
}

export async function fetchFirestoreDocument<T>(
  documentPath: string,
): Promise<T | null> {
  if (!hasFirebasePublicConfig()) {
    return null;
  }

  const endpoint = new URL(
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${documentPath}`,
  );

  endpoint.searchParams.set("key", firebaseConfig.apiKey);

  const response = await fetch(endpoint, {
    next: { revalidate: 300 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Firestore request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as FirestoreDocumentResponse;

  if (!payload.fields) {
    return null;
  }

  return fromFirestoreFields(payload.fields) as T;
}
