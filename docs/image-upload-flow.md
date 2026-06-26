# Image Upload and Rendering Architecture Workflow

This document details the secure sequence of operations executed in **Page & Frame** when a user uploads a media asset to AWS S3 and recovers it for native rendering.

## Architectural Flow Diagram

```text
[ User Action ]
       │
       ▼
 1. Clicks "Attach Image" / "Change Profile Photo"
       │
       ▼
 2. [Expo Image Picker] triggers native OS Gallery/Camera
       │
       ▼
 3. User selects image ──► Local file system path URI generated (e.g., ph://... or file://...)
       │
       ▼
 4. [Mobile App] requests secure signed upload access
       │
       ▼
 5. POST Request ──► [Next.js API Server] (/api/media/presigned)
       │                    │
       │                    ▼ (Validates Session & Credentials)
       │                    │
       │                   AWS SDK signs cryptographic temporal token
       │                    │
       ◄────────────────────┘ Returns: { signedUrl, publicUrl }
       │
       ▼
 6. [Mobile App] converts local URI to binary Blob
       │
       ▼
 7. PUT Request (Binary Blob) ──► Directly to [AWS S3 Bucket] (via signedUrl)
       │                                     │
       │                                     ▼ (Validates Token & Stores File)
       │                                     │
       ◄─────────────────────────────────────┘ Returns: 200 OK Status
       │
       ▼
 8. [Mobile App] syncs metadata reference
       │
       ├──► Updates User Profile document in [Cloud Firestore] (avatarUrl = publicUrl)
       │
       └──► OR Saves relational attach query via [Next.js API] into [PostgreSQL Neon]
       │
       ▼
 9. UI Triggers Screen Re-render
       │
       ▼
10. [RemoteImage Component] receives publicUrl via props
       │
       ├──► Checks device internal storage (Native Disk Cache)
       │          │
       │          ├─── [IF FOUND]: Loads image instantly from Local Disk
       │          │
       │          └─── [IF NOT FOUND]: Downloads asset from AWS S3 publicUrl
       │                     │
       │                     ▼
       │               Displays Loading Spinner (ActivityIndicator)
       │                     │
       │                     ▼
       │               Saves file to Native Disk Cache for future use
       │
       ▼
[ Render Complete ] Visual asset successfully displayed to the user
```

## Technical Breakdown of Key Components

### 1. Security via Presigned URLs
Embedding AWS IAM credentials (`AWS_ACCESS_KEY_ID`) directly inside a mobile application binary leaves the entire storage infrastructure vulnerable to reverse engineering. The pattern enforced here isolates security on the server-side (**Next.js API Gateway**). The generated URL expires strictly after 300 seconds, ensuring that access tokens cannot be reused maliciously.

### 2. Network and Binary Efficiency
The mobile client handles data transport directly with the storage provider via a binary streaming chunk (`fetch` using `PUT` with a direct binary Blob). This bypasses the Next.js node servers for file processing, eliminating payload limits and bandwidth overhead on our server instances.

### 3. Client Performance (Disk Caching)
Network calls to fetch assets degrade battery life and consume user data. The `<Image source={{ uri, cache: 'disk' }}>` implementation instructs the underlying mobile OS (iOS/Android native network cache layer) to index the image payload into safe physical disk structures. Subsequence requests intercept the remote URI and load the visual asset directly from local memory blocks.
