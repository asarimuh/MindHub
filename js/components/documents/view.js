function renderDocuments(allFiles) {
  return `
    <div class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight mb-2">Documents</h1>
      <p class="text-muted-foreground">Your Google Drive files and documents</p>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div class="flex-1 max-w-md">
        <input 
          id="documents-search"
          type="text" 
          placeholder="Search documents..."
          class="input w-full"
        />
      </div>
      <div class="flex space-x-2">
       
        <button id="documents-refresh" class="btn btn-primary">
          Refresh
        </button>

        <button class="btn btn-secondary flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
          </svg>
          <span>Sort</span>
        </button>
      </div>
    </div>

    <!-- Documents Grid -->
    <div id="docs-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${renderDocumentsGrid(allFiles)}
    </div>

    <!-- Documents Refresh Failed Modal -->
<div
  id="documents-refresh-failed-modal"
  class="fixed inset-0 z-50 hidden flex items-center justify-center bg-black/40"
>
  <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
    <div class="flex items-start gap-3">
      <div class="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100">
        <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
        </svg>
      </div>

      <div class="flex-1">
        <h3 class="text-sm font-semibold text-gray-900">
          Refresh failed
        </h3>
        <p class="text-sm text-muted-foreground mt-1">
          Could not fetch new documents. Showing the last saved data instead.
        </p>
      </div>
    </div>

    <div class="flex justify-end mt-5">
      <button
        id="close-documents-refresh-modal"
        class="btn btn-secondary text-sm"
      >
        OK
      </button>
    </div>
  </div>
</div>

  `;
}

function renderDocumentsGrid(files) {
  if (!files || files.length === 0) {
    return `
      <div class="flex items-center justify-center p-8 col-span-full">
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-gray-200 h-10 w-10"></div>
          <div class="flex-1 space-y-2 py-1">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return files.map(file => renderDocumentCard(file)).join('');
}

function renderDocumentCard(file) {
  const fileType = file.mimeType ? file.mimeType.replace('application/vnd.google-apps.', '') : 'file';
  const formattedFileType = fileType.charAt(0).toUpperCase() + fileType.slice(1);
  const modifiedDate = file.modifiedTime ? new Date(file.modifiedTime) : new Date();
  const formattedDate = modifiedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `
    <div class="card p-4 cursor-pointer" onclick="window.open('${file.webViewLink}', '_blank')">
      <div class="flex items-start gap-3 mb-3">
        <img src="${file.iconLink}" class="w-8 h-8 mt-1" alt="icon">
        <div class="flex-1 min-w-0">
          <h2 class="font-medium text-base truncate">${file.name}</h2>
          <p class="text-xs text-muted-foreground mt-1">${formattedFileType}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-3">
        <span class="badge">${formattedFileType}</span>
      </div>

      <div class="flex items-center text-xs text-muted-foreground">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Modified: ${formattedDate}
      </div>
    </div>
  `;
}
