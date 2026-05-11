"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/bench/code-block";

const bashCode = `#!/usr/bin/env bash
# Verify a Bench'd receipt using curl + openssl
# Requires: curl, jq, openssl, base64

RECEIPT_URL="https://benchd.dev/api/receipt/run_abc123.json"
PUBLIC_KEY_URL="https://benchd.dev/.well-known/benchd-signing-key.pem"

# 1. Fetch the receipt and public key
curl -sL "$RECEIPT_URL" -o receipt.json
curl -sL "$PUBLIC_KEY_URL" -o benchd-public.pem

# 2. Extract the manifest (the signed payload) and signature
MANIFEST=$(jq -r '.manifest' receipt.json)
SIGNATURE=$(jq -r '.signature' receipt.json)

# 3. Write the manifest to a temp file for openssl
echo -n "$MANIFEST" > /tmp/benchd-manifest.bin

# 4. Decode the base64 signature
echo -n "$SIGNATURE" | base64 -d > /tmp/benchd-sig.bin

# 5. Verify the Ed25519 signature
openssl pkeyutl -verify \\
  -pubin -inkey benchd-public.pem \\
  -rawin -in /tmp/benchd-manifest.bin \\
  -sigfile /tmp/benchd-sig.bin

# Expected output: "Signature Verified Successfully"

# 6. Optional: verify Merkle root integrity
MERKLE_ROOT=$(echo "$MANIFEST" | jq -r '.merkleRoot')
echo "Merkle root: $MERKLE_ROOT"

# Clean up
rm -f /tmp/benchd-manifest.bin /tmp/benchd-sig.bin`;

const pythonCode = `"""Verify a Bench'd receipt using PyNaCl (Ed25519)."""

import json
import base64
import requests
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError

RECEIPT_URL = "https://benchd.dev/api/receipt/run_abc123.json"
PUBLIC_KEY_HEX = (
    "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
    "e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
)

# 1. Fetch the receipt
response = requests.get(RECEIPT_URL)
receipt = response.json()

# 2. Extract manifest and signature
manifest_bytes = json.dumps(
    receipt["manifest"], separators=(",", ":"), sort_keys=True
).encode("utf-8")
signature_bytes = base64.b64decode(receipt["signature"])

# 3. Load the public key
verify_key = VerifyKey(bytes.fromhex(PUBLIC_KEY_HEX))

# 4. Verify the signature
try:
    verify_key.verify(manifest_bytes, signature_bytes)
    print("Signature verified successfully.")
except BadSignatureError:
    print("ERROR: Signature verification failed!")
    raise SystemExit(1)

# 5. Print verified scores
scores = receipt["manifest"]["scores"]["verified"]
print(f"  Recall:    {scores['recall']}")
print(f"  Temporal:  {scores['temporal']}")
print(f"  Reasoning: {scores['reasoning']}")
print(f"  Overall:   {scores['overall']}")`;

const jsCode = `import nacl from "tweetnacl";

const RECEIPT_URL = "https://benchd.dev/api/receipt/run_abc123.json";
const PUBLIC_KEY_HEX =
  "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" +
  "e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2";

async function verifyReceipt() {
  // 1. Fetch the receipt
  const res = await fetch(RECEIPT_URL);
  const receipt = await res.json();

  // 2. Encode the manifest deterministically
  const manifestStr = JSON.stringify(receipt.manifest, Object.keys(receipt.manifest).sort());
  const manifestBytes = new TextEncoder().encode(manifestStr);

  // 3. Decode the signature from base64
  const sigBytes = Uint8Array.from(
    atob(receipt.signature),
    (c) => c.charCodeAt(0)
  );

  // 4. Decode the public key from hex
  const pubKeyBytes = new Uint8Array(
    PUBLIC_KEY_HEX.match(/.{2}/g).map((b) => parseInt(b, 16))
  );

  // 5. Verify the Ed25519 signature
  const valid = nacl.sign.detached.verify(
    manifestBytes,
    sigBytes,
    pubKeyBytes
  );

  if (valid) {
    console.log("Signature verified successfully.");
    const scores = receipt.manifest.scores.verified;
    console.log(\`  Recall:    \${scores.recall}\`);
    console.log(\`  Temporal:  \${scores.temporal}\`);
    console.log(\`  Reasoning: \${scores.reasoning}\`);
    console.log(\`  Overall:   \${scores.overall}\`);
  } else {
    console.error("ERROR: Signature verification failed!");
    process.exit(1);
  }
}

verifyReceipt();`;

export function VerifyTabs() {
  return (
    <Tabs defaultValue="bash" className="w-full">
      <TabsList className="bg-muted/50 border border-border">
        <TabsTrigger value="bash" className="font-mono text-xs">
          bash
        </TabsTrigger>
        <TabsTrigger value="python" className="font-mono text-xs">
          python
        </TabsTrigger>
        <TabsTrigger value="javascript" className="font-mono text-xs">
          javascript
        </TabsTrigger>
      </TabsList>
      <TabsContent value="bash" className="mt-3">
        <CodeBlock
          code={bashCode}
          language="bash"
          title="verify-receipt.sh"
          maxHeight="480px"
        />
      </TabsContent>
      <TabsContent value="python" className="mt-3">
        <CodeBlock
          code={pythonCode}
          language="python"
          title="verify_receipt.py"
          maxHeight="480px"
        />
      </TabsContent>
      <TabsContent value="javascript" className="mt-3">
        <CodeBlock
          code={jsCode}
          language="javascript"
          title="verify-receipt.mjs"
          maxHeight="480px"
        />
      </TabsContent>
    </Tabs>
  );
}
