# SPARK — Asisten Referensi BPJS Ketenagakerjaan

Small Next.js site for asking questions against a set of reference documents.
The browser talks to a Next.js Route Handler. The Route Handler talks to the
OpenAI Responses API and its File Search tool.

The app uses a dark theme, the SF Pro Display font stack, the Spark logo on the
login page and browser tab, and a photo background on the login page.

## Requirements

- Node.js 20.9 or newer
- An OpenAI API key with API billing enabled
- An OpenAI vector store containing your reference files
- A Google OAuth application

An OpenAI ChatGPT subscription is separate from API access. This app needs an
API key from the OpenAI API platform.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a vector store in the OpenAI dashboard, then upload your PDF or text
   reference files to it. Wait until every file has finished processing.

3. Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

4. Add values to `.env.local`:

   ```env
   OPENAI_API_KEY=your_api_key_here
   OPENAI_VECTOR_STORE_ID=vs_your_vector_store_id_here
   OPENAI_MODEL=gpt-5.6-luna
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate_a_long_random_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ALLOWED_EMAIL_DOMAIN=bpjsketenagakerjaan.go.id
   ```

   `OPENAI_MODEL` is optional. The default is `gpt-5.6-luna`.
   `NEXTAUTH_URL` is your app URL. Locally it is `http://localhost:3000`.

   Generate `NEXTAUTH_SECRET` with a password generator or:

   ```bash
   openssl rand -base64 32
   ```

### Google OAuth setup

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Configure the OAuth consent screen.
4. Create an OAuth client ID for a Web application.
5. Add this local redirect URI:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

6. Add the local authorized JavaScript origin:

   ```text
   http://localhost:3000
   ```

7. Add the production redirect URI after deploying:

   ```text
   https://your-domain.com/api/auth/callback/google
   ```

8. Add the production authorized JavaScript origin:

   ```text
   https://your-domain.com
   ```

The application checks the Google account email on the server. Only verified
accounts ending in `ALLOWED_EMAIL_DOMAIN` can sign in. Google’s hosted-domain
parameter only filters the login UI; server validation remains authoritative.

Never use `NEXT_PUBLIC_` for either secret or vector store variables. Never
commit `.env.local`.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production checks:

```bash
npm run lint
npm run build
npm start
```

## Reference documents

The app uses the File Search tool with the vector store named by
`OPENAI_VECTOR_STORE_ID`. The model decides when to search: casual messages are
answered naturally, while BPJS-specific questions trigger document retrieval.

To add or update references:

1. Upload the new PDF or text file to the same vector store in the OpenAI
   dashboard, or through the OpenAI Files and Vector Stores APIs.
2. Wait until processing finishes.
3. Remove outdated files if they should no longer be used.

No app code change is needed when documents change. The route instructs the
model to answer only in Indonesian, prioritize retrieved documents, avoid
guessing, and say when an answer cannot be found in the available references.
The chat shows an Indonesian greeting and does not persist conversations; a
refresh, tab close, or sign-out clears the chat.

## Deploy to Vercel

1. Push this project to a private Git repository.
2. Import the repository into Vercel.
3. Under Project Settings > Environment Variables, add these variables
   (scope them to Production):

   ```env
   OPENAI_API_KEY=your_api_key
   OPENAI_VECTOR_STORE_ID=vs_your_vector_store_id
   OPENAI_MODEL=gpt-5.6-luna
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=your_production_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ALLOWED_EMAIL_DOMAIN=bpjsketenagakerjaan.go.id
   ```

   Generate a production `NEXTAUTH_SECRET` with:

   ```bash
   openssl rand -base64 32
   ```

   Use a different `NEXTAUTH_SECRET` from local development.
4. Redeploy after adding or changing variables so they take effect.

Do not add any secret to source code or a `NEXT_PUBLIC_*` variable. `.env.local`
is ignored by Git and must never be committed.

## Request flow

1. A permitted user signs in with Google.
2. The chat page shows an Indonesian greeting from SPARK.
3. The page sends `{ "messages": [...] }` to `POST /api/chat`.
4. The server validates the session and reads server-only environment values.
5. The server calls `openai.responses.create()` with the File Search tool and
   configured vector store.
6. The model answers casual messages naturally or retrieves document excerpts
   for BPJS-specific questions, always in Indonesian.
7. The server returns `{ "answer": "..." }` to the browser.

The API key never reaches client-side JavaScript. Conversations live only in
browser memory and are erased on refresh or sign-out; this version does not use
a database.
